# Prompt global — Gerenciamento

Versão 1.2 — 15/09/2026 — especificação completa de projeto independente.

**Regra de origem:** novo código, repositório novo, banco novo, configurações novas e documentação própria. Não usar nada de repositórios realizados anteriormente. A especificação abaixo contém os 13 módulos e os critérios de implantação; não depende de prompts ou arquivos de outros projetos.

**INÍCIO DO PROMPT GLOBAL**

### 1 Missão e resultado esperado

Crie o aplicativo GERENCIAMENTO para controle integrado de obras de Jonacir da Silva Cazelli, engenheiro civil e gerente de obras. Comunique-se em português do Brasil, com decisões objetivas e evidências verificáveis.

O Gerenciamento é um projeto novo, com código, repositório, banco, credenciais, infraestrutura e documentação próprios. Não reutilize código, histórico Git, branches, arquivos, URLs, serviços ou configurações de projetos realizados anteriormente. Não faça fork, clone de base, submódulo, extensão ou sincronização com repositórios existentes. O desenvolvimento não depende de recuperação nem de acesso a qualquer outro projeto.

Implemente os 13 módulos descritos neste documento. Os requisitos de negócio aqui consolidados são a especificação do produto; nenhuma aplicação anterior integra o pacote ou define dependência técnica. Pauta, Check-in de Gestão e Diário de Obras são nomes de módulos internos do novo aplicativo.

Entregue um sistema utilizável por equipes reais: cadastro, persistência, permissões, operação offline, relatórios, rastreabilidade e implantação documentada. Telas demonstrativas, mocks e exemplos não contam como funcionalidades prontas. Identifique dados de teste e mantenha-os separados de dados reais. Rastreie o escopo ainda não implementado.

Continue a etapa já autorizada até implementar, testar e documentar. Não interprete este prompt como autorização para excluir recursos, alterar produção ou enviar mensagens externas. A etapa inicial é uma base de avaliação; liberar para produção exige homologação e aceite da versão concreta.

### 2 Independência e fonte de verdade

A continuidade do Gerenciamento deve depender exclusivamente de seu próprio Git, banco, arquivos e documentação versionada. Deve permitir troca de desenvolvedor ou IA sem depender de conversas anteriores.

Se houver publicação no GitHub, crie repositório novo e próprio, com nome proposto `gerenciamento`, verificando conta e disponibilidade. Não escolha nenhum repositório existente para hospedar este projeto. Registre URL, branch, commit e versão somente após comprovar sua criação. Não afirmar que um projeto do ChatGPT foi criado ou movido quando apenas arquivos foram gerados.

O novo repositório deve conter todo o trabalho produzido: cliente, servidor quando implementado, estilos, componentes, assets, contratos, migrações, testes, scripts, configuração de exemplo sem segredos, dependências declaradas com lockfiles aplicáveis, CI e documentação. Deve permitir instalar, executar, testar e publicar sem buscar partes essenciais em outros repositórios. Bibliotecas públicas gerais são permitidas se versionadas e documentadas; código de projetos anteriores do usuário não é permitido.

Crie ambiente de banco, autenticação, arquivos e integrações exclusivo do Gerenciamento. Não utilizar infraestrutura ou credenciais antigas. Nenhum SQL será aplicado a projetos existentes. Não apagar nem alterar outros projetos para abrir espaço para este.

Adote o fluxo: Definir → Projetar → Aprovar → Implementar → Testar → Validar → Documentar → Liberar. Uma aprovação se refere a um pacote concreto e versão correspondente. Não pedir novamente aprovação para a independência, que já é decisão expressa de Jonacir.

### 3 Fontes e resolução de conflitos

A fonte normativa é este prompt, as decisões atuais de Jonacir e a documentação própria do Gerenciamento. Os requisitos funcionais foram consolidados a partir do documento de controle de obras enviado pelo usuário; isso não significa que códigos, bancos ou aplicações anteriores tenham sido disponibilizados ou inspecionados.

Não incorporar ao pacote prompts históricos, nomes, identificadores, URLs, credenciais ou instruções de outros projetos. Não assumir que referências a arquivos externos representam arquivos disponíveis. Documente lacunas sem exigir acesso a repositórios anteriores para continuar a implementação própria.

