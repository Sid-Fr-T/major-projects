# Job Board Backend (Express & MongoDB)

A clean, modular Express backend with ES modules, Mongoose, JWT authentication, role-based authorization middleware, and Job Board CRUD + application endpoints.

## Features

- **ES Modules (`import`/`export`)**: Modern syntax throughout.
- **Stateless JWT Authentication**: Passwords hashed with `bcryptjs`, bearer token verified via `protect` middleware.
- **Role-Check Middleware (`requireRole`)**: Restricts job creation, modification, and deletion to `recruiter`, and application submissions to `applicant`.
- **Job Model**: Includes `title`, `company`, `location`, `salary`, `description`, `createdBy` (User ref), and an embedded `applicants` array tracking user, name, email, and application timestamp.
- **Duplicate Prevention**: Applicants can only apply once per job posting.

---

## Directory Structure

```text
server/
├── .env                  # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── .env.example          # Environment variable template
├── package.json          # Server dependencies & scripts
└── src/
    ├── config/
    │   └── db.js         # MongoDB connection setup
    ├── controllers/
    │   ├── authController.js # Register and login handlers
    │   └── jobController.js  # CRUD & applicant handling for jobs
    ├── middleware/
    │   ├── auth.js       # JWT protection middleware
    │   └── role.js       # Role check authorization middleware
    ├── models/
    │   ├── Job.js        # Job schema & model with embedded applicants
    │   └── User.js       # User schema & model with roles
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   └── jobRoutes.js  # Protected routes for /api/jobs
    └── server.js         # Server initialization and route registration
```

---

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure `.env`**:
   Ensure `server/.env` is configured with `PORT`, `MONGO_URI`, and `JWT_SECRET`.

3. **Run the server**:
   - Development mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```
   Runs on `http://localhost:5000`.

---

## API Endpoints

### 1. Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`, `role`) | None |
| `POST` | `/api/auth/login` | Log in and receive JWT + user profile | None |

### 2. Job Routes (`/api/jobs`)
> Requires `Authorization: Bearer <token>`

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Retrieve all open job listings | Any authenticated user |
| `GET` | `/api/jobs/my` | Retrieve recruiter's own jobs with applicants | Recruiter |
| `GET` | `/api/jobs/:id` | Retrieve single job by ID | Any authenticated user |
| `POST` | `/api/jobs` | Create a new job posting | Recruiter |
| `PUT` | `/api/jobs/:id` | Update job posting by ID (owner only) | Recruiter |
| `DELETE` | `/api/jobs/:id` | Delete job posting by ID (owner only) | Recruiter |
| `POST` | `/api/jobs/:id/apply` | Apply to a job posting (once per job) | Applicant |
