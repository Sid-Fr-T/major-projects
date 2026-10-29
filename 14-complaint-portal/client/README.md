# Complaint Portal — Frontend (React + Vite)

A modern, responsive React frontend for the Complaint Portal application built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user session and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Restricts access to authenticated users, automatically redirecting guests to `/login`.
- **Role-Aware Navigation & UI**:
  - Displays user profile and role badges (`Admin` / `User`) in the navbar.
  - Tailored dashboard experience based on role (Admin vs Standard User).
- **Complaint Management (User)**:
  - Form to raise complaints with title, category selection, and description.
  - View personal complaints list with color-coded status badges (`open`, `in-progress`, `resolved`).
  - Read admin resolution remarks.
  - Edit open complaints or withdraw/delete them.
- **Administrative Controls (Admin)**:
  - Real-time overview of all complaints submitted across users.
  - Inline controls to update status (`open`, `in-progress`, `resolved`) and attach remarks.
  - Submitter details display (name and email).
- **Search & Filters**:
  - Filter by status (`All`, `Open`, `In Progress`, `Resolved`).
  - Filter by category (`Technical`, `Billing`, `Customer Service`, etc.).
  - Real-time text search across title, description, and remarks.
- **Stats Counter**: Live metrics cards tracking counts for Total, Open, In Progress, and Resolved complaints.

---

## Getting Started

1. **Install Dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open the browser URL shown in the terminal (typically `http://localhost:5173`).

3. **Build for Production**:
   ```bash
   npm run build
   ```
