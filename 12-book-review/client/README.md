# React + Vite Frontend - Book Review

A responsive React frontend for the Book Review application built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user data and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Redirects unauthenticated users to `/login`.
- **Pages**:
  - `Login`: User authentication with validation and error alerts.
  - `Register`: New user sign-up with password verification and error alerts.
  - `Dashboard`: Catalog of books with real-time search, "Add New Book" form, average rating preview, and link to book details.
  - `BookDetails`: Dedicated book page showing book overview, average rating badge, community review feed, and review form (enforcing one review per user).
- **Navbar**: Displays the "Book Review" brand, user greeting, and logout button.
- **Single Stylesheet (`App.css`)**: Responsive layout with modern card grid, star rating graphics, and book cover display.

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
