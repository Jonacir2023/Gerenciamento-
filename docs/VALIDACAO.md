# Validação — 0.1.0

Ambiente: Linux do workspace, Node.js para testes nativos e Python 3 para geração. Data: 15/09/2026.

Executado com sucesso:

- `python3 build.py`: gerou as duas entradas HTML autocontidas.
- `node --check src/app.js`: sintaxe válida.
- `node tests/domain.test.cjs`: 11 cenários de domínio PASS.

Cenários: cancelado fora de atraso/conclusão; prazo de hoje; rejeição de estado desconhecido; motivo de cancelamento; motivo de reabertura; impedir transferência de tarefa por edição; ata não muda após editar demanda; ata rejeita demanda de outra obra; 25 campos de RDO e ausência preservada; múltiplas contribuições sem sobrescrita; efetivo inteiro não negativo.

O teste de vínculo local verifica uma regra de domínio, não autenticação ou isolamento de acesso real.

Não executado: testes em navegador, responsividade observada, impressão real, IndexedDB em Safari/Chrome/Firefox, concorrência real de abas, uso em dois dispositivos, offline/sincronização, restauração de backup, autenticação, RLS, servidor, migração, integrações ou produção. Não há aprovação do piloto. Os testes de domínio não comprovam prontidão operacional.

Antes de homologar esta interface: abrir HTML baixado; editar e recarregar uma demanda; confirmar cancelamento; registrar reunião, editar a demanda e conferir ata; cadastrar duas contribuições de mesmo dia; trocar obra; conferir filtros/CSV; imprimir ata e diário; exportar JSON; repetir em tela pequena e teclado; simular falha de armazenamento e duas abas. O JSON exportado ainda exige processo de restauração a implementar.

WebMCP: consulta opcional somente de leitura para demandas da obra ativa implementada por detecção de capacidade. Validação no contexto WebMCP: indisponível/não executada; não é requisito de execução do HTML. Nenhum dado é enviado automaticamente para API externa.

Revisão documental de independência: prompt corrigido e conferido integralmente, com 15 seções e 13 módulos; pacote sem nomes ou identificadores de outros projetos. Repositório local sem remotos. O código executável permanece o mesmo; esta revisão não é nova homologação funcional.

## Validação — 0.2.0, importação para o repositório próprio (18/09/2026)

Ambiente: sessão Claude Code na nuvem, Node.js 22 e Python 3.11. Repositório `Jonacir2023/gerenciamento-` (privado, independente, criado nesta data).

Repetido e aprovado antes do commit inicial:

- `python3 build.py`: gerou `dist/Gerenciamento.html` e `dist/index.html` (576.129 bytes cada, após as correções abaixo).
- `node --check` em `src/app.js`, `src/core.js`, `src/modules-host.js`, `src/modules/common.js`, `src/modules/diary-extra.js`, no script embutido de `src/modules/checkin.html` (extraído e checado isoladamente) e em `server/Gerenciamento.gs` (copiado para `.js` e checado como sintaxe JavaScript pura): sem erro em nenhuma unidade.
- `node tests/domain.test.cjs`: 11/11 cenários de domínio aprovados, sem regressão.

**Executado pela primeira vez nesta data — teste funcional real em navegador** (Chromium via Playwright, headless, servindo `dist/` por HTTP local), cobrindo a pendência nº 2 do resumo de continuidade ("verificação visual e funcional", nunca executada até então):

- Shell carrega, seletor de obras lista as duas obras de teste.
- Os três módulos (Pauta, Check-in, Diário) montam dentro do iframe sem exceção JS não tratada (`pageerror`).
- Aba Resumo do Check-in, período mensal, renderiza sem falha.
- Modal de configuração (`.config-modal`) abre com `top`/`height` iguais à fatia visível do iframe — a correção de posicionamento (`gerFixModalPositioning`, `src/modules/common.js`) funciona também para esse modal, que não estava coberto pelo seletor original (só `.modal-overlay`).
- Sem `pageerror`; apenas avisos esperados de sandbox do iframe (`allow-scripts`+`allow-same-origin`), já documentados como comportamento aceito do projeto.

**Bug encontrado por execução, não por leitura de código, e corrigido:** a contagem de "Atrasados" no Check-in (aba Resumo, Dashboard e quadro Kanban legado) comparava `Date.now()` (instante atual) contra a meia-noite do prazo — isso fazia qualquer prazo com vencimento **hoje** aparecer como atrasado a partir da meia-noite e um minuto, embora a regra de negócio ("prazo de hoje não é atraso") já estivesse corretamente implementada e testada em `core.js`. Antes da correção, o Resumo mensal mostrava 3 atrasados nos dados de exemplo; o valor correto é 1. Corrigido substituindo a comparação por instante por comparação de data (`hojeISO()`/`diasAteVencimento()` em `src/modules/checkin.html`), e reconfirmado pelo mesmo teste em navegador (resultado passou a 1).

