# Portfolio CMS - React + Vite Frontend

A responsive React frontend for the Portfolio CMS built with Vite, React Router v7, and Axios.

## Features

- **Public Portfolio Page (`/`)**: Displays developer about bio, skills badges, and project showcase cards with image URLs.
- **Admin CMS Dashboard (`/admin`)**: Restricted editing panel for admins to edit about text, skills, and full CRUD for projects.
- **Role-Aware Auth**: Role choice (Admin / User) on registration with automated redirection.
- **Protected Routes**: Restricts access to `/admin` strictly to users with role `admin`.
- **Image URL Support**: Direct image URL preview and rendering without file uploads.
- **Clean Stylesheet (`App.css`)**: Minimal, responsive layout with CSS variables and grid.

---

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Vite development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```
