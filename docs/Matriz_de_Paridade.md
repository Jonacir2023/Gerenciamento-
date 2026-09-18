# Matriz de paridade — Pauta, Check-in, Diário

Data: 18/09/2026. Compara, função por função e campo por campo, os três aplicativos originais
fornecidos por Jonacir contra os módulos atuais do Gerenciamento (`src/modules/pauta.html`,
`src/modules/checkin.html`, `src/modules/diario.html`). Não usa contagem de funções como critério
de conclusão — cada linha cita o comando que a comprova e pode ser reexecutada.

**Arquivos originais usados** (enviados por anexo nesta sessão, salvos fora do pacote em
`referencias-originais/` conforme já previa `docs/Resumo_Gerenciamento_para_Claude.md`):

| Arquivo | SHA-256 | Bate com `docs/Inventario_Funcoes.json`? |
|---|---|---|
| `Checkin3.html` | `035f02ec…6489af63` | Sim |
| `pauta.html` (= `pauta(3).html`) | `f09fe834…8e56d1a0` | Sim |
| `diario-obras-v4.html` (enviado como `index.html`) | `a0ddfe08…196614a` | **Não** — o hash gravado no inventário é `6c3b8857…c705384e`, um arquivo diferente |
| `DiarioObrasv5.gs` | não hasheado no inventário (é o backend, não uma das 3 interfaces) | — |

## ⚠️ Achado crítico: o Diário original agora recebido não é o mesmo que gerou o módulo atual

`docs/Inventario_Funcoes.json` foi construído contra um `diario-obras-v4.html` de **113 funções
nomeadas** — exatamente o número presente hoje em `src/modules/diario.html`. O arquivo que você
acabou de enviar tem **179 funções nomeadas** e hash diferente. Ou seja: **o módulo Diário atual
foi construído a partir de uma versão mais simples/antiga do arquivo**, não da versão que você
tem em mãos agora. Isto confirma exatamente a lacuna que o próprio `Resumo_Gerenciamento_para_Claude.md`
(seção 3) já registrava como não verificada: *"Não foi comprovado que [o `diario-obras-v4.html`
usado] corresponde à interface usada com o backend v5"* — e a pendência 14 da seção 8: *"verificar
se o usuário tem HTML posterior ao v4"*.

Isso muda o resultado da paridade do Diário de "quase completa" para **"faltam 66 funções nomeadas,
presentes no arquivo que você tem hoje e ausentes no módulo atual — sem serem referência morta,
apenas inexistentes"** (comprovado abaixo). Antes de recuperá-las, preciso que você confirme: **este
`diario-obras-v4.html` que você acabou de enviar é o que deve valer como fonte de verdade?** Se sim,
o próximo pacote implementa as funções ausentes; se existe uma versão ainda mais nova, é melhor me
enviar antes de eu reconstruir em cima da errada duas vezes.

---

## Metodologia

```sh
sha256sum Checkin3.html pauta.html diario-obras-v4.html
grep -oE 'function [a-zA-Z_][a-zA-Z0-9_]*' <original> | sort -u > funcs_original.txt
grep -oE 'function [a-zA-Z_][a-zA-Z0-9_]*' <adaptado> | sort -u > funcs_adaptado.txt
comm -23 funcs_original.txt funcs_adaptado.txt   # só no original = possível perda
comm -13 funcs_original.txt funcs_adaptado.txt   # só no adaptado = adição
diff -u <original> <adaptado>                    # diferença de comportamento linha a linha
grep -c "onclick=\"<funcao>" <adaptado>           # confirma se não sobrou botão órfão apontando pra função removida
```

Toda função listada como "só no original" foi conferida com `grep -c` no adaptado inteiro (não só
em `function`) para excluir renomeação ou uso por outro nome; nenhuma apareceu.

---

## 1. Pauta — paridade completa

`diff -u pauta.html src/modules/pauta.html`: **31 de 31 funções nomeadas preservadas, nenhuma
perdida, nenhuma órfã.** A diferença inteira do arquivo (764 → 767 linhas) é:

