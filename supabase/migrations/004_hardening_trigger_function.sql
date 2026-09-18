-- Função de gatilho, não é endpoint de API: fecha a RPC pública.
-- Disparo do trigger em UPDATE continua funcionando (não depende de GRANT EXECUTE
-- do papel que faz o UPDATE, só da execução interna do gatilho).
revoke execute on function public.bloquear_edicao_diario_aprovado() from anon, authenticated, public;
