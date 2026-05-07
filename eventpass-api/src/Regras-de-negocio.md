## Regras de Negócio do Sistema

### **Ingressos (Tickets)**

- `Prevenção de Vendas Duplas (Double-Booking)`: O sistema trava momentaneamente a compra simultânea para garantir que duas pessoas não comprem o último ingresso disponível no mesmo milissegundo.

- `Bloqueio de Eventos Passados`: Não é possível comprar ingressos para eventos cuja data já expirou.

- `Controle de Lotação`: A venda é bloqueada automaticamente se a capacidade disponível do evento chegar a zero (Esgotado).

- `Validação (Check-in)`: Apenas o organizador dono do evento (ou um Admin) pode validar um ingresso na porta do evento.

- `Estorno de Vaga Automático`: Quando um ingresso válido é cancelado, a vaga retorna imediatamente para a capacidade disponível do evento.

- `Regra de Cancelamento`: Somente o cliente que comprou o ingresso ou um Admin podem cancelá-lo. Ingressos já utilizados não podem ser cancelados.

- `Restrição de Compra`: Apenas usuários com o perfil de "Cliente" podem comprar ingressos, separando claramente quem consome de quem organiza.

<br>

### **Eventos (Events)**

- `Datas Válidas`: O sistema impede a criação ou remarcação de eventos para datas que já passaram.

- `Posse e Edição`: Apenas o organizador que criou o evento (ou um Admin) tem permissão para editá-lo ou encerrá-lo.

- `Trava de Redução de Capacidade`: O organizador não pode reduzir a capacidade total de um evento para um número menor do que a quantidade de ingressos que já foram vendidos.

- `Proteção Financeira (Exclusão)`: Um evento que já vendeu ingressos nunca pode ser excluído do sistema. Ele deve ser obrigatoriamente "Cancelado" para manter o histórico de compras dos clientes.

- `Cancelamento em Cascata`: Se o organizador cancelar um evento inteiro, todos os ingressos vendidos para aquele evento são cancelados automaticamente.

- `Validação de Categoria`: Um evento não pode ser criado com uma categoria "fantasma"; a categoria deve existir previamente no sistema.

- `Limpeza de Servidor`: Se um evento for excluído ou sua imagem de capa for trocada, a imagem antiga é apagada automaticamente do servidor para economizar espaço de armazenamento.

<br>

### **Usuários e Autenticação**

- `E-mail Único`: Não é possível ter duas contas cadastradas com o mesmo e-mail.

- `Proteção contra Abandono (Organizador)`: Um organizador não pode deletar sua conta se tiver eventos ativos acontecendo. Ele precisa cancelar os eventos primeiro.

- `Proteção contra Perdas (Cliente)`: Um cliente não pode excluir sua conta se ainda tiver ingressos válidos pendentes de uso, evitando que perca o acesso ao que comprou.

- `Histórico Preservado`: Contas "deletadas" são apenas desativadas para o usuário, mas mantidas no banco de dados oculto para fins de auditoria e segurança.

- `Segurança de Senhas`: Nenhuma senha é salva em texto limpo; todas são criptografadas (hash) antes de irem para o banco de dados.

- `Hierarquia de Acesso (RBAC)`: O sistema isola as rotas rigorosamente entre três perfis: Admin (acesso total), Organizer (focado em gerenciar eventos) e Customer (focado em compras).

<br>

### **Categorias (Categories)**

- `Padronização Automática`: Para evitar duplicatas como "Rock" e "rock", o sistema formata o nome das categorias por debaixo dos panos (removendo acentos e deixando tudo minúsculo).

- `Sem Duplicatas`: É impossível cadastrar duas categorias com o mesmo nome padronizado.

- `Vínculo Seguro`: Uma categoria não pode ser apagada do sistema se existir algum evento utilizando-a.
