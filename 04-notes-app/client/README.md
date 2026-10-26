# React + Vite Frontend - Notes App

A modern, responsive React frontend for the Notes application built with Vite, React Router v7, and Axios.

## Features

- **Authentication State**: Managed via `AuthContext` with JWT tokens persisted to `localStorage`. Includes registration, login, and logout.
- **Protected Routing**: Unauthenticated visitors are automatically redirected to `/login`.
- **Real-Time Note Search**: Instant search box filtering notes across both `title` and `content`.
- **Pin Toggle (Pinned First)**: 1-click pin toggle on cards with immediate reordering so pinned notes always appear first.
- **Note Colors**: Customizable pastel colors with an interactive color swatch selector.
- **Card Grid Layout**: Responsive CSS Grid card layout with inline editing, deletion confirmation, and formatted timestamps.
- **Clean Responsive UI**: Single stylesheet (`App.css`) with minimal, clean styling.

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
