# React + Vite Frontend (Blog)

A React frontend for the Blog application built with Vite, React Router v7, and Axios.

## Features

- **Public Home Page (`/`)**: Displays all published blog posts with author attribution, creation date, and excerpt.
- **Single Post View (`/post/:id`)**: Dedicated article reading page with full post content. Includes author controls (Edit/Delete) if viewed by the author.
- **AuthContext**: Persists user session and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Dashboard (`/dashboard`)**: Authoring studio to compose new blog posts (`title`, `content`) and manage user's own published articles.
- **Navbar**: Displays application branding, navigation links (`Home`, `My Posts`), user greeting, and logout button.
- **Single Stylesheet (`App.css`)**: Responsive layout with modern CSS Grid card design, article typography, and form controls.

---

## Getting Started

1. **Start the Express backend** (in `server/` directory):
   ```bash
   cd server
   npm run dev
   ```
   Backend runs at `http://localhost:5000`.

2. **Start the React frontend** (in `client/` directory):
   ```bash
   cd client
   npm run dev
   ```
   Open the browser URL shown by Vite (typically `http://localhost:5173`).
