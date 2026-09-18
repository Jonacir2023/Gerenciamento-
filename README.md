# Gerenciamento

Versão 0.1.0 — 15/09/2026 — primeira base de avaliação local.

Aplicativo novo de gerenciamento de obras, solicitado por Jonacir da Silva Cazelli. **Este projeto é independente de qualquer repositório GitHub existente.** Todo o código desta base foi criado neste projeto. Nenhum código externo, credencial, banco ou serviço dos projetos anteriores é necessário para executar esta versão.

## Abrir o aplicativo

Baixe `dist/Gerenciamento.html` e abra em Chrome, Edge, Firefox ou Safari atualizado, com JavaScript e armazenamento local permitidos. O arquivo contém todo o CSS e JavaScript; não carrega fontes, bibliotecas ou serviços de terceiros. A visualização de arquivos dentro de algumas plataformas pode bloquear scripts; nesse caso abra o arquivo baixado no navegador.

A tela começa com duas obras fictícias e seis demandas de exemplo. Todos os registros criados aqui são **de teste**. A obra ativa aparece no seletor superior. Esta versão não possui login nem proteção de dados entre pessoas que utilizam o mesmo navegador.

## O que está implementado nesta base

- Cadastro e seleção de obras de teste; registros separados por `obraId` no modelo.
- Pauta e quadro de tarefas compartilhando os mesmos registros: criar, editar, filtrar, exportar CSV e consultar histórico.
- Estados A Fazer, Fazendo, Concluído e Cancelado. Cancelamento/reabertura exigem justificativa; cancelados não contam como atrasados nem concluídos.
- Check-in de gestão: participantes, data, hora, demandas vinculadas, decisões e retrato profundo da pauta. A ata permanece igual quando a tarefa é alterada. O resumo textual é registrado manualmente.
- Diário com os 25 campos de referência, data operacional, múltiplas contribuições por dia/autor, edição de rascunhos e impressão.
- Indicadores derivados dos registros da obra ativa, sem inventar avanço físico, PPC ou valores financeiros.
- Impressão de diário e ata, permitindo salvar como PDF pela função do navegador. Sem assinatura e sem aprovação oficial.
- Persistência em IndexedDB confirmada pelo fim da transação; conflito de revisão entre abas bloqueia sobrescrita. Exportação completa em JSON e recorte da pauta em CSV.
- Tela que informa a situação de cada um dos 13 módulos do escopo.

## Limites desta entrega

**Isto é uma base demonstrativa, não o piloto operacional homologado nem a plataforma inteira pronta.** Não use dados reais ou sensíveis.

Não há backend, autenticação, RBAC, RLS, sincronização entre aparelhos, migração do legado, recuperação automatizada do backup, aprovação, numeração oficial, upload de evidências, WIP transacional de servidor, IA, WhatsApp, orçamento, planejamento ou BIM operacional. As fotos do RDO são apenas texto/referência. O mapa de implantação conserva todos esses requisitos.

Os dados ficam no navegador/perfil/origem que abriu o arquivo; limpar dados, usar modo privado ou mover o aplicativo pode impedir acesso ao armazenamento anterior. Exporte antes de qualquer mudança. O JSON contém todos os registros e serve para preservação e futura importação validada; não há botão de restauração nesta versão. IndexedDB não é motor de sincronização nem backup remoto. O isolamento visual entre obras não substitui autorização no servidor. Rascunhos de RDO são editáveis; revisões imutáveis oficiais pertencem a uma etapa posterior.

## Projeto completo e independente

- `src/`: código integral do aplicativo e da interface.
- `dist/Gerenciamento.html`: aplicativo portátil autocontido.
- `dist/index.html`: mesmo aplicativo como entrada estática convencional.
- `build.py`: geração reproduzível sem dependências Python externas.
- `tests/domain.test.cjs`: testes do domínio, usando apenas módulos nativos do Node.js.
- `docs/Prompt_Global_Gerenciamento.md`: prompt consolidado, com nome e independência como regras prioritárias.
- `docs/Projeto_e_Implantacao.md`: diagnóstico, arquitetura proposta, dados, permissões e sequência.
- `docs/Matriz_de_Requisitos.csv`: requisitos, fontes, paridade, aceite, dependências e fases.
- `docs/VALIDACAO.md`: verificações executadas e limites.
- `docs/CONTINUIDADE.md`: estado e próximo pacote.
- A especificação é autocontida. Arquivos históricos de outros projetos não integram este pacote.

## Gerar e verificar

```sh
python3 build.py
node --check src/app.js
node tests/domain.test.cjs
```

Requer Python 3 para geração e Node.js 20 ou posterior para testes (não necessários para abrir o HTML). Não requer npm, instalação de bibliotecas, CDN ou conexão de rede. Não existem dependências de pacotes externos e portanto não há lockfile de pacotes a fabricar.

Duas bibliotecas de terceiros vêm embutidas em `src/vendor/` (texto puro no repositório, incorporadas ao HTML final por `build.py`, sem CDN em execução): `html2canvas` 1.4.1 (captura de imagem do Check-in e páginas do PDF do Diário) e `jsPDF` 4.2.1 (montagem do PDF do RDO). Ambas MIT, com o texto da licença ao lado de cada arquivo (`*.LICENSE.txt`).

## GitHub e implantação

Foi inicializado apenas um repositório Git novo e local, sem remotos. **Nenhum repositório foi criado ou alterado no GitHub, nem houve publicação.** O usuário pediu independência caso o projeto seja colocado no GitHub; isso não deve ser confundido com comprovação de publicação.

Destino proposto: novo repositório próprio chamado `gerenciamento`, verificando previamente disponibilidade e conta. O futuro repositório deve conter todo este pacote, sem submódulos, imports ou scripts que baixem código de repositórios anteriores. Não reutilizar histórico Git, secrets, URLs de serviço ou infraestrutura de outros projetos. Configurações do servidor futuro serão próprias e documentadas; segredos reais nunca serão versionados.

A publicação de produção e a migração dependem dos critérios de homologação do prompt. A versão demonstrativa foi entregue como arquivo para avaliação, preservando essa separação.
