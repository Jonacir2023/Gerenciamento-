# Backend próprio — Supabase (fundação de autenticação/RBAC)

Data: 18/09/2026. Primeiro passo do item "Backend/autenticação/RBAC" da lista de pendências
(`docs/Matriz_de_Paridade.md`, `docs/CONTINUIDADE.md`).

## O que existe agora

Projeto Supabase novo e exclusivo do Gerenciamento, criado nesta data:

- **Projeto:** `gerenciamento` (id `gfoyxquyumvvkikbuylw`), organização `Jonacir2023's Org`, região
  `sa-east-1`. Não usa nem altera o projeto `P3` já existente na mesma organização.
- **URL:** `https://gfoyxquyumvvkikbuylw.supabase.co`
- **Chave publicável (anon):** ver no painel do Supabase (Project Settings → API) — não é segredo,
  protegida inteiramente por RLS, mas não fica hardcoded nesta nota para não precisar atualizar o
  documento se a chave for rotacionada.
- **Migrações versionadas** em `supabase/migrations/`, aplicadas em ordem:
  1. `001_schema_base.sql` — tabelas (perfis, obras, usuario_obra, pessoas, atividades_cadastro,
     equipamentos, veiculos_frota, assuntos, assuntos_historico, reunioes, diarios,
     diario_revisoes, auditoria) e as funções auxiliares de autorização.
  2. `002_rls_policies.sql` — Row Level Security em toda tabela, isolamento por obra via
     `usuario_obra`, e restrição de papel (ex.: só gestor/engenheiro aprova RDO).
  3. `003_hardening_authz_functions.sql` — move os helpers de autorização para o schema `authz`,
     fora do que o PostgREST expõe como API pública.
  4. `004_hardening_trigger_function.sql` — fecha a mesma exposição para a função do gatilho de
     imutabilidade do diário aprovado.
  5. `005_fix_authz_grants.sql` — **corrige um engano da migração 003**: as políticas de RLS
     chamam as funções de `authz` durante a própria avaliação, o que exige `GRANT EXECUTE` para o
     papel `authenticated` mesmo sendo `SECURITY DEFINER`. Revogar esse grant (como a 004 fez, por
     engano, também nas de authz) quebra a autorização para todo usuário real — descoberto ao
     testar, não em teoria. Registrado aqui em vez de reescrever a migração 003, porque o erro e a
     correção são parte do histórico auditável.

`get_advisors` (segurança) roda limpo depois da migração 005, exceto um item de configuração de
Auth do projeto (não é schema): **"Leaked Password Protection Disabled"** — o Supabase pode checar
senhas contra vazamentos conhecidos (HaveIBeenPwned); é um toggle no painel
(Authentication → Policies → Password), não uma migração SQL. Pendente de ativação manual.

## O que foi testado de verdade (não é teoria)

Testado executando SQL como usuários simulados (`set local role authenticated` +
`request.jwt.claims`), com dados de teste inseridos e depois apagados — a base ficou zerada ao
final, pronta para dados reais:

1. **Isolamento entre obras (cenário 1 do Prompt Global, §13):** usuário vinculado só à Obra A não
   viu o assunto da Obra B numa consulta que retorna as duas linhas sem RLS — confirmado por
   `SELECT` retornando só a linha da Obra A.
2. **Escrita cruzada bloqueada:** o mesmo usuário tentando `INSERT` um assunto na Obra B recebeu
   `42501 new row violates row-level security policy` — a política de escrita nega, não apenas a
   de leitura.
3. **Aprovação de RDO exige papel (cenário 2, §13):** usuário com papel `apontador` na Obra A
   tentando aprovar (`status='aprovado'`) o próprio diário foi barrado pela mesma política de RLS.
   Um segundo usuário, com papel `gestor` na Obra A, aprovou com sucesso.
4. **Diário aprovado é imutável (cenário 8, §13):** o mesmo gestor que aprovou, tentando depois
   alterar o campo `campos` do diário já aprovado, foi barrado pelo gatilho
   (`bloquear_edicao_diario_aprovado`) — a trava vale até para quem aprovou, a correção só pode
   entrar por `diario_revisoes`.

## O que isto NÃO é ainda

**O frontend (`src/`) não fala com este backend.** Os três módulos (Pauta, Check-in, Diário)
continuam gravando em `localStorage`/`window.__storage`, com o Apps Script (`server/Gerenciamento.gs`)
como integração opcional de planilha/fotos/backup — exatamente como estava antes desta migração.
Esta entrega é só a fundação (schema + RLS + testes de isolamento), não a troca do backend em uso.

**Decisão arquitetural que fica registrada aqui, para não consolidar dois backends por acidente**
(`docs/CONTINUIDADE.md` já pedia isso): a partir de agora, **Supabase é a fonte de verdade proposta
pelo Prompt_Global** para dados estruturados, permissões e auditoria. O Apps Script existente
continua servindo só como ponte para o que ele já faz bem — planilha do Google, fotos no Drive,
backup em arquivo — e não deve crescer para reimplementar RBAC ou virar uma segunda fonte de
verdade para os mesmos dados. Migrar o frontend de fato (trocar `window.__storage`/`gerRequest` por
chamadas Supabase autenticadas) é o próximo trabalho real, não incluído nesta entrega.

## Próximos passos reais (não é só teste)

1. Cliente Supabase no navegador (`@supabase/supabase-js` embutido, mesmo padrão de vendor sem CDN
   já usado para `html2canvas`/`jsPDF`) e fluxo de autenticação (e-mail/senha ou magic link).
2. Migrar `GerenciamentoModules`/`gerRequest` para gravar em Supabase em vez de `localStorage`
   puro, com fila local para operar offline (o prompt exige isso — ver `Matriz_de_Requisitos.csv`).
3. Tela de administração de `usuario_obra` (hoje só existe a tabela e a política; não há UI para
   gestor convidar/vincular alguém a uma obra).
4. MFA real no Supabase Auth para operações sensíveis (aprovação de RDO, alteração de orçamento
   quando esse módulo existir).
