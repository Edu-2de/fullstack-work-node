# **EventPass API**

A robust RESTful API designed for event management and ticketing. Built with Node.js and TypeScript, this system handles the complete lifecycle of events, users, and ticket sales, emphasizing data integrity, security, and scalability.

### **Tech Stack**

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Testing**: Jest

<br/>

### **Core Features**

- **Role-Based Access Control (RBAC):** Distinct permissions for `Admin`, `Organizer`, and `Customer` roles ensuring secure endpoint access.

- **Concurrency Control**: Utilizes database-level pessimistic locking during ticket purchases to strictly prevent overselling and race conditions.

- **Entity Lifecycle Management**: Implements Soft Deletes for data preservation and custom cascade logic for event cancellations (automatically invalidating associated tickets).

- **Data Sanitization & Validation**: Strict schema validation and payload transformation using Zod.

- **Security Hardening**: Integrated with Helmet for HTTP headers protection and Express Rate Limit to prevent brute-force attacks.

- **File Management**: Local storage handling for event banner uploads using Multer.

- **Architecture**: Built upon SOLID principles, utilizing Controller-Service-Repository layers and Dependency Injection.

<br/>

### **Main API Endpoints**

Here is a brief overview of the core routes available in the API:

**Auth & Users**

- `POST /login` - Authenticate user and get JWT token
- `POST /users/register` - Register a new customer
- `GET /users/profile` - Get logged-in user profile

**Events**

- `GET /events` - List all published events (with pagination and filters)
- `POST /events` - Create a new event (Organizer role required)
- `PATCH /events/:id/cancel` - Cancel an event and cascade cancel tickets

**Tickets**

- `POST /tickets/:id` - Purchase a ticket for an event
- `PATCH /tickets/:id` - Use/Validate a ticket at the entrance
- `GET /users/profile/tickets` - List user's purchased tickets

<br>

> **Tip:** An imported collection file (`insomnia.json` ) is included in the root directory for easy endpoint testing.

<br>

<br>

### **Regras de Negócio (Business Rules)**

O sistema foi arquitetado com uma camada robusta de serviços (Service Layer) para garantir a integridade dos dados, a segurança das transações e o fluxo correto das operações. As principais regras do domínio são:

**Tickets**

- **Controle de Concorrência**: O banco de dados utiliza bloqueio pessimista (`pessimistic_write`) na tabela de eventos durante o checkout para evitar que dois usuários comprem o último ingresso simultaneamente (Double-Booking).
- **Prevenção de Venda no Passado**: O sistema bloqueia a compra de ingressos para eventos cuja data de início seja menor que a data atual.
- **Controle de Lotação**: É impossível emitir um ingresso se a capacidade disponível (`available_capacity`) do evento for menor ou igual a zero.
- **Restrição de Validação**: Apenas o organizador dono do evento (ou um Administrador) tem permissão para validar e dar baixa em um ingresso. O ingresso só pode ser validado no evento exato para o qual foi emitido.
- **Estorno de Capacidade**: Quando um cliente (ou Administrador) cancela um ingresso válido, a capacidade disponível do evento correspondente é imediatamente acrescida em 1.
- **Cancelamento Restrito**: Apenas o cliente proprietário do ingresso ou um Administrador podem solicitar o cancelamento de uma compra. Somente ingressos com status válido podem ser cancelados ou validados.

**Eventos**

- **Datas Válidas**: A criação ou remarcação de eventos para datas no passado é expressamente proibida pela API.
- **Proteção de Autoria**: Apenas o Organizador que criou o evento (ou um Administrador) possui privilégios para editá-lo, cancelá-lo ou excluí-lo.
- **Gestão de Capacidade**: Na criação, a capacidade disponível herda o valor da capacidade total. Em atualizações, o sistema garante que a capacidade disponível não seja negativa nem exceda a capacidade total do evento.
- **Integridade Financeira**: A exclusão permanente de um evento é bloqueada se houver qualquer ingresso já emitido para ele. Nesses cenários, a alternativa exigida é a mudança de status para "Cancelado".
- **Cascata de Cancelamento**: Ao cancelar um evento inteiro, o sistema propaga a ação e cancela automaticamente todos os ingressos atrelados a ele.

**Usuários e Autenticação**

- **Unicidade de Identidade**: O endereço de e-mail deve ser único; o sistema rejeita cadastros ou atualizações com e-mails já em uso, retornando erro de conflito.
- **Prevenção de Abandono (Organizador)**: Um Organizador é impedido de excluir sua própria conta se possuir eventos ativos no sistema. Ele é obrigado a cancelar os eventos antes de prosseguir com a exclusão.
- **Prevenção de Perda (Cliente)**: Um Cliente não pode excluir sua conta se possuir tickets ativos e não utilizados, protegendo-o de perder o acesso às suas compras.
- **Preservação de Histórico**: Exclusões de contas utilizam o conceito de "Soft Delete", permitindo consultas de histórico a usuários inativados.

**Categories**

- **Normalização Dinâmica**: Nomes de categorias são sanitizados no back-end (transformados em minúsculas, sem acentos e sem espaços extras) antes de validações para evitar duplicações semânticas (ex: "Música" e "musica").
- **Unicidade**: É impossível cadastrar duas categorias com o mesmo nome normalizado.
- **Segurança de Relacionamento**: Uma categoria não pode ser excluída do sistema se já estiver vinculada a um ou mais eventos cadastrados.

<br>

### **Prerequisites**

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher recommended)
- PostgreSQL

</br>

### **Getting Started**

**1. Clone the repository**

```Bash
git clone <repository-url>
cd eventpass-api
```

**2. Install dependencies**

```Bash
npm install
```

**3. Configure Environment Variables**

Create a `.env` file in the root directory based on the following structure:

```Env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=eventpass_db

# Security
JWT_SECRET=your_super_secret_jwt_key

# Admin Seed Setup
ADMIN_EMAIL=admin@eventpass.com
ADMIN_PASSWORD=admin_secure_password
```

**4. Start the Application**

For development mode:

```Bash
npm run dev
```

> Note: The database tables will be synchronized automatically in development mode via TypeORM.

**5. Run the Database Seed (Optional)**

   To create the initial administrator account:

```Bash
npx ts-node src/seeds/admin.seed.ts
```

**6. Build for Production**

To compile the TypeScript code to JavaScript:

```Bash
npm run build
```

<br>

### **Running Tests**

The application includes a comprehensive suite of unit tests covering the core business logic (Services) using in-memory Fake Repositories.

To execute the test suite:

```Bash
npm test
```

(Or npx jest depending on your package.json scripts setup).

<br>

### **Project Structure**

- `src/controllers`: Handles HTTP requests and responses.
- `src/services`: Contains the core business logic.
- `src/repositories`: Handles data access and database operations.
- `src/entities`: TypeORM models representing database tables.
- `src/validators`: Zod schemas for request validation.
- `src/middlewares`: Custom Express middlewares (Auth, Error Handling, Validation).
- `src/factories`: Dependency injection setup.

<br>

### **License**

This project is licensed under the MIT License.