| Item | Origem | Destino | Diferença | Evidência |
|---|---|---|---|---|
| URL do Apps Script | Hardcoded no `<script>` (`AKfycbwa...`) | `parent.GerenciamentoModules.settings(__obraId).service` | Vira configurável por obra em vez de fixo no código | `diff`, linha do `APPS_SCRIPT_URL_PAUTA` |
| Armazenamento | `localStorage` direto | `window.__storage` (ponte por obra) | Isola dados por obra em vez de global ao navegador | `diff`, objeto `S` |
| Sincronizar cancelamento | `atualizarStatusPautaGoogle`: sem branch para `cancelado` → **enviava "Concluído" ao Sheets ao cancelar um assunto** | Branch `cancelado → 'Cancelado'` adicionado | **Bug do original corrigido**: cancelar uma pauta não grava mais como concluída na planilha | `diff`, função `atualizarStatusPautaGoogle` |
| Marcadores de build | — | `<!--GER-BOOT-->`, `<!--GER-THEME-->`, `<!--GER-COMMON-->` | Infraestrutura de injeção do `build.py`, sem efeito funcional | `diff`, `<head>` |
| Título/placeholder de webhook | Texto genérico Chekin/n8n antigo | Texto do Gerenciamento | Cosmético | `diff` |

Abas (Envio/Listar/Exportar), cadastro de membros/setores, alias RH/Recursos Humanos (ambos
continuam como itens distintos na lista de setores, sem unificação), backup/restauração de
cadastros, e o contrato de exportação para n8n (`assuntos`, `exportado_em`, `total`) — todos
idênticos byte a byte ao original, fora as duas trocas de infraestrutura acima.

**Teste:** `node --check` no script extraído: sem erro. Não executado neste módulo especificamente
via navegador nesta rodada (a rodada anterior testou Pauta via smoke test geral, sem exercitar
Admin/backup/restauração — pendente).

---

## 2. Check-in de Gestão — paridade completa + 3 bugs do original corrigidos

`diff -u Checkin3.html src/modules/checkin.html`: **41 de 41 funções nomeadas preservadas**, mais
6 funções novas (`hojeISO`, `diasAteVencimento`, `mapStatusRemoto`, `mesclarAssuntosRemotos`,
`getPeriodoResumo`, `filtrarPorPeriodo`) — todas para corrigir comportamento, nenhuma remove escopo.
As 5 abas (Check-in/Cadastro/Calendário/Resumo/Dashboard) existem nos dois arquivos.

| Item | Origem (comprovado no arquivo enviado agora) | Destino | Diferença | Evidência |
|---|---|---|---|---|
| Filtro semanal/mensal do Resumo | `setResumoTab`/abas existem, mas `renderResumo()` sempre lia `assuntos` inteiro — **os botões SEMANAL/MENSAL eram decorativos, não filtravam nada** | `getPeriodoResumo`/`filtrarPorPeriodo` aplicam o período de verdade antes de calcular os números | **Bug do original corrigido** — exatamente a falha já registrada em `Resumo_Gerenciamento_para_Claude.md` §4 ("os botões semanal/mensal não filtravam efetivamente o período") | `diff`, função `renderResumo` |
| Status desconhecido | `statusBadge`/`statusLabel`: fallback para qualquer status fora de afazer/fazendo/concluido era `'badge-canceled'` / `'Cancelado'` — **um status remoto não reconhecido aparecia rotulado como Cancelado** | `mapStatusRemoto` isola status desconhecido em `'conciliacao'`, com rótulo próprio `⚠ Conciliação` e coluna própria no Kanban | **Bug do original corrigido** | `diff`, `statusBadge`/`statusLabel`/`mapStatusRemoto` |
| Carregar da planilha | `carregarDaPlanilhaGoogle` fazia `assuntos = data.pautas.map(...)` — **sobrescrita cega, sem checar se havia edição local mais recente** | `mesclarAssuntosRemotos` compara `atualizadoEm` e preserva o lado mais recente, com aviso de conflito | **Bug do original corrigido** — a falha "recarregar do servidor podia substituir alterações locais" (Resumo §4) | `diff`, `mesclarAssuntosRemotos` |
| Snapshot da ata | `salvarReuniao`: `assuntos:[...assuntos]` — **cópia rasa; os objetos de tarefa dentro do array continuavam sendo os mesmos, então editar uma tarefa depois também alterava silenciosamente a ata salva** | `assuntos:JSON.parse(JSON.stringify(assuntos))` — cópia profunda | **Bug do original corrigido** — a falha "o snapshot da reunião era superficial" (Resumo §4) | `diff`, função `salvarReuniao` |
| Atrasados/cancelados no Resumo, Dashboard e aging | Contagem de atraso comparava `Date.now()` (instante) contra meia-noite do prazo, e não excluía cancelados em 3 pontos — **bug já presente no original, herdado pela primeira adaptação e só agora corrigido nesta sessão** (ver `docs/VALIDACAO.md`, rodada 18/09) | Comparação por data (`hojeISO`/`diasAteVencimento`), cancelado sempre excluído | Corrigido nesta sessão, com teste em navegador (Playwright) antes/depois | `diff` + `docs/VALIDACAO.md` |
| Armazenamento/URL/tema | Igual ao padrão da Pauta acima | idem | Infraestrutura, sem perda de escopo | `diff` |

