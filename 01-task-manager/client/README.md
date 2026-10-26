# React + Vite Frontend - Task Manager

A modern React frontend for the Task Manager application built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user data and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Redirects unauthenticated users to `/login`.
- **Pages**:
  - `Login`: User authentication with validation and error alerts.
  - `Register`: New user sign-up with password verification and error alerts.
  - `Dashboard`: Full CRUD interface for tasks (title, description, status, priority, due date) scoped to the logged-in user.
- **Filter Buttons**: Filter by `All`, `Pending`, `In-progress`, and `Done` with live counts.
- **Navbar**: Displays brand title "Task Manager", logged-in user's name, and a logout button.
- **Single Stylesheet (`App.css`)**: Responsive layout with modern CSS Grid card design, priority badges (`low`, `medium`, `high`), and status badges (`pending`, `in-progress`, `done`).

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
