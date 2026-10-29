# React + Vite Frontend - Link Shortener

A React frontend for the Link Shortener application built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user data and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Redirects unauthenticated users to `/login`.
- **Pages**:
  - `Login`: User authentication with validation and error alerts.
  - `Register`: New user sign-up with password verification and error alerts.
  - `Dashboard`: Link shortener management interface with URL input, copy button, click metrics, and deletion.
  - `RedirectHandler`: Public route handler for `/s/:shortCode` that redirects to destination via backend.
- **Navbar**: Displays brand (`🔗 Link Shortener`), user greeting, and logout button.
- **Styles (`App.css`)**: Responsive layout with modern cards, click counter badges, copy button states, and summary stats.

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
