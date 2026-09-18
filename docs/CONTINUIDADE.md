# Continuidade — Gerenciamento

Regra máxima: novo produto independente. Nunca clonar, vincular ou alterar repositórios existentes como base deste projeto. Se publicado no GitHub, criar um repositório novo contendo integralmente código e documentação, sem dependências de repositórios anteriores. Nenhum remoto foi configurado nesta entrega.

Estado: versão 0.1.0 de avaliação individual local. Entrega não é piloto homologado. Artefato executável: dist/Gerenciamento.html. Leia README, Projeto_e_Implantacao, matriz CSV e VALIDACAO antes de continuar. A fonte normativa é docs/Prompt_Global_Gerenciamento.md, que contém as 15 seções e os 13 módulos completos. Nenhum arquivo histórico de outro projeto integra este pacote.

Implementado: núcleo de obras, demandas, reuniões e rascunhos RDO; 25 campos; IndexedDB; exportação JSON/CSV; impressão; escopo de todos os módulos explicitado. Onze testes de domínio passaram. Nenhum teste de navegador ou de backend foi executado.

Próximo incremento: fundação própria de identidade e persistência no servidor com vínculos por obra e ações autorizadas, começando por obras e demandas. Use o pacote de projeto como proposta revisável. Não aplicar migrações em nenhum ambiente anterior. Não habilitar mensagens externas sem autorização.

Os módulos ausentes permanecem no backlog e no prompt completo. Não rotular base local como produto pronto, nem contar filtro visual como segurança ou armazenamento local como sincronização. Preserve a origem de cada requisito e registre evidência ao avançar status.

## Atualização — 18/09/2026

Repositório próprio criado: `Jonacir2023/gerenciamento-` (privado, sem vínculo com repositórios anteriores). Estado real agora é **v0.2.0**: os três módulos originais (Pauta, Check-in de Gestão, Diário de Obras) foram incorporados em iframe `srcdoc` com o layout novo, conforme `docs/Resumo_Gerenciamento_para_Claude.md`.

Verificado nesta atualização, com evidência (ver `docs/VALIDACAO.md`, seção 0.2.0): primeiro teste funcional real em navegador (Playwright/Chromium) dos três módulos; correção de um bug de contagem de "atrasados" no Check-in que classificava prazos de **hoje** como atraso (achado pela própria execução, não por leitura de código); correção da contagem de cancelados em três pontos do Check-in (Resumo, Dashboard, aging); extensão da correção de posicionamento de modal (`gerFixModalPositioning`) para cobrir também `.config-modal`; arquivo de licença dedicado para o `html2canvas` incorporado.

Ainda pendente, sem mudança nesta atualização: matriz de paridade completa por função/fluxo contra os três apps originais; backend Apps Script nunca implantado/testado contra o Google real; autenticação/RBAC (qualquer um com a URL manipula `obra_id`); sincronização remota do Check-in ainda substitui lista local em vez de reconciliar de fato em todos os fluxos (criar/editar/excluir); backup/restauração completos (IndexedDB × módulos) sem validação ponta a ponta; teste em dispositivo móvel/tablet; impressão e captura PNG reais.

## Atualização — 18/09/2026 (2ª rodada): matriz de paridade e recuperação do Diário

Usuário enviou os 4 arquivos originais (`Checkin3.html`, `pauta(3).html`, `diario-obras-v4.html`,
`DiarioObrasv5.gs`), agora preservados em `referencias-originais/`. Matriz de paridade real (por
diff/hash, não contagem) em `docs/Matriz_de_Paridade.md`: Pauta e Check-in em paridade completa,
mais 4 bugs do próprio aplicativo original corrigidos ao longo da adaptação. Diário: achado
crítico — o `diario-obras-v4.html` enviado tem hash diferente do que gerou o módulo atual (179 vs
113 funções); usuário confirmou que o arquivo enviado é a fonte de verdade.