**Outro bug de contagem corrigido (leitura de código, sem execução de UI para este caso específico):** em três lugares do Check-in (Resumo, Dashboard e aging por assunto), demandas **canceladas** com prazo vencido eram contadas como atrasadas, e o percentual "concluído" usava o total de assuntos (incluindo cancelados) como denominador. Ambos contrariam a regra "cancelado não conta como atraso nem como pendência ativa" já aplicada em `atualizarContadores()` (o contador fixo do cabeçalho) e no núcleo (`core.js`, testado). Alinhado às mesmas regras.

Não executado nesta rodada: teste em dispositivo móvel/tablet, impressão real (PDF do navegador), captura PNG (`html2canvas`) ponta a ponta, Apps Script em execução real, autenticação/RBAC, sincronização entre dois dispositivos, backup/restauração completos, quota de armazenamento de fotos sob estresse. Continuam como pendência aberta, sem instrução para o próximo passo.

## Validação — recuperação do Diário, área 1/7: Atividades Paralisadas e Veículos/Equipamentos Parados (18/09/2026)

Após confirmar com o usuário que `referencias-originais/diario-obras-v4.html` (179 funções, ver
`docs/Matriz_de_Paridade.md`) é a fonte de verdade, recuperada a primeira das 7 áreas ausentes: o
campo oficial 19 do contrato do Diário ("Veículos/Equipamentos Parados") e o registro de atividades
paralisadas com justificativa — nenhum dos dois tinha UI antes desta rodada.

Verificado:
- `python3 build.py`: gera as duas saídas (584.813 bytes cada).
- `node --check` em todos os arquivos JS/HTML tocados (incluindo o script extraído de
  `diario.html` isoladamente): sem erro.
- `node tests/domain.test.cjs`: 11/11, sem regressão.
- **Teste real em navegador (Playwright/Chromium), ponta a ponta**, pelo fluxo real de tela (sem
  atalho de estado interno, já que `state`/`currentDay` são variáveis de módulo, não acessíveis de
  fora do iframe):
  1. Cadastrar atividade padrão pelo modal real (`abrirModalAtividade`/`salvarAtividade`).
  2. Abrir o modal de atividade paralisada, selecionar a atividade recém-cadastrada, salvar com
     justificativa — `currentDay.atividadesParalisadas` passa a ter 1 item, lista renderiza.
  3. Editar a justificativa direto na lista (input inline) — persiste sem re-render perder o foco.
  4. Lista de "Veículos/Equipamentos Parados" mostra os 5 equipamentos de exemplo (nenhum em uso
     hoje), cada um com campo de justificativa; salvar uma justificativa persiste em
     `currentDay.veiculosParados`.
  5. `gerarRelatorio()` (texto real usado para copiar/WhatsApp) inclui as duas novas seções.
  6. `gerBuildPayload()` (contrato oficial de 25 campos, `diary-extra.js`) grava a justificativa da
     atividade paralisada dentro do campo `atividades`, e `veiculosParados` deixou de ser apenas
     "equipamento em uso com status ≠ Operando" (interpretação estreita e diferente do campo 19
     oficial) para refletir corretamente "equipamentos e veículos cadastrados sem uso hoje, com
     motivo".
- Sem `pageerror` durante o fluxo.

Não executado: as outras 6 áreas da lista (apontador, PDF, assinatura, fotos com legenda/compressão,
backup automático ao carregar, modal de IA) continuam pendentes, sem mudança nesta rodada.

## Validação — recuperação do Diário, áreas 2, 5, 6 e 7/7 (18/09/2026)

Continuação da rodada anterior. Recuperadas: apontador (seleção por cadastro em vez de texto
livre), fotos (legenda + compressão), backup na nuvem (checagem automática ao carregar). A área 7
(modal de "Perguntar à IA") foi avaliada e decidida como já equivalente — ver `Matriz_de_Paridade.md`.

Verificado:
- `python3 build.py`, `node --check` em todos os arquivos tocados, `node tests/domain.test.cjs`
  (11/11): sem erro, sem regressão.
