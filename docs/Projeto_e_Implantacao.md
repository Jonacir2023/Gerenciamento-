# Gerenciamento — projeto e implantação

15/09/2026 · pacote inicial 0.1.0 · decisões propostas onde indicado.

## 1. Decisões e fontes

Decisão expressa de Jonacir: aplicativo novo chamado Gerenciamento, independente de qualquer repositório existente. Todo o código desta base foi escrito neste projeto; nenhum código ou infraestrutura anterior foi utilizado. O repositório local não possui remoto configurado. Nenhum repositório GitHub foi criado ou alterado.

A especificação própria `Prompt_Global_Gerenciamento.md` contém os 13 módulos e critérios completos. Requisitos de controle de obras foram consolidados do documento enviado, mas arquivos e prompts históricos de outros projetos não integram este pacote.

Comprovado: geração do HTML e testes de domínio registrados em VALIDACAO. Pendente: homologação de navegador, identidade e persistência no servidor, demais módulos e futura criação de repositório novo quando executada.

## 2. Matriz de requisitos

A matriz CSV usa IDs GER-001 a GER-018 e acompanha a especificação completa do Gerenciamento. Cada item possui fonte, destino, decisão, critério de aceite, teste, dependência e fase. Todas as implementações são próprias. Capacidades ausentes continuam pendentes.

Regras definidas: Check-in de gestão separado de presença; cancelamento distinto de conclusão; tarefas e Pauta são visões do mesmo registro; ausência de clima/efetivo permanece vazia; atas usam cópia profunda.

Decisões pendentes para etapas futuras: RDO oficial, permissões, reconhecimento financeiro, calendários e pesos de avanço físico, requisitos móveis e orquestrador de integrações.

## 3. Arquitetura

### Implementação atual

Cliente HTML/CSS/JavaScript sem dependências externas. Um núcleo de domínio testável separa regras e renderização. IndexedDB persiste um documento versionado com obras, demandas, reuniões e diários. Cada gravação verifica a revisão em uma transação antes de salvar, evitando que duas abas sobrescrevam alterações silenciosamente. Ao detectar conflito, o usuário mantém o formulário aberto, recebe erro e deve recarregar antes de reeditar.

Essa arquitetura existe para avaliação individual dos fluxos, não para acesso multiusuário. A seleção da obra é filtragem, não controle de segurança. Não há serviço externo, CDN, telemetria ou transmissão de dados.

### Arquitetura alvo proposta — ainda não implementada nem homologada

Monólito modular: cliente web responsivo em TypeScript/PWA, API de domínio com contratos versionados e banco PostgreSQL próprio. Auth e armazenamento privado serão configurados em um projeto novo, conforme a referência Supabase da especificação própria. Dependências futuras terão versões fixadas, lockfile e licenças registradas no próprio repositório. Escolha PWA para piloto web; cliente nativo só se testes em dispositivos demonstrarem limitações relevantes de captura ou segundo plano.

Separar as camadas de identidade, domínio transacional, consultas, arquivos, fila de saída e integrações. Numeração, aprovação, WIP e reconhecimento financeiro serão responsabilidade do servidor. Cliente não pode conceder a si próprio autorização. As operações críticas usarão idempotência e controle otimista de versão. Serviços auxiliares independentes apenas quando houver necessidade comprovada.

Proposta de API: `/api/v1/obras`, `/demandas`, `/reunioes`, `/contribuicoes-rdo`, `/rdos`, `/evidencias`; toda consulta e mutação verifica vínculo e ação no servidor. Referências entre filhos e pais incluem obra e são conferidas no banco. Essas rotas são contratos propostos, não endpoints existentes.

## 4. Mapa de módulos e dados

| Domínio | Entidades alvo | Fonte / fase |
|---|---|---|
| Identidade | usuários, organizações, obras, vínculos, papéis, ações | M01 / fundação |
| Cadastros | empresas, pessoas, funções, equipes, setores, frentes, unidades, calendários | M01 / piloto |
| Gestão | demandas, transições, comentários, dependências; reuniões, itens, decisões e retratos | M02–04 / piloto |
| Campo | contribuições, RDOs oficiais, revisões, atividades, recursos, aprovações | M05 / piloto |
| Evidências | objetos, originais, derivados, metadados, ocorrências, inspeções | M06 / piloto |
| Recursos | presença, alocação, jornadas, manutenção e paradas | M07 / piloto |
| Planejamento | EAP, serviços, cronogramas, restrições, compromissos, produção validada | M08 / controle |
| Financeiro | orçamento, alterações, contratos, aditivos, medições, NFs, eventos de custo, pagamentos, reservas, estimativas | M09 / financeiro |
| Suprimentos | solicitações, pedidos, itens, recebimentos e movimentos de estoque | M10 / financeiro |
| Documentos | documentos, revisões, distribuição, ciência e aprovação | M11 / expansão |
| Análise | definições de métricas, consultas autorizadas, relatórios versionados | M12 / transversal |
| Integrações | mensagens, deduplicação, fila, tentativas, consultas IA e fontes | M13 / expansão |
| Controle | auditoria, migrações, fila offline e conciliação | Transversal |

