# Task Manager (MERN Stack)

A lightweight and responsive full-stack Task Management application built with MongoDB, Express.js, React 19, and Node.js. It features JWT-based user authentication, per-user task scoping, comprehensive task CRUD capabilities, and status-based filtering.

---

## Features

- **JWT Authentication**: Secure user registration and login with bcrypt password hashing and token expiration.
- **Protected Routes**: Client-side and server-side route protection ensuring unauthenticated users cannot access task operations.
- **User Scoping**: Each user has isolated access; users can only view, create, edit, and delete their own tasks.
- **Full Task CRUD**:
  - **Title**: Required task title.
  - **Description**: Optional multi-line notes or details.
  - **Status**: Categorize tasks into `pending`, `in-progress`, or `done`.
  - **Priority**: Assign urgency levels: `low`, `medium`, or `high`.
  - **Due Date**: Optional completion deadline with formatted date display.
- **Filter Buttons**: Quickly filter tasks by status using dedicated buttons:
  - **All** (shows total count)
  - **Pending**
  - **In-progress**
  - **Done**
- **Inline Task Editing**: Edit task attributes directly on the dashboard card without leaving the page.
- **Responsive & Clean UI**: Minimalist, modern interface styled with clean CSS and visual badges for statuses and priorities.

---

## Tech Stack

- **Backend**:
  - Node.js & Express.js (ES Modules)
  - MongoDB & Mongoose ODM
  - JSON Web Tokens (`jsonwebtoken`)
  - Password hashing (`bcryptjs`)
  - Cross-Origin Resource Sharing (`cors`) & `dotenv`
- **Frontend**:
  - React 19 & Vite
  - React Router v7
  - Axios (configured with authorization interceptors)
  - Vanilla CSS (minimal and responsive design)

---

## Project Structure

```text
01-task-manager/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/axios.js              # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── Navbar.jsx            # Application header and user logout
│       │   └── ProtectedRoute.jsx    # Route guard for authenticated pages
│       ├── context/
│       │   └── AuthContext.jsx       # Global auth state and actions
│       ├── pages/
│       │   ├── Dashboard.jsx         # Task creation, filtering, and card list
│       │   ├── Login.jsx             # User sign-in
│       │   └── Register.jsx          # New user registration
│       ├── App.jsx                   # Route declarations
│       └── App.css                   # Global styles and responsive layout
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── config/db.js              # MongoDB connection
│       ├── controllers/
│       │   ├── authController.js     # User registration and login
│       │   └── taskController.js     # Task CRUD logic scoped to user
│       ├── middleware/auth.js        # JWT verification middleware
│       ├── models/
│       │   ├── Task.js               # Task schema (Title, Description, Status, Priority, DueDate)
│       │   └── User.js               # User schema
│       ├── routes/
│       │   ├── authRoutes.js         # /api/auth routes
│       │   └── taskRoutes.js         # /api/tasks routes
│       └── server.js                 # Express app entry point
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB Community Server or MongoDB Atlas connection string)

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task_manager_db
   JWT_SECRET=your_jwt_secret_key_here
   ```
   *(A valid MongoDB URI and secret should be set in `server/.env`)*

4. Start the backend server:
   - **Development mode** (with auto-reload):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   The backend API runs on `http://localhost:5000`.

---

### Step 2: Frontend Setup

1. Open a separate terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the displayed URL in your browser (typically `http://localhost:5173`).

---

## API Reference

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |

### Task Endpoints (`/api/tasks`)

*All task endpoints require the header `Authorization: Bearer <token>`.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks for the logged-in user (optional `?status=pending` query) |
| `POST` | `/api/tasks` | Create a new task (`title`, `description`, `status`, `priority`, `dueDate`) |
| `GET` | `/api/tasks/:id` | Get details of a specific task |
| `PUT` | `/api/tasks/:id` | Update a specific task |
| `DELETE` | `/api/tasks/:id` | Delete a specific task |

#### Example: Create Task (`POST /api/tasks`)

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete documentation",
  "description": "Write clear README with feature list and setup instructions",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-11-01"
}
```

**Response (`201 Created`):**
```json
{
  "_id": "671df1234567890abcdef123",
  "title": "Complete documentation",
  "description": "Write clear README with feature list and setup instructions",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-11-01T00:00:00.000Z",
  "user": "671df9876543210fedcba987",
  "createdAt": "2026-10-26T12:00:00.000Z",
  "updatedAt": "2026-10-26T12:00:00.000Z"
}
```