Das 7 áreas do Diário identificadas como ausentes, todas as 7 foram concluídas nesta rodada
(estendida ao longo do dia): Atividades Paralisadas + Veículos/Equipamentos Parados (campo oficial
19), seleção de apontador por cadastro, fotos com legenda e compressão, checagem automática de
backup na nuvem ao carregar (sem nunca restaurar sem clique explícito), PDF do RDO
(`html2canvas`+`jsPDF` embutidos, por decisão do usuário) e assinatura digital em canvas (registro
visual informal, sem valor jurídico, por decisão do usuário). Uma área ("Perguntar à IA" em modal)
foi avaliada e decidida como já equivalente ao que existia, sem precisar de mudança.

O PDF do RDO usa só os campos que o Gerenciamento coleta hoje; não reproduz seções do original que
dependem de um modelo de dados mais rico (clima por período, efetivo terceirizado, horímetro
inicial/final, status por atividade) — ver `docs/Matriz_de_Paridade.md`. O HTML gerado cresceu de
~590 KB para ~1,25 MB por causa das duas bibliotecas embutidas (html2canvas + jsPDF, ambas MIT,
sem CDN).

Próximo incremento sugerido: revisitar o modelo de dados do Diário para as seções do PDF ainda não
cobertas, ou avançar para as pendências dos módulos Pauta/Check-in listadas na atualização anterior
(matriz de paridade completa por campo, backend real, autenticação/RBAC).

## Atualização — 18/09/2026 (3ª rodada): fundação de backend real (Supabase)

Criado projeto Supabase próprio e exclusivo (`gerenciamento`, id `gfoyxquyumvvkikbuylw`, região
`sa-east-1`), na mesma organização do usuário mas sem tocar no projeto `P3` já existente. Schema,
RLS e testes de isolamento documentados em `docs/Backend_Supabase.md`; migrações versionadas em
`supabase/migrations/`.

Testado de verdade via SQL simulando usuários (não é teoria): usuário vinculado só à Obra A não lê
nem escreve na Obra B; aprovar RDO exige papel gestor/engenheiro (apontador é barrado pela própria
política de RLS); diário aprovado é imutável mesmo para quem aprovou (correção só por nova revisão).
Segurança (`get_advisors`) limpa depois de mover os helpers de autorização para fora do schema
exposto por API — um engano no meio do caminho (revogar `EXECUTE` demais e quebrar a própria RLS)
foi corrigido e fica registrado como migração própria, não escondido.

**Decisão arquitetural registrada:** Supabase passa a ser a fonte de verdade proposta pelo Prompt
Global para dados estruturados/permissões/auditoria. O Apps Script (`server/Gerenciamento.gs`)
continua só como ponte para planilha/Drive/backup, sem crescer para reimplementar RBAC.

**Isto é só a fundação.** O frontend (`src/`) continua gravando em `localStorage` como antes —
nenhuma tela foi ligada ao banco novo ainda. Migrar de fato (cliente Supabase no navegador,
autenticação, trocar `gerRequest`/`window.__storage` por chamadas autenticadas com fila offline) é
o próximo trabalho real, não uma tarefa de teste.

## Atualização — 18/09/2026 (4ª rodada): sincronização de criar/editar/excluir

Fechado o gap nº 2 da lista de pendências: criar/editar pelo Cadastro do Check-in e remover em
Pauta e Check-in nunca tinham contraparte remota no aplicativo original — só a mudança de status
chegava à planilha. Backend (`server/Gerenciamento.gs`) ganhou `path=pauta&action=atualizar`
(edição completa) e `path=pauta&action=excluir` (exclusão lógica, coluna "Excluído"); os dois
módulos passaram a chamar esses endpoints depois de salvar localmente. Testado ponta a ponta contra
um stub HTTPS local simulando o Apps Script (não um Apps Script real implantado) — as 5
requisições esperadas (criar/excluir na Pauta; criar/atualizar/excluir no Check-in) chegaram na
ordem certa com o payload certo. Detalhe em `docs/VALIDACAO.md` e `docs/Matriz_de_Paridade.md`.

Da lista de pendências desta sessão, restam: modelo de dados mais rico do Diário (clima por
período, terceirizados, horímetro inicial/final, status por atividade — necessário para o PDF
completo), WIP transacional no servidor, e os módulos M06–M13 inteiros. O item de backend segue
como fundação (schema Supabase pronto, frontend ainda não ligado).