Os 25 campos de RDO estão definidos em `src/core.js`, `RDO_FIELDS`. A base local guarda todos como campos de rascunho; a arquitetura alvo deverá estruturar atividades, efetivo, equipamentos e anexos sem perder o texto de origem.

## 5. Permissões propostas para a próxima fundação

| Papel | Registros de campo | Aprovação | Administração |
|---|---|---|---|
| Proprietário | Conforme organização e acesso explicitamente concedido | Regras de negócio e segregação a validar | Gerenciar obras e concessões |
| Gestor da obra | Ler/criar/revisar na obra vinculada | Nos domínios delegados | Cadastros da obra sem elevar papel global |
| Engenheiro / técnico | Registrar e revisar no escopo designado | Somente delegação específica | Sem gestão de papéis globais |
| Apontador / encarregado | Criar contribuições e atualizar rascunhos autorizados | Sem aprovação por padrão | Sem concessão de acesso |
| Planejamento / custos / administrativo | Somente ações delegadas por especialidade | Conforme matriz por domínio | Cadastros pertinentes |
| Cliente / fiscalização | Leitura e ciência do conjunto explicitamente liberado | Conforme contrato e delegação | Sem administração geral |

Esta tabela é proposta inicial, não RBAC implementado. Antes das políticas, detalhar CRUD, exportação, aprovação, cancelamento, estorno e revogação por entidade. Validar duas obras com usuários diferentes, inclusive manipulação de IDs e URLs. Os exemplos locais não são teste de RLS.

## 6. Regras preservadas

Cancelados não são concluídos nem atrasos ativos; prazo igual a hoje não é atrasado. Estado desconhecido exige conciliação. Pauta e tarefa usam o mesmo ID. Atas preservam o retrato da reunião. Contribuições no mesmo dia e autor não sobrescrevem umas às outras; obra integra todas as chaves de domínio. RDO oficial aprovado será imutável, com revisão explícita; essa aprovação não existe nesta base.

Regras financeiras de referência do prompt, ainda não implementadas: Atual = Original + Alterações; Apropriado = Realizado + Comprometido Restante + Reservas; Saldo = Atual − Apropriado; EAC = Realizado + Comprometido Restante + Estimativa Não Coberta. O mesmo fato medido, faturado e pago não gera três custos. Definir reconhecimento antes de programar. Nenhuma demonstração financeira foi apresentada como real.

## 7. Sequência e critérios de avanço

1. **Pacote inicial entregue:** nome, independência, diagnóstico documental, rastreabilidade, base visual e de domínio local. Revisar fluxos com Jonacir; não equivale ao aceite do piloto.
2. **Fundação isolada:** implementar e testar autenticação, vínculos, matriz de ações, banco próprio, armazenamento privado, API, migrações e segregação multiobra. Ambiente novo e backups comprovados antes de dados reais.
3. **Piloto de campo:** completar Pauta/Check-in/RDO, evidências, aprovação, PDF versionado, recursos e sincronização; testar dois dispositivos, interrupção de envio e conflitos.
4. **Planejamento:** EAP, calendário, bases aprovadas, produção, Curva S e PPC com denominador congelado e fontes reconciliadas.
5. **Financeiro e materiais:** contratos, apropriação e caixa distintos; recebimentos e estornos; conciliação de totais por obra/EAP.
6. **Integrações e expansão:** WhatsApp, IA, OCR, documentos e BIM viável; autorização humana e rastreabilidade; falhas e retentativas verificadas.
7. **Implantação controlada:** migração opcional, explicitamente autorizada, com cópia, conciliação, restauração e retorno que preserve lançamentos novos. Liberar após aceite da versão concreta.

O backlog próprio deve ser estimado conforme a equipe e as dependências reais.

## 8. Pacote concreto da próxima etapa

Implementar primeiro obras, usuários/vínculos e demandas sobre banco novo; entregas necessárias: migrações próprias, autorização de cada endpoint, validação dos estados, histórico de transições, testes concorrentes e integração do cliente. Incluir modelos de ambiente sem segredos e procedimento reprodutível de instalação. Criar infraestrutura exclusiva do Gerenciamento.

A próxima implementação não exige acesso a projetos anteriores. Se houver futura importação de dados, tratar como tarefa separada, explicitamente autorizada e com conciliação.

