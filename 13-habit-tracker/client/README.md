# Habit Tracker - React + Vite Frontend

A modern React frontend for the Habit Tracker application built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user data and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Redirects unauthenticated users to `/login`.
- **Pages**:
  - `Login`: User authentication with validation and error alerts.
  - `Register`: New user sign-up with password verification and error alerts.
  - `Dashboard`: Habit tracker dashboard featuring habit creation, editing, deleting, streak badges, 7-day weekly progress view, and one-click completion toggling for today.
- **Navbar**: Displays the "Habit Tracker" brand title, user greeting (`Hello, <name>`), and a quick logout button.
- **Single Stylesheet (`App.css`)**: Responsive layout with modern CSS Grid card design, streak badges (`🔥`), 7-day weekly status indicators (`✓`), and stats banner.

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
