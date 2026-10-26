# Express & MongoDB Backend - Notes API

A clean, modular Express backend with ES modules, Mongoose, JWT authentication, and user-scoped Notes CRUD operations.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **User Scoping**: Notes are tied to the authenticated user; users can only view, create, update, and delete their own notes.
- **MongoDB & Mongoose**: Schemas with validation, defaults, and timestamps (`createdAt`, `updatedAt`).
- **Notes Management**: Note model with `title`, `content`, `color`, and `pinned`.
- **Pinned Notes Priority**: Notes query sorted by pinned status (`pinned: -1`), then newest first (`createdAt: -1`).
- **Search Support**: Backend search support via `?search=` query parameter across title and content.
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
    │   └── noteController.js  # User-scoped Notes CRUD logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Note.js       # Note schema & model (title, content, color, pinned, user)
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   └── noteRoutes.js # Protected routes for /api/notes
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
   MONGO_URI=mongodb://localhost:27017/webdev_db
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

### 2. Note Routes (`/api/notes`)
> All note routes require the `Authorization` header: `Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | Get all notes (pinned first, supports `?search=`) | Yes |
| `POST` | `/api/notes` | Create a new note | Yes |
| `GET` | `/api/notes/:id` | Get single note by ID | Yes |
| `PUT` | `/api/notes/:id` | Update note by ID (title, content, color, pinned) | Yes |
| `DELETE` | `/api/notes/:id` | Delete note by ID | Yes |

#### Example: Create Note (`POST /api/notes`)
Headers:
`Authorization: Bearer <token>`

Request Body:
```json
{
  "title": "Project Ideas",
  "content": "Build an offline-first note keeper with React and Express",
  "color": "#fef9c3",
  "pinned": true
}
```

Response (`201 Created`):
```json
{
  "_id": "671e0...",
  "title": "Project Ideas",
  "content": "Build an offline-first note keeper with React and Express",
  "color": "#fef9c3",
  "pinned": true,
  "user": "671df...",
  "createdAt": "2026-10-26T12:05:00.000Z",
  "updatedAt": "2026-10-26T12:05:00.000Z"
}
```
