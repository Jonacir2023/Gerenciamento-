-- Correção de um engano da migração 003: mover para o schema authz (fora do
-- que o PostgREST expõe) já fecha a RPC pública sozinho — não é preciso (e é
-- errado) revogar EXECUTE do papel authenticated dessas três funções, porque
-- as próprias políticas de RLS chamam authz.obra_permitida()/papel_na_obra()
-- durante a avaliação da política, e isso exige GRANT EXECUTE para o papel
-- que está rodando a consulta (aqui, `authenticated`), mesmo sendo SECURITY
-- DEFINER. Sem o grant, toda política que usa essas funções passa a falhar
-- com "permission denied" para qualquer usuário autenticado real — foi
-- exatamente o que este projeto viu ao testar (ver docs/Backend_Supabase.md).
grant usage on schema authz to anon, authenticated;
grant execute on function authz.obra_permitida(uuid) to anon, authenticated;
grant execute on function authz.papel_na_obra(uuid) to anon, authenticated;
grant execute on function authz.eh_proprietario() to anon, authenticated;
