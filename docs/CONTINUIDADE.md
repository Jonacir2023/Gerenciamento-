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
