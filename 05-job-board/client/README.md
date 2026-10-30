# Job Board Frontend (React + Vite)

A modern React frontend for the Job Board application built with Vite, React Router v7, and Axios.

## Features

- **Role-Aware AuthContext**: Persists user credentials, role (`recruiter` or `applicant`), and JWT token in `localStorage`.
- **Protected Routes**: Restricts authenticated pages and automatically redirects unauthenticated sessions to `/login`.
- **Role-Based UI**:
  - **Recruiter View**: Post open positions (title, company, location, salary, description), edit/delete postings, and inspect candidate applicant lists (name, email, timestamp).
  - **Applicant View**: Search and browse listings, view key details, and apply once per job with instant visual status (`✓ Applied`).
- **Registration with Role Selection**: Allows users to choose between Applicant and Recruiter profiles at sign-up.
- **Navbar**: Displays brand title "Job Board", logged-in candidate/recruiter greeting, role badge, and logout.
- **Responsive Styling (`App.css`)**: Clean, minimalist layout for desktop, tablet, and mobile screens.

---

## Getting Started

1. **Start the Express backend** (in `server/`):
   ```bash
   cd server
   npm run dev
   ```

2. **Start the React frontend** (in `client/`):
   ```bash
   cd client
   npm run dev
   ```
   Open the browser URL shown by Vite (typically `http://localhost:5173`).
