# Expense Tracker - Express & MongoDB Backend

A clean, modular Express backend with ES modules, Mongoose, JWT authentication, and user-scoped Expense CRUD operations.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax throughout the server.
- **Stateless JWT Authentication**: Secure password hashing with `bcryptjs` and token verification.
- **User Scoping**: Each expense and income entry belongs strictly to the authenticated user; users can only view, create, edit, and delete their own entries.
- **Expense Model**: Includes `title`, `amount`, `category`, `type` (`income` or `expense`), `date`, and user association.
- **CORS & Environment Configurations**: Configured via `cors` and `dotenv`.

---

## Directory Structure

```text
server/
├── .env                  # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── .env.example          # Example environment variable template
├── .gitignore            # Git ignore rule for node_modules and .env
├── package.json          # Node dependencies and scripts
├── README.md             # Backend documentation
└── src/
    ├── config/
    │   └── db.js         # MongoDB connection setup
    ├── controllers/
    │   ├── authController.js     # User registration and login
    │   └── expenseController.js  # Scoped Expense CRUD logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Expense.js    # Expense schema & model
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js    # Routes for /api/auth
    │   └── expenseRoutes.js # Protected routes for /api/expenses
    └── server.js         # Express app initialization and server entry point
```

---

## Setup & Running

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure `.env`**:
   Ensure `server/.env` is configured (or copy from `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/expense_tracker
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. **Run the server**:
   - Development mode (with auto-reload):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

---

## API Endpoints

### 1. Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT | No |

### 2. Expense Routes (`/api/expenses`)
> All expense routes require the `Authorization` header: `Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/expenses` | Get all expenses/incomes for logged-in user | Yes |
| `POST` | `/api/expenses` | Create a new transaction (income/expense) | Yes |
| `GET` | `/api/expenses/:id` | Get single expense by ID | Yes |
| `PUT` | `/api/expenses/:id` | Update expense by ID | Yes |
| `DELETE` | `/api/expenses/:id` | Delete expense by ID | Yes |

#### Example: Create Expense (`POST /api/expenses`)
Headers:
`Authorization: Bearer <token>`

Request Body:
```json
{
  "title": "Grocery Shopping",
  "amount": 84.50,
  "category": "Food & Dining",
  "type": "expense",
  "date": "2026-10-28"
}
```
Response (`201 Created`):
```json
{
  "_id": "671e0...",
  "title": "Grocery Shopping",
  "amount": 84.5,
  "category": "Food & Dining",
  "type": "expense",
  "date": "2026-10-28T00:00:00.000Z",
  "user": "671df...",
  "createdAt": "2026-10-28T12:05:00.000Z",
  "updatedAt": "2026-10-28T12:05:00.000Z"
}
```
