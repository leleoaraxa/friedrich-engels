# friedrich-engels
Mapeando o domínio

### Entidades de Domínio:
1. **Produto**
   - Atributos: ID único, nome, quantidade em estoque, quantidade mínima, tamanho, cor, histórico de vendas, lucro por produto.
   
2. **Estoque**
   - Atributos: Quantidade atual de cada produto, tendências de estoque, histórico de movimentações.

3. **Venda**
   - Atributos: Produto vendido, quantidade, data da venda, lucro por produto, período de vendas.

4. **Fornecedor**
   - Atributos: Nome do fornecedor, detalhes de contato, prazos de entrega, integração para atualizações automáticas.

5. **Ordem de Compra**
   - Atributos: Produto, quantidade, data, status (em andamento, entregue, etc.), fornecedor.

6. **Usuário**
   - Atributos: Nome, e-mail, preferências de notificação (e-mail/SMS).

7. **Alerta**
   - Atributos: Produto, quantidade mínima, canal de notificação, status de estoque.

### Casos de Uso:
1. **Rastrear Produtos**
   - Ação que permite adicionar e consultar produtos no sistema, com um ID único e atributos como tamanho e cor.

2. **Definir Quantidades Mínimas de Estoque**
   - Definir limites mínimos para cada produto, garantindo que um alerta seja enviado quando o estoque atingir um nível crítico.

3. **Receber Alertas de Estoque Baixo**
   - Notificar os usuários por e-mail e no sistema quando os produtos estiverem com estoque próximo ou abaixo do mínimo.

4. **Visualizar Histórico de Vendas e Estoque**
   - Consultar o histórico de vendas e estoque, com informações como volume de vendas, lucros, e tendências ao longo de um período específico.

5. **Criar e Gerenciar Ordens de Compra**
   - Gerar ordens de compra automaticamente quando o estoque estiver baixo, com base nas tendências de vendas e quantidades mínimas definidas.

6. **Integrar com Fornecedores**
   - Receber atualizações automáticas sobre prazos de entrega e status de remessas diretamente dos fornecedores.

7. **Gerenciar Produtos no Estoque**
   - Adicionar, remover ou atualizar informações de produtos no estoque, incluindo alteração de quantidades e atributos como tamanho e cor.

8. **Visualizar Relatórios e Tendências de Estoque**
   - Acompanhar tendências de estoque e vendas, gerando relatórios para suportar a tomada de decisão em relação à compra e manutenção de estoque.
