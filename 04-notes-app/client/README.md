# React + Vite Frontend

A React frontend for the Item Management application built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user data and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Redirects unauthenticated users to `/login`.
- **Pages**:
  - `Login`: User authentication with validation and error alerts.
  - `Register`: New user sign-up with password verification and error alerts.
  - `Dashboard`: Full CRUD interface for items (title, description, status) scoped to the logged-in user.
- **Navbar**: Displays the logged-in user's name and provides a quick logout button.
- **Single Stylesheet (`App.css`)**: Responsive layout with modern CSS Grid card design and status badges (`pending`, `in-progress`, `done`).

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
