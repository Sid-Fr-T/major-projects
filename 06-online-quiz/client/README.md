# React + Vite Frontend - Quiz System

A modern React frontend for the Online Quiz System built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user data and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Guards quiz dashboard, quiz test runner, and score history pages from unauthenticated access.
- **Pages & Components**:
  - `Navbar`: Displays application branding, navigation links (`Quizzes`, `Score History`), greeting, and logout.
  - `Dashboard`: Lists all available quizzes with question counts, "Take Quiz" action, and collapsible form to create custom quizzes.
  - `TakeQuiz`: Interactive quiz runner with option selection, progress tracker, instant evaluation, score card, and detailed answer review.
  - `ScoreHistory`: Dedicated score log with aggregate metrics (quizzes completed, average score %, highest score) and retake shortcuts.
  - `Login` & `Register`: Authentication pages with form validation and error handling.
- **Single Stylesheet (`App.css`)**: Responsive layout with modern CSS Grid card design, radio option cards, score display, and answer review banners.

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
   Access the frontend at `http://localhost:5173`.