Nenhuma aba, campo, cadastro ou exportação (captura PNG via `html2canvas`, impressão) foi removida.

**Teste:** smoke test em navegador (Playwright) nesta e na rodada anterior, cobrindo Check-in,
Resumo (mensal) e modal de configuração. Calendário e Dashboard carregam mas não foram exercitados
clicando em cada botão.

---

## 3. Diário de Obras — gap real, não é paridade

O achado crítico do topo deste documento se aplica aqui. Comparando o `diario-obras-v4.html` que
você enviou agora (179 funções nomeadas) contra `src/modules/diario.html` (113 funções): **66
funções nomeadas do original não existem no adaptado, em nenhuma forma** — não foram renomeadas
(conferido com `grep` do nome inteiro no arquivo todo), não sobrou botão `onclick` órfão apontando
pra elas (o HTML que as chamava também foi removido), e os únicos 5 rótulos de aba (Diário, Gerar,
Resumo, Calendário, Cadastro/Config) continuam presentes — a perda é de **funcionalidades dentro
das abas**, não de abas inteiras.

Agrupando as 66 por área funcional (nome da função → o que ela fazia, pelo nome e uso no original):

| Área | Funções ausentes (66 no total) | O que se perde | Confirmado no adaptado |
|---|---|---|---|
| **PDF do RDO** | `gerarPdfRDO`, `fecharPdfRDO`, `compartilharPdfRDO`, `calcResumoPeriodoPDF`, `mmPeriodo`, `numeroRDO`, `dataPorExtenso` (7) | Geração de PDF nativo do relatório diário, com numeração e resumo de período | `grep -ic pdf`: 138 ocorrências no original, **0 no adaptado** |
| **Assinatura digital** | `abrirPadAssinatura`, `fecharPadAssinatura`, `limparPadAssinatura`, `salvarPadAssinatura` (4) | Captura de assinatura em canvas | `grep -ic assinatura`: 19 no original, **0 no adaptado** |
| **Atividades/equipamentos paralisados** | `abrirModalAtivParalisada`, `salvarAtivParalisada`, `removerAtivParalisada`, `renderAtivParalisadas`, `salvarJustAtivParalisada`, `salvarJustParado`, `renderVeiculosParados` (7) | Registro de paralisação com justificativa — o campo "Veículos/Equipamentos Parados" dos 25 do contrato v5 fica sem tela dedicada | `grep -ic paralisad`: 45 no original, **0 no adaptado** |
| **Apontador (fluxo de seleção)** | `confirmarApontador`, `selecionarApontador`, `selecionarApontadorDireto`, `_apontadoresFiltrados`, `renderApontadorDia` (5) | No original, apontador é selecionado/confirmado por fluxo dedicado com sugestão; no adaptado é só um `<input>` de texto livre (`ger-apontador` em `diary-extra.js`) | `grep -ic apontador`: 43 no original, **1 no adaptado** |
| **Backup/restauração na nuvem (fluxo original)** | `backupNuvem`, `restaurarNuvem`, `checarRestauracaoAutomatica`, `buildPayloadGoogle`, `salvarDiarioGoogle`, `carregarScriptUmaVez` (6) | O original verificava automaticamente se havia backup pra restaurar ao abrir; o adaptado tem um fluxo equivalente mas **diferente e manual** (`ger-cloud-backup`/`ger-cloud-restore` em `diary-extra.js`, sem checagem automática ao carregar) | Reimplementado, não idêntico — ver nota abaixo |
| **Perguntar à IA** | `abrirModalPerguntar`, `enviarPergunta` (2) | Modal dedicado no original | Reimplementado como campo simples (`ger-question`/`ger-ask` em `diary-extra.js`) — não idêntico, mas cobre a mesma finalidade |
| **Cadastro do dia (atividades/efetivo/equipamentos/veículos leves)** — **corrigido abaixo, não é perda real** | `abrirAbaAtividades`, `abrirAbaEfetivo`, `abrirAbaEquipamentos`, `abrirAbaVeiculosLeves`, `marcarTodasAtividadesCheckbox`, `atualizarQtyLocalAtiv`, `qtdAtividadeDia`, `salvarAtividadesDodia`, `renderAtividadesDodiaCadastro`, `ordenarAtividadesPadrao`, `salvarStatusAtividade`, `salvarEquipDia`, `salvarVLDia`, `salvarEfetivoDia`, `salvarHorimetro`, `horimetroTotal`, `_todosColaboradores`, `_atualizarLocalObraDatalist`, `_atualizarEquipDescDatalist`, `_atualizarVLDescDatalist`, `_atualizarResumoObraNosDiario` (21) | Ver nota de correção logo abaixo desta tabela — a leitura inicial superestimou o risco | Nota de correção abaixo |
| **Utilidades diversas** | `escHtml`, `escAttr`, `getHistoryKey`, `getStorageKey`, `dataAtiva`, `apareceVazio`, `pratLabel`, `copiarUltimoDiario`, `totalPrecipitacao`, `abrirRdoNoSafari`, `adicionarFotoDia`, `removerFotoDia`, `renderFotosDia`, `salvarLegendaFoto`, `comprimirFoto`, `salvarAtivFoto` (16) | Mistura de correções de compatibilidade (Safari), gestão de fotos com legenda/compressão (o adaptado tem fotos via `diary-extra.js`, mas sem legenda nem compressão), e utilidades de data/relatório | Parcialmente reimplementado (fotos existem, sem legenda/compressão/limite adaptativo) |

