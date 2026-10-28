# Expense Tracker - React + Vite Frontend

A clean, modern React frontend for the Expense Tracker application built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user data and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Restricts the dashboard to authenticated users, automatically redirecting guests to `/login`.
- **Financial Summary Cards**: Real-time calculated cards showing **Total Income**, **Total Expense**, and **Net Balance** (with color-coded positive/negative states).
- **Transaction Form**: Add new income or expense with title, amount, category, type (`income` or `expense`), and date.
- **Filter Tabs**: Quickly toggle between viewing `All`, `Income`, or `Expense` transactions.
- **Transaction List with In-Place Editing**: View transactions formatted with currency, date, category tag, and type indicator; edit or delete transactions with instant state updates.
- **Navbar**: Displays the app brand, current user greeting, and logout action.
- **Clean Responsive CSS (`App.css`)**: Responsive layout for mobile, tablet, and desktop screens.

---

## Getting Started

1. **Start the Express backend** (in `server/` folder):
   ```bash
   cd server
   npm run dev
   ```
   Backend runs at `http://localhost:5000`.

2. **Start the React frontend** (in `client/` folder):
   ```bash
   cd client
   npm run dev
   ```
   Open the browser URL shown by Vite (typically `http://localhost:5173`).