Prioridade: instrução atual de Jonacir; decisão aprovada do Gerenciamento; regras de negócio validadas; especificação e testes do próprio produto. Classifique informações como requisito, decisão, proposta, implementação comprovada em código ou comportamento observado em teste. Uma afirmação em manual não comprova entrega.

Mantenha matriz com ID estável, requisito, seção de origem, destino, decisão, critério de aceite, teste, dependência e fase. Preserve os 13 módulos e registre pendências. Estime o backlog próprio após inventário da nova base; não importar prazos, pontos, versões ou estados de aprovação de outros projetos.

### 4 Experiência e organização do produto

O usuário deve reconhecer a obra ativa em todas as telas. A navegação deve funcionar em computador, tablet e celular, com linguagem de obra, campos legíveis, ações de toque acessíveis, contraste suficiente e confirmação clara do estado de salvamento. Mantenha consistência visual entre os módulos Pauta e Check-in, incluindo cores por status, sem depender apenas da cor para comunicar significado.

Organize a navegação em: visão geral; planejamento e EAP; operação de campo; Pauta e reuniões; tarefas e ocorrências; recursos; custos e contratos; documentos e relatórios; administração. Mostre os módulos conforme permissões. Pesquisa, filtros por obra/período/setor/responsável e exportação devem usar as mesmas regras de acesso das telas.

Separe obrigatoriamente:

- **Check-in de Gestão:** reunião operacional, pauta, decisões e acompanhamento de pendências.
- **Presença e Efetivo:** trabalhadores, equipes, funções, entradas/saídas e apontamentos de recursos.
- **Quadro de desenvolvimento do software:** backlog, especificação, implementação, revisão e entrega; pertence à gestão do projeto do aplicativo.
- **Quadro operacional da obra:** A Fazer, Fazendo, Em Validação quando aplicável, Concluído e Cancelado. Não exigir “Engenharia de Prompt” de encarregados e apontadores.

### 5 Módulos e comportamento obrigatório

**M01 Cadastros e multiobra.** Empresas, obras, centros de custo, locais/frentes, disciplinas, setores, pessoas, equipes próprias e terceirizadas, funções, equipamentos, fornecedores, unidades e calendários. Usuário autenticado, trabalhador e responsável operacional são entidades relacionadas, mas não precisam ser a mesma pessoa. Não obrigar cada trabalhador a possuir login. Use identificadores persistentes; não trate nomes como chaves únicas. Mantenha o vínculo do responsável à obra e os registros históricos após sua desativação.

**M02 Pauta e demandas.** Manter assunto, descrição, criador, responsável, setor, prioridade, lançamento, prazo e status. Permitir anexos, origem, comentários e histórico. Converter uma pauta em tarefa ou item de reunião por vínculo, evitando duplicação de cartões. Preservar cadastro de membros/setores e importação/exportação. Normalizar “RH” e “Recursos Humanos” por alias revisado, conservando o valor de origem.

**M03 Check-in e reuniões.** Manter data, hora, participantes, assuntos, decisões, responsáveis, prazos e retrato dos estados no momento da reunião. Suportar reunião diária, semanal e com cliente, calendário, busca histórica, ata, impressão e exportação de imagem/PDF. Alterar uma tarefa hoje não pode reescrever a ata anterior. Resumos semanais/mensais devem realmente filtrar por período e indicar seu critério. Integrar demandas provenientes de Pauta, RDO e ocorrências.

**M04 Tarefas e fluxo operacional.** Uma tarefa tem obra, origem, título, descrição, responsável, setor, prioridade, prazo, status, dependências, evidências e histórico de transições. Adotar os estados internos `afazer`, `fazendo`, `concluido`, `cancelado`. “Aberta” equivale a A Fazer; “Em Andamento” a Fazendo; “Concluído” a Concluído; “Cancelado” permanece Cancelado. Estado desconhecido vai para conciliação, nunca para Concluído por padrão. Registrar justificativa de cancelamento e reabertura. Concluir atividades que exigem vistoria depende de aprovação autorizada.

WIP deve ser configurável por quadro, coluna e, se necessário, responsável. O valor inicial sugerido de duas ou três revisões simultâneas é parâmetro de piloto. A verificação e a movimentação devem ocorrer atomicamente no servidor, inclusive com usuários concorrentes. Alertas urgentes de segurança precisam poder ser registrados mesmo com WIP cheio; isso não concede conclusão automática nem burla de aprovação.