- **Teste real em navegador (Playwright/Chromium)**, pelo fluxo de UI real (cadastro de
  colaborador pelo modal de verdade, não injeção direta de estado):
  1. Cadastrado colaborador com função "Apontador" via `abrirModalColaborador`/`salvarColaborador`
     reais. O `<select>` do campo Apontador no Diário passou a listar esse colaborador
     (`999 – Fulano de Tal`), selecioná-lo persiste em `currentDay.apontador`, e o relatório de
     texto (`gerarRelatorio()`) passou a conter "Apontador: 999 – Fulano de Tal".
  2. Upload de uma imagem PNG de teste pelo campo real `#ger-fotos`: a foto salva ficou com
     `dataUrl` no formato `data:image/jpeg` (confirma a compressão — o arquivo original era PNG),
     e o campo de legenda, preenchido e disparado via evento `change`, apareceu no relatório
     ("Fachada bloco A").
  3. `gerAppVazio()` chamado com os dados de semente presentes retornou `false` (correto — não
     deveria oferecer restauração automática havendo dados locais), e chamar
     `gerChecarRestauracaoAutomatica()` sem nenhum serviço de nuvem configurado não lançou exceção
     nem exibiu o banner (a falha de rede é engolida silenciosamente por design, sem incomodar o
     usuário numa verificação em segundo plano).
  4. Campo de pergunta à IA (`ger-question`/`ger-ask`) confirmado presente e sem regressão.
- Sem `pageerror` em nenhum passo.

Não executado: cenário real com serviço Apps Script configurado e um backup de fato disponível na
nuvem (exigiria um backend implantado — fora do escopo desta base local). O caminho “banner aparece
e o clique restaura” não foi exercitado fim a fim; só a condição de guarda (`gerAppVazio`) e o
silêncio ao falhar foram confirmados.

Restava da lista original de 7 áreas: **PDF do RDO** e **Assinatura digital**. Decisão do usuário:
PDF via `html2canvas`+`jsPDF` (ambos embutidos, sem CDN); assinatura como registro visual informal,
sem valor jurídico, com aviso explícito no próprio documento.

## Validação — recuperação do Diário, áreas 3 e 4/7: PDF do RDO e assinatura digital (18/09/2026)

Adicionado `src/vendor/jspdf-4.2.1.umd.min.js` (MIT, baixado do registro oficial do npm
— `npm pack jspdf@4.2.1` —, licença conferida e copiada para `jspdf-4.2.1.LICENSE.txt`) e
embutido apenas no módulo Diário (`build.py`), junto com o `html2canvas` que antes só existia no
Check-in. O HTML gerado cresceu de ~590 KB para ~1,25 MB — custo aceito para um app de arquivo
único offline, registrado aqui para não passar despercebido.

Verificado:
- `python3 build.py`, `node --check src/modules/diary-extra.js`, `node tests/domain.test.cjs`
  (11/11): sem erro, sem regressão.
- **Teste real em navegador (Playwright/Chromium), ponta a ponta, com arquivo de verdade gerado**:
  1. Confirmado `html2canvas` e `window.jspdf.jsPDF` carregados dentro do iframe do Diário.
  2. Preenchidos observações e RDO Nº pelos campos reais; preview do PDF aberto
     (`gerAbrirPdfPreview`) mostra o conteúdo montado, incluindo o texto preenchido.
  3. Caixa de assinatura clicável abre o modal do canvas. Tentativa de salvar sem desenhar nada
     foi recusada ("Assine antes de salvar") — a mesma trava do aplicativo original.
  4. Traço desenhado no canvas (eventos de ponteiro reais disparados sobre o elemento) e salvo:
     modal fecha, a caixa de assinatura no preview passa a mostrar a imagem.
  5. `gerGerarPdfArquivo()` executado de verdade: arquivo baixado, **281.466 bytes, com o
     cabeçalho `%PDF-` de um PDF válido**.
- Sem `pageerror` nem erro de console em todo o fluxo.

**Escopo declarado, não uma limitação escondida:** o PDF usa os campos que o Gerenciamento coleta
hoje; não reproduz as seções do original que dependem de um modelo de dados mais rico que a base
atual não tem (clima por período com praticabilidade e mm de chuva, efetivo próprio vs.
terceirizado, horímetro inicial/final por equipamento, status por atividade). Ver
`docs/Matriz_de_Paridade.md` para o detalhe.

Não executado: teste em dispositivo móvel/tablet real (o canvas de assinatura usa eventos de
ponteiro, que cobrem mouse e toque, mas não foi testado em touch real); PDF com muitas fotos
grandes (o corte de página é automático via divisão do canvas único em fatias de A4, não testado
com conteúdo extremamente longo).