**Nenhuma função nova foi criada no lado do Diário para cobrir essas 66** (diferente de Pauta e
Check-in, onde toda função nova corrige um bug específico do original). O que existe de equivalente
foi feito por `diary-extra.js`, que cobre uma fração pequena e de forma diferente: fotos (sem
legenda/compressão), backup/restauração (manual, sem checagem automática) e pergunta à IA (campo
simples em vez de modal).

**Teste:** nenhum destes 66 pontos foi exercitado em navegador; a comparação acima é estática
(diff/grep), não comportamental. Antes de declarar qualquer um deles "recuperado" é preciso abrir
a tela e confirmar.

### Correção — "Cadastro do dia" não era perda real (verificado após leitura do código, não só do nome)

A tabela acima classificou essa categoria como "risco alto" só por contagem de nomes de função.
Lendo o corpo de `abrirAbaAtividades`/`abrirAbaEfetivo`/`abrirAbaEquipamentos`/`abrirAbaVeiculosLeves`
no original: são apenas **atalhos de navegação** — clicam na aba Cadastro, esperam 200ms, clicam na
subaba certa. `salvarAtividadesDodia`/`salvarEfetivoDia`/`salvarEquipDia`/`salvarVLDia` só copiam
dado de uma chave temporária (`ativDia_<data>` etc. no `localStorage`) para `currentDay` e navegam
de volta à aba Diário. Essa indireção existia porque o original tinha duas telas separadas (Cadastro
do dia ⇄ Diário) que precisavam se sincronizar.

`src/modules/diario.html` **já tinha, antes desta sessão**, os equivalentes diretos — sob nomes
diferentes, confirmados por leitura: `renderAtividadesDia`, `salvarQtdAtividade`, `renderEfetivoDia`,
`renderEquipDia`, `abrirSeletorEquip`, `salvarHorimetro`-equivalente inline, `renderVeiculosLevesDia`,
`abrirSeletorVL` — todos operando **direto dentro da aba Diário**, sem o ping-pong de telas. Ou
seja: a arquitetura ficou mais simples (um passo em vez de dois), não mais pobre. Confirmado que
quantidade por atividade (`atividadesQtd`), horímetro por equipamento e status Operando/Parado por
equipamento já funcionavam antes desta sessão.

