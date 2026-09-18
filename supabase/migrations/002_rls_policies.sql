alter table perfis enable row level security;
alter table obras enable row level security;
alter table usuario_obra enable row level security;
alter table pessoas enable row level security;
alter table atividades_cadastro enable row level security;
alter table equipamentos enable row level security;
alter table veiculos_frota enable row level security;
alter table assuntos enable row level security;
alter table assuntos_historico enable row level security;
alter table reunioes enable row level security;
alter table diarios enable row level security;
alter table diario_revisoes enable row level security;
alter table auditoria enable row level security;

-- PERFIS: cada usuário só vê/edita o próprio perfil; nunca o próprio papel_global
-- (proprietário não nasce de edição de perfil comum — regra explícita do prompt).
create policy perfis_select_proprio on perfis for select using (id = auth.uid() or eh_proprietario());
create policy perfis_insert_proprio on perfis for insert with check (id = auth.uid());
create policy perfis_update_proprio on perfis for update using (id = auth.uid())
  with check (id = auth.uid() and papel_global = (select papel_global from perfis p where p.id = auth.uid()));

-- OBRAS: só quem tem vínculo ativo enxerga a obra; criar obra é ação de proprietário
-- (cadastro de obra nova não é autoatribuível por qualquer usuário).
create policy obras_select on obras for select using (obra_permitida(id) or eh_proprietario());
create policy obras_insert_proprietario on obras for insert with check (eh_proprietario());
create policy obras_update_gestor on obras for update using (papel_na_obra(id) = 'gestor' or eh_proprietario());

-- USUARIO_OBRA: ver só os vínculos das obras às quais já se pertence;
-- só gestor da obra (ou proprietário) atribui/revoga papel — nunca o próprio usuário.
create policy usuario_obra_select on usuario_obra for select
  using (obra_permitida(obra_id) or eh_proprietario());
create policy usuario_obra_insert_gestor on usuario_obra for insert
  with check (papel_na_obra(obra_id) = 'gestor' or eh_proprietario());
create policy usuario_obra_update_gestor on usuario_obra for update
  using (papel_na_obra(obra_id) = 'gestor' or eh_proprietario());
create policy usuario_obra_delete_gestor on usuario_obra for delete
  using (papel_na_obra(obra_id) = 'gestor' or eh_proprietario());

-- Cadastros por obra: qualquer papel vinculado lê; escrita para papéis
-- operacionais (fiscalização/cliente só leem, não cadastram equipamento/pessoa).
create policy pessoas_select on pessoas for select using (obra_permitida(obra_id));
create policy pessoas_write on pessoas for all
  using (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'))
  with check (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'));

create policy atividades_cadastro_select on atividades_cadastro for select using (obra_permitida(obra_id));
create policy atividades_cadastro_write on atividades_cadastro for all
  using (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'))
  with check (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'));

create policy equipamentos_select on equipamentos for select using (obra_permitida(obra_id));
create policy equipamentos_write on equipamentos for all
  using (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'))
  with check (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'));

create policy veiculos_frota_select on veiculos_frota for select using (obra_permitida(obra_id));
create policy veiculos_frota_write on veiculos_frota for all
  using (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'))
  with check (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'));

-- Pauta: todo vinculado lê; escrita para todos, exceto fiscalização/cliente (só leitura).
create policy assuntos_select on assuntos for select using (obra_permitida(obra_id));
create policy assuntos_write on assuntos for all
  using (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'))
  with check (papel_na_obra(obra_id) not in ('fiscalizacao','cliente'));

create policy assuntos_historico_select on assuntos_historico for select
  using (obra_permitida((select obra_id from assuntos a where a.id = assunto_id)));
create policy assuntos_historico_insert on assuntos_historico for insert
  with check (obra_permitida((select obra_id from assuntos a where a.id = assunto_id)));

-- Check-in: ata é escrita uma vez e não tem UPDATE liberado a ninguém por
-- política (histórico imutável); leitura para todo vinculado.
create policy reunioes_select on reunioes for select using (obra_permitida(obra_id));
create policy reunioes_insert on reunioes for insert
  with check (obra_permitida(obra_id) and papel_na_obra(obra_id) not in ('fiscalizacao','cliente'));

-- Diário/RDO: leitura para todo vinculado. Inserir/editar rascunho é dos papéis
-- operacionais; aprovar (status='aprovado') e revisar depois de aprovado é
-- só de gestor/engenheiro — condição verificada nas duas linhas (antiga e nova).
create policy diarios_select on diarios for select using (obra_permitida(obra_id));
create policy diarios_insert on diarios for insert
  with check (obra_permitida(obra_id) and papel_na_obra(obra_id) not in ('fiscalizacao','cliente'));
create policy diarios_update on diarios for update
  using (obra_permitida(obra_id))
  with check (
    obra_permitida(obra_id)
    and (status = 'rascunho' or papel_na_obra(obra_id) in ('gestor','engenheiro'))
  );

create policy diario_revisoes_select on diario_revisoes for select
  using (obra_permitida((select obra_id from diarios d where d.id = diario_id)));
create policy diario_revisoes_insert on diario_revisoes for insert
  with check (papel_na_obra((select obra_id from diarios d where d.id = diario_id)) in ('gestor','engenheiro'));

-- Auditoria: só leitura, só de quem tem vínculo com a obra do registro
-- (ou proprietário); nenhuma política de escrita — só entra por função
-- security definer (ver migração seguinte), nunca por INSERT direto do cliente.
create policy auditoria_select on auditoria for select
  using (obra_id is null or obra_permitida(obra_id) or eh_proprietario());
