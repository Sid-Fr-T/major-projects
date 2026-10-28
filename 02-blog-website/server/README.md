# Express & MongoDB Backend (Blog API)

A clean, modular Express backend with ES modules, Mongoose, JWT authentication, and author-scoped blog post CRUD operations.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **Author Scoping**: Posts are linked to their author; any user can read all posts, but only authors can update and delete their own posts.
- **MongoDB & Mongoose**: Schemas with validation and automatic `createdAt` / `updatedAt` timestamps.
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
    │   ├── authController.js  # Registration and login logic (kept untouched)
    │   └── postController.js  # Blog Post CRUD logic with author scoping
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Post.js       # Post schema: title, content, author, createdAt
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   └── postRoutes.js # Routes for /api/posts
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
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
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

### 2. Post Routes (`/api/posts`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Get all blog posts (public feed) | No |
| `GET` | `/api/posts/:id` | Get single post by ID | No |
| `GET` | `/api/posts/mine` | Get all posts created by authenticated user | Yes (`Bearer <token>`) |
| `POST` | `/api/posts` | Create a new blog post (`title`, `content`) | Yes (`Bearer <token>`) |
| `PUT` | `/api/posts/:id` | Update author's own post by ID | Yes (`Bearer <token>`) |
| `DELETE` | `/api/posts/:id` | Delete author's own post by ID | Yes (`Bearer <token>`) |
