# Express & MongoDB Backend - Task Manager

A clean, modular Express backend with ES modules, Mongoose, JWT authentication, and user-scoped Task CRUD operations.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **User Scoping**: Tasks are tied to the authenticated user; users can only view, update, and delete their own tasks.
- **Task Attributes**: Title, Description, Status (`pending`, `in-progress`, `done`), Priority (`low`, `medium`, `high`), and Due Date.
- **MongoDB & Mongoose**: Schemas with validation, defaults, and timestamps.
- **CORS & Environment Variables**: Configured via `cors` and `dotenv`.

---

## Directory Structure

```text
server/
├── .env                  # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── .env.example          # Example environment variable template
├── .gitignore            # Git ignore rule for node_modules and .env
├── package.json          # Node dependencies and scripts
├── README.md             # Backend documentation
└── src/
    ├── config/
    │   └── db.js         # MongoDB connection setup
    ├── controllers/
    │   ├── authController.js  # Registration and login logic
    │   └── taskController.js  # User-scoped Task CRUD logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Task.js       # Task schema & model
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   └── taskRoutes.js # Protected routes for /api/tasks
    └── server.js         # Express app initialization and server entry point
```

---

## Setup & Running

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure `.env`**:
   Ensure `server/.env` is configured (or copy from `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task_manager_db
   JWT_SECRET=your_jwt_secret_key_change_in_production
   ```

3. **Run the server**:
   - Development mode (with auto-reload):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

---

## API Endpoints

### 1. Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT | No |

---

### 2. Task Routes (`/api/tasks`)
> All task routes require the `Authorization` header: `Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks for logged-in user (optional `?status=pending`) | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `GET` | `/api/tasks/:id` | Get single task by ID | Yes |
| `PUT` | `/api/tasks/:id` | Update task by ID | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | Yes |

#### Example: Create Task (`POST /api/tasks`)
Headers:
`Authorization: Bearer <token>`
`Content-Type: application/json`

Request Body:
```json
{
  "title": "Complete assignment",
  "description": "Finalize project documentation and push to GitHub",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-11-10"
}
```
Response (`201 Created`):
```json
{
  "_id": "671e0...",
  "title": "Complete assignment",
  "description": "Finalize project documentation and push to GitHub",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-11-10T00:00:00.000Z",
  "user": "671df...",
  "createdAt": "2026-10-26T12:05:00.000Z",
  "updatedAt": "2026-10-26T12:05:00.000Z"
}
```
