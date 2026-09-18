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
