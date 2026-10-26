# Habit Tracker - Express & MongoDB Backend

A clean, modular Express backend with ES modules, Mongoose, JWT authentication, and user-scoped Habit Tracker CRUD operations with streak and completion tracking.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **User Scoping**: Habits are tied to the authenticated user; users can only view, update, toggle, and delete their own habits.
- **Habit Model**: Includes `name`, `frequency` (`daily`/`weekly`), `completedDates` (array of completion timestamps), and user association.
- **Completion Toggling**: Dedicated endpoint (`/api/habits/:id/toggle`) to mark or unmark habits for today or any specific date.
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
    │   ├── authController.js   # Registration and login logic
    │   └── habitController.js  # User-scoped Habit CRUD & toggle logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Habit.js      # Habit schema & model
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   └── habitRoutes.js# Protected routes for /api/habits
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
   MONGO_URI=mongodb://localhost:27017/habit_tracker_db
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
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT | No |

### 2. Habit Routes (`/api/habits`)
> All habit routes require the `Authorization` header: `Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/habits` | Get all habits for logged-in user | Yes |
| `POST` | `/api/habits` | Create a new habit (`name`, `frequency`) | Yes |
| `GET` | `/api/habits/:id` | Get single habit by ID | Yes |
| `PUT` | `/api/habits/:id` | Update habit details (`name`, `frequency`) | Yes |
| `DELETE` | `/api/habits/:id` | Delete habit by ID | Yes |
| `POST` | `/api/habits/:id/toggle` | Toggle completion for today or given date | Yes |

#### Example: Create Habit (`POST /api/habits`)
Headers:
`Authorization: Bearer <token>`

Request Body:
```json
{
  "name": "Morning 5km Run",
  "frequency": "daily"
}
```
Response (`201 Created`):
```json
{
  "_id": "671e0...",
  "name": "Morning 5km Run",
  "frequency": "daily",
  "completedDates": [],
  "user": "671df...",
  "createdAt": "2026-10-26T12:05:00.000Z",
  "updatedAt": "2026-10-26T12:05:00.000Z"
}
```

#### Example: Toggle Today (`POST /api/habits/:id/toggle`)
Headers:
`Authorization: Bearer <token>`

Optional Request Body:
```json
{
  "date": "2026-10-26"
}
```
Response (`200 OK`):
```json
{
  "_id": "671e0...",
  "name": "Morning 5km Run",
  "frequency": "daily",
  "completedDates": [
    "2026-10-26T00:00:00.000Z"
  ],
  "user": "671df...",
  "createdAt": "2026-10-26T12:05:00.000Z",
  "updatedAt": "2026-10-26T12:06:00.000Z"
}
```
