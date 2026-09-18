-- Os helpers de autorização só existem para uso interno das políticas de RLS —
-- não são endpoint de API. Tirar do schema public (exposto via PostgREST)
-- fecha a RPC pública sem quebrar as políticas: Postgres referencia função
-- por OID na policy compilada, então mover de schema não invalida nada.
create schema if not exists authz;
alter function public.obra_permitida(uuid) set schema authz;
alter function public.papel_na_obra(uuid) set schema authz;
alter function public.eh_proprietario() set schema authz;

revoke execute on function authz.obra_permitida(uuid) from anon, authenticated, public;
revoke execute on function authz.papel_na_obra(uuid) from anon, authenticated, public;
revoke execute on function authz.eh_proprietario() from anon, authenticated, public;

-- search_path fixo também no trigger de imutabilidade do diário aprovado.
create or replace function public.bloquear_edicao_diario_aprovado() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if old.status = 'aprovado' and new.campos is distinct from old.campos then
    raise exception 'Diário aprovado não pode ser editado diretamente. Registre uma revisão em diario_revisoes.';
  end if;
  new.atualizado_em = now();
  return new;
end;
$$;