**M05 Diário e RDO.** Implementar os seguintes 25 campos obrigatórios da especificação: Data; Dia da Semana; Obra; Empresa; Cidade; Local da Obra; Descrição do Local; Tempo/Clima; Jornada; DSS Horário; DSS Ministrado Por; DSS Tema; Atividades do Dia; Efetivo Total; Efetivo por Função; Colaboradores Presentes; Equipamentos Utilizados; Veículos Leves; Veículos/Equipamentos Parados; Eventos de Segurança; Eventos de Meio Ambiente; Observações do Dia; Apontador; Fotos; RDO Nº.

Estruturar progressivamente atividades com serviço/EAP, local, unidade, quantidade executada, equipe, equipamento, horas produtivas e improdutivas e motivo de paralisação. Manter o relato original quando não houver estrutura suficiente. Separar MOD/MOI e terceiros quando disponíveis. Clima por período deve distinguir observação de campo e consulta meteorológica, com fonte e horário; ausência de informação não é “Ensolarado” nem efetivo zero confirmado.

Suportar várias contribuições por obra/data/frente/autor e consolidá-las em um RDO oficial, sem sobrescrever relatos. Definir a granularidade final com o processo real; conservar IDs de contribuições e referências informadas. Numeração oficial deve ser única no escopo aprovado, gerada com proteção contra concorrência. Aprovação torna aquela versão imutável; correção posterior gera revisão/retificação auditável.

**M06 Evidências, qualidade, segurança e meio ambiente.** Fotos, áudios, vídeos e documentos devem ter obra, autor, vínculo, origem e metadados. Guardar original e versão derivada com marca d’água; registrar horário de captura, recebimento, fuso e precisão/localização quando disponíveis. Não inventar GPS nem tratar o relógio do aparelho como prova absoluta. Permitir ocorrências, classificação, responsável, prazo, checklist versionado, inspeção, ação corretiva e aceite. Relacionar eventos ao RDO e à tarefa correspondente. Checklists regulatórios devem ser validados pelo responsável competente antes de uso; a aplicação não certifica conformidade por si só.

**M07 Efetivo e equipamentos.** Presença, função, equipe, empresa, frente, jornada, horas e totais conciliáveis com o RDO. Equipamentos com identificação, alocação, operação, manutenção, disponibilidade e paralisações; distinguir veículos leves e equipamentos produtivos. Evitar duplicar efetivo total quando duas frentes apontam a mesma equipe. Coletar identificação pessoal sensível apenas quando necessária ao processo aprovado.

**M08 Planejamento e EAP.** EAP hierárquica; serviços, quantidades, unidades e responsáveis; cronograma base aprovado e cronograma de controle; dependências, calendários, marcos de duração zero e caminho crítico; programação quinzenal/semanal, restrições, compromissos e produção realizada via RDO validado. Suportar Gantt, lista, calendário, Curva S e PPC. Detectar ciclos de dependências e inconsistências de datas. Definir pesos e critérios do avanço físico; porcentagem de tarefas concluídas não equivale automaticamente ao avanço físico da obra.

**M09 Custos, contratos, medições e forecast.** Implementar o escopo financeiro do Gerenciamento: orçamento original, alterações aprovadas, orçamento atual, contratos, aditivos, comprometimento, medição, NF, apropriação, reservas, pagamentos e estimativa para concluir. Separar medições de fornecedores e de cliente/receita. Exigir vínculo por obra, EAP/centro de custo, documento e competência. Implementar recebimentos/parciais, retenções, descontos e estornos conforme as regras aprovadas, com histórico.

Adotar como referência de negócio do Gerenciamento, sujeita à validação do evento de reconhecimento:

- Orçamento Atual = Orçamento Original + Alterações Aprovadas.
- Apropriado = Realizado + Comprometido Restante + Reservas.
- Saldo Disponível = Orçamento Atual − Apropriado.
- Forecast/EAC = Realizado + Comprometido Restante + Estimativa Não Coberta para Concluir.

