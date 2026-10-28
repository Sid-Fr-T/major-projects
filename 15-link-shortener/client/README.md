# React + Vite Frontend - Link Shortener

A modern React frontend for the Link Shortener application built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user data and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Redirects unauthenticated users to `/login`.
- **Pages**:
  - `Login`: User authentication with validation and error alerts.
  - `Register`: New user sign-up with password verification and error alerts.
  - `Dashboard`: Link shortener management interface scoped to the logged-in user.
- **Link Shortener Dashboard**:
  - URL input form to generate shortened links.
  - Live click counter display for each shortened link.
  - One-click "Copy" button with visual feedback.
  - Direct redirect via clickable short URL links.
  - Delete action to remove existing links.
  - Summary stats for Total Links and Total Clicks.
- **Navbar**: Displays brand title, user greeting, and logout action.
- **Single Stylesheet (`App.css`)**: Responsive layout with modern, minimal CSS.

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
