# Expense Tracker (MERN Application)

A full-stack MERN (MongoDB, Express, React, Node.js) Expense Tracker application with JWT authentication, real-time financial summary metrics, and full CRUD operations for income and expenses scoped strictly to the authenticated user.

---

## Features

- **User Authentication (JWT)**:
  - Secure registration and login with password hashing via `bcryptjs`.
  - Stateless JSON Web Token (JWT) authorization header interceptor.
  - Protected client-side routes with automatic redirect to `/login` for unauthenticated visitors.
- **User-Scoped Financial Data**:
  - Each transaction belongs to the logged-in user.
  - Full data privacy—users can only view, create, edit, and delete their own records.
- **Financial Summary Metrics**:
  - **Total Income**: Real-time sum of all income transactions.
  - **Total Expense**: Real-time sum of all expense transactions.
  - **Net Balance**: Automatic calculation (`Total Income - Total Expense`) with dynamic color indicator for positive or negative balance.
- **Expense & Income Management (CRUD)**:
  - **Add Transaction**: Form fields for `title`, `amount`, `category`, `type` (`income` or `expense`), and `date`.
  - **Transaction List**: Clean display showing type indicator (+/-), title, category tag, date, and formatted currency amount.
  - **Filter Tabs**: Filter transactions by `All`, `Income`, or `Expense`.
  - **Edit Transaction**: Inline editing to update title, amount, category, type, and date.
  - **Delete Transaction**: Fast deletion with confirmation prompt.
- **Responsive UI & Minimal CSS**:
  - Clean card-based design with mobile-responsive flex and grid layouts.
  - Visual status badges and color accents for income (green) and expenses (red).

---

## Tech Stack

- **Frontend**: React (Vite), React Router v7, Axios, Pure CSS
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`

---

## Project Structure

```text
03-expense-tracker/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios client with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # App navbar with brand and logout
│   │   │   └── ProtectedRoute.jsx  # Route guard for authenticated users
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state and token management
│   │   │   ├── authContextInstance.js
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Summary cards, transaction form & list
│   │   │   ├── Login.jsx           # User sign-in
│   │   │   └── Register.jsx        # User sign-up
│   │   ├── App.css                 # Complete responsive styling
│   │   ├── App.jsx                 # Routing configuration
│   │   └── main.jsx
│   └── README.md
├── server/
│   ├── .env                        # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example
│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register & login controllers
│   │   │   └── expenseController.js# User-scoped Expense CRUD logic
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT verification middleware
│   │   ├── models/
│   │   │   ├── Expense.js          # Expense schema (title, amount, category, type, date)
│   │   │   └── User.js             # User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /api/auth routes
│   │   │   └── expenseRoutes.js    # /api/expenses routes
│   │   └── server.js               # Server entry point
│   └── README.md
├── .gitignore
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB instance or MongoDB Atlas connection string)

---

## Run Steps

### 1. Configure Backend Environment

Navigate to the `server/` directory and ensure a `.env` file exists (a `.env` file is included, or you can copy from `.env.example`):

```bash
cd server
```

Create or verify `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_jwt_secret_key_here
```

### 2. Start Backend Server

Install dependencies and start the backend:

```bash
cd server
npm install
npm run dev
```

The Express API server will start on `http://localhost:5000`.

### 3. Start Frontend Client

In a separate terminal, navigate to the `client/` directory, install dependencies, and start the Vite development server:

```bash
cd client
npm install
npm run dev
```

Open your browser at the Vite URL (typically `http://localhost:5173`).

---

## API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Log in user (`email`, `password`) |

### Expenses (`/api/expenses`)

> All expense endpoints require the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/expenses` | Retrieve all expenses & incomes for current user |
| `POST` | `/api/expenses` | Create a transaction (`title`, `amount`, `category`, `type`, `date`) |
| `GET` | `/api/expenses/:id` | Retrieve single transaction |
| `PUT` | `/api/expenses/:id` | Update transaction (`title`, `amount`, `category`, `type`, `date`) |
| `DELETE` | `/api/expenses/:id` | Delete transaction |