Definir o significado e o evento de reconhecimento de cada parcela antes de implementar. “Comprometido Restante” não é o valor total histórico dos contratos. Medição, NF e pagamento do mesmo evento não podem gerar três custos. Reservas e estimativas não podem repetir obrigação já coberta. Pago representa caixa; Realizado segue a regra de competência aprovada. Usar valores decimais exatos e política explícita de arredondamento. Excesso de orçamento deve manter a solicitação registrada como pendente, com decisão auditável, em vez de descartá-la.

**M10 Compras e materiais.** Solicitação, aprovação, pedido, fornecedor, recebimento parcial, divergências, devoluções, estoque/movimentação, material e vínculo à obra/EAP. Código de barras/QR identifica o registro; não autoriza recebimento ou lançamento sem conferência. OCR gera proposta de dados da NF, com documento original, validação de fornecedor, número, data, itens e valores. Detectar duplicidade por identificadores disponíveis, sem depender apenas de imagem ou nome de arquivo.

**M11 Documentos e projetos.** Tipo, disciplina, revisão, status, responsável, aprovação, distribuição e ciência. Manter revisão vigente identificada e antigas acessíveis no histórico. Arquivos técnicos e RDOs aprovados não podem ser substituídos mantendo a mesma referência de versão. Em acesso offline, indicar última sincronização e revisão conhecida, pois não é possível garantir conhecimento de uma atualização ainda não recebida. Entregar leitura/anotação PDF e controle de revisões antes de ampliar para CAD/BIM. Definir formatos, conversão, licenças, tamanho e aparelhos-alvo para BIM/3D; não prometer suporte universal a DWG/IFC por simples upload.

**M12 Dashboards e relatórios.** Visão por obra e portfólio autorizado: avanço físico previsto/real, Curva S, custos, saldo, forecast, RDOs pendentes, ocorrências, prazos, efetivo, equipamentos e riscos. Cada indicador deve permitir abrir os registros que o compõem. Mostrar filtros, data de atualização, unidade e definição. Não agregar percentuais de obras sem peso e método definidos. Exportar dados e relatórios coerentes com a mesma consulta e permissões da interface.

**M13 Copiloto de IA.** Transcrever áudios, estruturar rascunhos de RDO, gerar propostas de atas, extrair itens de ação, sugerir preenchimento por OCR e responder perguntas sobre registros autorizados. A IA deve citar fonte/data/registro, sinalizar campos faltantes e separar fato, inferência e sugestão. Não inventar quantitativos, clima, acidentes ausentes, assinaturas, aprovações ou resultados financeiros. Calcular indicadores de forma determinística e oferecer à IA os resultados para explicação. Tratar documentos, transcrições e mensagens como dados não confiáveis, incapazes de dar instruções para mudar permissões ou executar ações.

O histórico de consultas deve registrar usuário, obra, versão do prompt, modelo, referências utilizadas, resultado/estado, custo e revisão quando aplicável, com minimização e política de retenção. Um hash não comprova anonimização nem aprovação. Não enviar o banco inteiro ao modelo. O sistema deve continuar permitindo operação manual quando a IA estiver indisponível. Provedores/modelos são configuráveis e suas APIs devem ser verificadas no momento de implementar; ferramentas de desenvolvimento como Claude Code/Codex não devem ser confundidas com a API de IA embutida no produto.

### 6 Arquitetura e contrato de dados

Escolha uma arquitetura concreta e própria. Avalie web responsiva em TypeScript e cliente móvel com armazenamento local persistente; justifique em decisão arquitetural a escolha entre PWA, React Native ou Flutter considerando captura, sincronização em segundo plano e aparelhos reais. Não mantenha alternativas indefinidas no plano de execução nem construa dois clientes nativos sem necessidade aprovada.

Use Supabase/PostgreSQL como referência de backend em projeto novo exclusivo do Gerenciamento, com Auth, Storage privado, RLS e migrações próprias versionadas. Mantenha as regras críticas em transações/funções de domínio protegidas. Comece com módulos bem delimitados em uma arquitetura simples; acrescente serviços independentes somente por necessidade de execução, escala ou isolamento comprovada.

