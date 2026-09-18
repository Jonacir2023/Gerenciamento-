-- Perfis autenticados (1:1 com auth.users)
create table perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  papel_global text not null default 'usuario' check (papel_global in ('proprietario','usuario')),
  criado_em timestamptz not null default now()
);

-- Obras
create table obras (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  empresa text,
  cidade text,
  tipo text,
  arquivada boolean not null default false,
  criado_em timestamptz not null default now()
);

-- Vínculo usuário x obra x papel — a base do RBAC por obra.
-- Papel não é auto-atribuível pelo próprio usuário (ver política mais abaixo).
create table usuario_obra (
  usuario_id uuid not null references perfis(id) on delete cascade,
  obra_id uuid not null references obras(id) on delete cascade,
  papel text not null check (papel in ('gestor','engenheiro','tecnico','analista','encarregado','apontador','administrativo','fiscalizacao','cliente')),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  primary key (usuario_id, obra_id)
);

-- Funções auxiliares de autorização, usadas nas políticas de RLS.
create or replace function obra_permitida(p_obra_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from usuario_obra uo
    where uo.obra_id = p_obra_id and uo.usuario_id = auth.uid() and uo.ativo
  );
$$;

create or replace function papel_na_obra(p_obra_id uuid) returns text
language sql stable security definer set search_path = public as $$
  select papel from usuario_obra where obra_id = p_obra_id and usuario_id = auth.uid() and ativo limit 1;
$$;

create or replace function eh_proprietario() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from perfis where id = auth.uid() and papel_global = 'proprietario');
$$;

-- Cadastros por obra
create table pessoas (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references obras(id) on delete cascade,
  matricula text not null,
  nome text not null,
  funcao text,
  categoria text,
  empresa text, -- vazio = mão de obra própria; preenchido = terceirizado
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  unique(obra_id, matricula)
);

create table atividades_cadastro (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references obras(id) on delete cascade,
  descricao text not null,
  local text,
  unidade text,
  criado_em timestamptz not null default now()
);

create table equipamentos (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references obras(id) on delete cascade,
  numero text,
  descricao text not null,
  eh_motorista boolean not null default false,
  criado_em timestamptz not null default now()
);

create table veiculos_frota (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references obras(id) on delete cascade,
  descricao text not null,
  placa text,
  tipo text,
  criado_em timestamptz not null default now()
);

-- Pauta / demandas
create table assuntos (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references obras(id) on delete cascade,
  assunto text not null,
  descricao text,
  criador text,
  responsavel text,
  setor text,
  prioridade text not null default 'media' check (prioridade in ('alta','media','baixa')),
  status text not null default 'afazer' check (status in ('afazer','fazendo','concluido','cancelado','conciliacao')),
  data_lancamento date,
  data_termino date,
  justificativa_cancelamento text,
  criado_em timestamptz not null default now(),
  concluido_em timestamptz,
  atualizado_em timestamptz not null default now()
);

create table assuntos_historico (
  id uuid primary key default gen_random_uuid(),
  assunto_id uuid not null references assuntos(id) on delete cascade,
  de_status text,
  para_status text not null,
  motivo text,
  usuario_id uuid references perfis(id),
  criado_em timestamptz not null default now()
);

-- Check-in de gestão
create table reunioes (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references obras(id) on delete cascade,
  titulo text not null,
  tipo text not null default 'Diária',
  data date not null,
  hora time not null,
  participantes text,
  decisoes text,
  snapshot_assuntos jsonb not null default '[]', -- retrato imutável no momento da reunião
  criado_por uuid references perfis(id),
  criado_em timestamptz not null default now()
);

-- Diário de obras / RDO
create table diarios (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references obras(id) on delete cascade,
  data date not null,
  frente text not null default 'geral',
  autor_id uuid references perfis(id),
  apontador text,
  rdo_numero text, -- só preenchido na aprovação
  status text not null default 'rascunho' check (status in ('rascunho','aprovado')),
  aprovado_em timestamptz,
  aprovado_por uuid references perfis(id),
  campos jsonb not null default '{}', -- os 25 campos do contrato + extensões
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique(obra_id, data, frente, autor_id)
);

create table diario_revisoes (
  id uuid primary key default gen_random_uuid(),
  diario_id uuid not null references diarios(id) on delete cascade,
  campos jsonb not null,
  motivo text not null,
  criado_por uuid references perfis(id),
  criado_em timestamptz not null default now()
);

-- Trava de imutabilidade: um diário aprovado não pode ter seus campos
-- reescritos por UPDATE direto — correção é sempre uma nova linha em
-- diario_revisoes, mantendo o aprovado original intacto e auditável.
create or replace function bloquear_edicao_diario_aprovado() returns trigger
language plpgsql as $$
begin
  if old.status = 'aprovado' and new.campos is distinct from old.campos then
    raise exception 'Diário aprovado não pode ser editado diretamente. Registre uma revisão em diario_revisoes.';
  end if;
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger trg_bloquear_edicao_diario_aprovado
  before update on diarios
  for each row execute function bloquear_edicao_diario_aprovado();

-- Auditoria
create table auditoria (
  id bigint generated always as identity primary key,
  usuario_id uuid references perfis(id),
  obra_id uuid references obras(id),
  acao text not null,
  entidade text not null,
  entidade_id uuid,
  antes jsonb,
  depois jsonb,
  criado_em timestamptz not null default now()
);
