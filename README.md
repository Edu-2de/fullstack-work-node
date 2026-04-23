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