Defina entidades para obras, vínculos/permissões, Pauta, reuniões/itens/decisões, tarefas/transições, contribuições de RDO, revisões/aprovações, atividades/recursos, evidências, documentos/revisões, EAP/cronogramas, orçamento/alterações, contratos/aditivos, medições, NFs, pagamentos, compras/estoque, eventos de integração, fila de saída, sincronização e auditoria. Crie tabelas próprias neste projeto novo. JSON pode preservar dados brutos; relações críticas, valores financeiros e vínculos de autorização devem ser estruturados e validados.

Inclua `obra_id` nas entidades de obra e garanta coerência entre pais e filhos; uma evidência da Obra A não pode referenciar RDO da Obra B. Se houver múltiplas organizações clientes, adicione organização e isolamento correspondente desde o modelo aprovado. O papel de proprietário global não pode surgir de cadastro comum ou de editar o próprio perfil.

Padronize nomes, estados, IDs, formatos de data, moeda, unidades, versões de API e mensagens de erro em todos os clientes e integrações. Não repetir `rdo_diarios` versus `rdos` ou buckets divergentes. APIs devem suportar validação de payload, paginação, limites, idempotência e conflito de versão. IDs de recursos recebidos do cliente nunca dispensam autorização no servidor.

### 7 Segurança e preservação de registros

Defina permissões por usuário, obra, função e ação. Referência de perfis: proprietário Jonacir, gestor por obra, engenheiro, técnico, analista, encarregado, apontador, administrativo e especialidades de planejamento e custos/medições; fiscalização e cliente têm escopo próprio. Transforme essa referência em matriz CRUD, aprovação, exportação e administração antes de configurar políticas. Equipe de desenvolvimento não recebe acesso executivo ao negócio automaticamente.

Mantenha RLS e privilégios explícitos nas tabelas expostas, políticas de Storage por obra/objeto e proteção equivalente em consultas, exports, IA e integrações. Quando aplicável, views devem respeitar as permissões do chamador. Use chaves privilegiadas somente em serviço protegido e valide o domínio antes de qualquer operação que contorne RLS. Perfis editáveis pelo usuário não podem permitir elevação de cargo.

Implemente MFA real no provedor de identidade conforme a política aprovada, incluindo recuperação e exigência nas operações sensíveis; um campo booleano não é autenticação. Valide expiração/revogação, sessões, acesso após desligamento e concessões por obra.

Proteja dados em trânsito, em repouso e no dispositivo conforme arquitetura comprovada. Especifique gestão de chaves e segredos, recuperação e retenção. Não chamar TLS mais criptografia em repouso de ponta a ponta sem um desenho que realmente o garanta. Remova segredos do código e exemplos; use configurações de ambiente, dependências com versões fixadas e lockfiles.

Assinaturas/aprovações devem vincular identidade, papel, intenção, instante e hash da versão do documento. Exigências contratuais sobre assinatura devem ser confirmadas antes da escolha do mecanismo. GPS ou desenho em canvas não garantem, isoladamente, validade de qualquer natureza.

Registros aprovados de orçamento, contratos, aditivos, medições, NFs, pagamentos, planejamento, RDOs e documentos devem ser preservados conforme regras do domínio; correções são revisões ou estornos auditáveis. Arquivar obra não elimina histórico. Auditoria deve registrar ator, ação, entidade, versão, antes/depois quando apropriado e correlação, sem registrar segredos. Defina retenção de dados pessoais, acesso a áudios/fotos e política de eliminação compatível com obrigações aplicáveis.

### 8 Operação offline e sincronização

Salvar localmente antes de indicar sucesso. Mostrar separadamente: salvo no dispositivo, aguardando envio, sincronizando, sincronizado, conflito e erro. Cache/localStorage isolado e uma flag `sincronizado=false` não constituem motor de sincronização completo.

Usar IDs locais estáveis, fila persistente, chave de idempotência e versão conhecida do registro. Enviar dados leves antes das mídias; associar anexos pendentes, conferir checksum e permitir retomada de uploads. Não apagar a cópia local até confirmação de persistência íntegra. Testar reinício do aplicativo e do dispositivo durante envio.

Separar horário de captura, data operacional da obra, horário de recebimento do servidor e revisão. Usar fuso configurado por obra, com referência inicial America/Sao_Paulo, sem converter datas operacionais inadvertidamente em outro dia. Relógio local não decide sozinho qual alteração prevalece.

