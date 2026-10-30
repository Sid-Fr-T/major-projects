# Portfolio CMS - Express & MongoDB Backend

The backend for Portfolio CMS, built with Node.js, Express, Mongoose, and JWT authentication.

## Features

- **ES Modules (`import`/`export`)**: Modern modular JavaScript architecture.
- **JWT Authentication & Password Hashing**: Stateless authentication using `jsonwebtoken` and `bcryptjs`.
- **Role-Based Authorization**: Route-level protection enforcing `admin` role privileges for portfolio content and project edits.
- **Public & Admin Portfolio Endpoints**:
  - Public `GET /api/portfolio` returning portfolio metadata, bio, skills, and projects.
  - Admin-only `PUT /api/portfolio` for editing about text and skills.
  - Admin-only `POST`, `PUT`, `DELETE /api/projects` for managing projects with image URLs (no file uploads).
- **Automatic Default Seeding**: Auto-initializes default portfolio profile and sample projects if the database is fresh.

---

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure `.env`**:
   Verify `server/.env` contains valid credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Start the server**:
   - Dev mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```
   *Runs by default at `http://localhost:5000`.*