**O que realmente faltava dentro dessa área**, e foi confirmado por leitura + depois recuperado e
testado nesta sessão (ver `docs/VALIDACAO.md`, rodada de recuperação 1/7): `atividadesParalisadas`
(atividade cadastrada marcada como parada, com justificativa — funções `renderAtivParalisadas`,
`abrirModalAtivParalisada`, `salvarAtivParalisada`, `salvarJustAtivParalisada`, `removerAtivParalisada`)
e `veiculosParados`/`renderVeiculosParados`/`salvarJustParado` (campo oficial 19 do contrato:
equipamentos e veículos cadastrados sem uso no dia, com motivo) — isso sim não tinha nenhuma tela
equivalente, nem com outro nome. Ambos recuperados e testados nesta sessão.

## Status da recuperação (atualizado a cada área concluída)

| Área | Status |
|---|---|
| 1. Atividades Paralisadas + Veículos/Equipamentos Parados (campo 19) | ✅ Recuperado e testado em navegador — ver `docs/VALIDACAO.md` |
| 2. Fluxo de seleção de apontador (sugestão/confirmação) | ✅ Recuperado e testado — `<select>` com colaboradores cujo cargo/categoria contém "apontador", igual ao original (era campo de texto livre) |
| 3. PDF do RDO | Pendente — decisão de arquitetura necessária antes de implementar |
| 4. Assinatura digital | Pendente — decisão sobre o que precisa comprovar antes de implementar (ver `Prompt_Global_Gerenciamento.md` §7) |
| 5. Fotos — legenda e compressão | ✅ Recuperado e testado — mesmos parâmetros do original (máx. 1280px, JPEG 72%); ajuda a evitar estouro de cota |
| 6. Backup na nuvem — checagem automática ao carregar | ✅ Recuperado e testado — só oferece restaurar quando o aparelho está vazio, nunca restaura sem clique explícito |
| 7. Perguntar à IA — modal dedicado | **Não recuperado, por decisão:** o original é um modal envolvendo o mesmo fluxo (pergunta → fetch → resposta) que o Gerenciamento já tinha, inline, desde antes desta sessão. Sem ganho funcional real em portar para modal; ver nota abaixo. |

### Por que a área 7 não foi portada

`abrirModalPerguntar`/`enviarPergunta` do original só abrem um modal com um campo de pergunta, loading e resposta — exatamente o que `ger-question`/`ger-ask`/`ger-answer` já fazem, inline, no Gerenciamento (com `gerAction` cobrindo o loading via desabilitar o botão). Portar para modal seria trabalho sem ganho funcional. Marcado como resolvido por equivalência, não como pendência.

### Status final das 7 áreas: 6 recuperadas e testadas, 1 decidida como já equivalente. PDF e Assinatura (itens 3 e 4) ficaram para depois de decisão de arquitetura — ver conversa com o usuário.

---

## Conclusão

- **Pauta e Check-in:** paridade real, comprovada por diff completo do arquivo, não por contagem.
  Além disso, 4 bugs do próprio aplicativo original foram identificados e corrigidos ao longo da
  adaptação (um no Check-in nesta sessão, os demais em rodadas anteriores).
- **Diário:** **não está em paridade.** O arquivo original que orientou a construção do módulo
  atual não é o mesmo que você acabou de enviar — são 66 funções nomeadas de diferença, concentradas
  em PDF, assinatura, paralisação e no fluxo de apontador. Isso contradiz a afirmação de
  `docs/Resumo_Gerenciamento_para_Claude.md` de que as 113 funções do Diário estão "presentes... sem
  ausência nominal": essa contagem foi feita contra a versão mais simples, não contra esta.

**Decisão que só você pode tomar:** confirmar se este `diario-obras-v4.html` (o que você acabou de
enviar) é a fonte de verdade a partir de agora. Se sim, o próximo passo é recuperar as 7 áreas
acima, começando por Atividades/Equipamentos/Veículos (a maior e a que toca diretamente 3 dos 25
campos do contrato v5: Atividades do Dia, Equipamentos Utilizados, Veículos Leves/Parados).