Contribuições independentes de campo são adicionadas, não sobrescritas. Edições concorrentes do mesmo dado precisam de controle otimista de versão e conciliação. Aprovação, WIP, orçamento e acesso são revalidados no servidor: uma solicitação offline não é aprovação definitiva. Alteração em documento já aprovado deve gerar nova proposta de revisão.

Planejar acesso local após revogação, troca de usuário e logout: não disponibilizar o cache de uma pessoa para outra; preservar pendências de forma protegida e definir prazo de autorização offline. Informar limites reais de execução em segundo plano do sistema operacional. Disponibilizar sincronização manual e diagnóstico de pendências.

### 9 Integrações e automações

O banco próprio é a fonte oficial. Integrações externas são opcionais e terão configurações e contratos novos. Escolha um único orquestrador, Make ou n8n, conforme necessidade comprovada. Nenhum fluxo existente de outro projeto é dependência do Gerenciamento. Planilhas, quando autorizadas, são apenas importação/exportação ou destino controlado.

Para WhatsApp, use o provedor/API autorizado e verificado. Corrija assinatura obrigatória no ambiente produtivo, aliases dos parâmetros de verificação, validação do payload, tamanho/MIME e timeouts. Registre a mensagem duravelmente e deduplique pelo identificador do provedor antes de confirmar recebimento. Processe por fila recuperável, com retentativas limitadas, espera progressiva, estado de falha e reprocessamento auditável.

Identifique o remetente, confirme seus vínculos e resolva explicitamente a obra. Se houver mais de uma, solicite escolha; se não houver, não grave em nenhuma obra. Elimine fallback para a primeira obra ativa. Guarde a mensagem e o áudio autorizados, associe contribuições ao RDO e não sobrescreva relatórios aprovados. Confirmação de recebimento, rascunho criado e RDO aprovado são estados diferentes.

Implemente os cinco cenários de integração previstos: entrada de RDO por áudio/texto/foto com ramos próprios; PDF da versão aprovada; OCR sempre como rascunho sujeito à conferência; alerta de WIP após decisão transacional do backend; e resumo periódico de pendências com fontes e revisão antes de envio externo. Acrescente ocorrência → tarefa vinculada, sem duplicar a ocorrência.

Nenhum lançamento financeiro, aprovação, alteração de escopo ou comunicação externa baseada em IA deve ocorrer sem a autorização e revisão definidas para o fluxo. Listas de destinatários, canal, modelo, frequência e critérios de disparo devem ser aprovados. Não hardcode endereços ilustrativos. Não presumir que envio a grupos WhatsApp seja suportado pelo provedor escolhido.

Eventos devem conter ID, tipo, obra, entidade, versão, instante e correlação. Use fila de saída transacional para impedir perda entre gravação e automação. O PDF deve referenciar a versão aprovada; retentativas não geram novas aprovações nem envio duplicado. Registre entrega e falha sem transformar falha de mensagem em falha da gravação já concluída.

Entregue cenários Make/n8n exportados no formato real da ferramenta, sem credenciais, com instruções de conexão. Comprove importação em homologação e teste de ponta a ponta antes de qualificá-los como prontos. Verifique documentação atual dos provedores em vez de copiar versões antigas de APIs.

### 10 Importação opcional e preservação

A instalação e operação do Gerenciamento começam de forma independente e não dependem de migração. Não importar automaticamente código, dados, configurações, documentos ou históricos de projetos anteriores. Qualquer futura importação de dados é uma tarefa separada e exige autorização explícita sobre arquivos e destino.

Se uma importação de dados for autorizada, trabalhar somente com as cópias fornecidas para esse fim. Documentar mapeamento campo a campo, ID de origem, obra, autor, datas e transformações; não associar registros pela primeira obra disponível. Estados desconhecidos ou registros ambíguos ficam em conciliação. Não sobrescrever nem apagar dados de origem.

Executar importação idempotente em homologação, comparar contagens, totais financeiros, referências e amostras completas. Relatar aceitos, rejeitados, transformados e pendentes. Repetir para provar que não duplica registros. Copiar arquivos somente quando autorizado, com checksum e controle de acesso.

Não criar sincronização contínua ou dependência de outro aplicativo. Backup e retorno de versão do Gerenciamento devem conservar os registros novos já produzidos. Não desativar nem alterar qualquer sistema anterior como parte desta implantação.

