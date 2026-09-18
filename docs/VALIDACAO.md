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