### 11 Indicadores e metas verificáveis

Crie um dicionário com nome, fórmula, unidade, fonte, filtros, periodicidade e responsável por cada métrica. Separar: lead time da demanda até conclusão; cycle time do primeiro início até conclusão, incluindo retrabalho segundo política explícita; idade das pendências abertas; tarefas atrasadas; throughput; e CFD baseado no histórico de transições. Cancelados não contam como concluídos nem como pendências ativas. Defina o tratamento de reaberturas e prazos que vencem no dia.

PPC = compromissos semanais concluídos conforme combinado ÷ compromissos semanais assumidos × 100. Congele o denominador segundo a regra de planejamento e registre cancelamentos/alterações. Não confundir PPC com percentual geral de cartões resolvidos. Curva S deve explicitar base, pesos, data de corte e realizado validado.

A meta de redução de até 40% é uma hipótese de melhoria a medir contra baseline comparável, não garantia. Disponibilidade de 99,9% é meta a especificar com janela, escopo e dependências. Para IA, definir duração máxima de áudio, volume, rede e percentil antes de validar a meta de 15 segundos. Quando excedida, manter processamento assíncrono com status claro.

Defina metas de desempenho, volume de obras/usuários/registros/mídias, custo mensal estimado e limites de consumo após inventário. Meça tempos de API e telas no ambiente de referência. Dimensione backup e recuperação com RPO/RTO propostos e aprovados, incluindo mídias e configurações recuperáveis.

### 12 Etapas e critérios para avançar

Não prometer a plataforma inteira em quatro sprints sem capacidade e baseline. Use sprints quinzenais como cadência de revisão, com backlog dependente de evidências. O escopo completo continua rastreado mesmo quando entregue em fases.

| Etapa | Entrega concreta | Critério para avançar |
|---|---|---|
| 0 Diagnóstico e preservação | Inventário, versão atual, riscos, fontes, matriz de paridade e mapa de dados | Base identificada; lacunas explícitas; plano de preservação revisado |
| 1 Projeto e fundação | Fluxos/telas, arquitetura, contratos, modelo, matriz de acesso e ambiente isolado | Projeto aprovado e isolamento entre obras demonstrado |
| 2 Piloto operacional | Pauta, Check-in, tarefas, RDO completo, evidências, recursos básicos, PDF e sincronização | Fluxo diário completo demonstrado em dois dispositivos, inclusive offline |
| 3 Planejamento e controle | EAP, cronogramas, programação, Curva S e PPC | Quantidades, datas, pesos e produção conciliados |
| 4 Financeiro e suprimentos | Orçamento, contratos, medição, NF, pagamentos, forecast e materiais | Ciclo financeiro reconciliado sem dupla contagem |
| 5 Integrações e expansão | WhatsApp, OCR, IA, automações, documentos avançados e BIM quando viável | Testes ponta a ponta, custos e limites conhecidos |
| 6 Implantação controlada | Migração validada, treinamento, release, observabilidade, backup e retorno | Aceite de Jonacir e verificação operacional da versão liberada |

Reordene incrementos conforme dependências do Gerenciamento, sem reduzir seu escopo silenciosamente. Piloto deve abranger uma obra operacional e dados isolados de uma segunda obra para testar segregação.

### 13 Testes de aceite e definição de pronto

Para cada requisito implemente cenários significativos de sucesso, permissão negada e falha aplicável. Use fixtures sintéticas identificadas. Os seguintes cenários são obrigatórios antes da liberação do respectivo módulo:

1. Usuário da Obra A não lê, altera, exporta ou consulta via IA dados/arquivos da Obra B, inclusive por IDs manipulados, links e funções privilegiadas.
2. Apontador registra RDO, mas não aprova sem permissão; usuário não promove o próprio cargo; revogação de vínculo é efetiva nas operações online.
3. Pauta cancelada permanece cancelada após ida e volta de sincronização; estado desconhecido é sinalizado; criar/editar/arquivar persiste e reaparece corretamente em outro dispositivo.
4. Ata histórica permanece igual após alterar a tarefa; resumos semanal/mensal respeitam período; cancelados não entram no atraso ativo.
5. RDO com todos os 25 campos especificados chega ao relatório; duas contribuições no mesmo dia permanecem disponíveis; mesmo apontador em duas obras não causa sobrescrita.
6. Registro offline sobrevive a fechamento/reinício; conexão oscilante e reenvio não duplicam; conflito não apaga dados; login de outra pessoa não expõe cache anterior.
7. Dois usuários disputam a última vaga WIP e apenas uma transição é aceita; solicitação offline é revalidada e recebe motivo se recusada.
8. Aprovação congela a versão; alteração posterior cria revisão; PDF e assinatura correspondem ao mesmo conteúdo aprovado.
9. Webhook sem assinatura válida é rejeitado; mensagem repetida é idempotente; remetente desconhecido não grava; multiobra exige desambiguação; fila retoma após reinício.
10. Áudio/OCR incompleto gera campos pendentes, não fatos inventados; indisponibilidade de IA permite registro manual; conteúdo malicioso de um anexo não aciona ferramentas ou eleva acesso.
11. NF e medição parciais, pagamento e estorno conciliam sem duplicar Realizado; reservas/estimativas não repetem compromisso; soma por EAP coincide com total da obra.
12. Migração repetida não duplica; contagens e valores conciliam; backup do banco e mídias restaura em ambiente separado; retorno de versão conserva gravações do período.

Como teste aritmético sintético, use Original 100, Alterações 5, Realizado 40, Comprometido Restante 30, Reservas 6 e Estimativa Não Coberta 32,8, em milhões de reais. Resultados esperados: Atual 105, Apropriado 76, Saldo 29 e Forecast 102,8. Esse exemplo é sintético e não substitui os testes de competência, duplicidade, retenções e estornos do Gerenciamento.

Uma entrega está pronta quando existe código integrado, persistência, regras de acesso, validações, testes executados, documentação e evidência de aceite do responsável. Relate comando, ambiente, versão e resultado dos testes; se não executou, diga “não executado”. Não transformar validação sintática em comprovação funcional. Bloqueios de acesso não justificam testes fictícios.

### 14 Documentação, operação e entrega

Versione todo o código, assets, scripts e configurações próprias, além de README, arquitetura/decisões, especificação funcional, dicionário de dados, matriz de permissões, backlog rastreável, migrações, contratos de API/eventos, plano de testes, instruções de backup/restauração, migração, deploy/rollback e histórico de releases. Mantenha instruções de continuidade para agentes e desenvolvedores com estado atual, commit, testes, pendências e próximo passo.

Entregue código com lockfiles, configuração de exemplo sem segredos, ambiente de desenvolvimento reproduzível, CI, testes relevantes e procedimentos para homologação e produção. Configure métricas e alertas para falhas de login, integrações, filas, sincronização, backup, custos e geração de relatórios. Logs devem permitir diagnóstico por correlação sem expor conteúdo sensível desnecessário.

Toda release deve identificar escopo, versão, migrations, ambiente-alvo, backup verificado, testes, riscos e procedimento de retorno. O pacote deve estar completo e revisável antes de solicitar liberação de produção. Após autorização, verificar a operação de verdade e registrar o resultado.

### 15 Continuidade e entrega de cada incremento

Mantenha o projeto exclusivamente sob o nome Gerenciamento. Em cada incremento, informe o que mudou, o que foi verificado, o que falta e o próximo pacote concreto. Não afirmar criação, movimento ou renomeação de um projeto na interface do ChatGPT sem executar e verificar essa ação.

Entregue diagnóstico da própria base, matriz de requisitos, arquitetura, mapa de módulos e dados, critérios de aceite e documentação suficiente para continuar em uma conversa nova e independente. O estado atual deve distinguir base demonstrativa, piloto, homologação e produção.

Continue a implementação autorizada até concluir, testar e documentar. Pergunte apenas sobre decisões que realmente bloqueiam o pacote concreto. Nenhuma lacuna permite buscar código, vincular repositórios ou usar infraestrutura de projetos anteriores.

Conserve a matriz de requisitos atualizada. Toda capacidade ausente permanece pendente até haver implementação, teste e aceite aplicável. O nome do produto, seu repositório, banco e documentação devem permanecer próprios e completos.


**FIM DO PROMPT GLOBAL**
