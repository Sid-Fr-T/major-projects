# Express & MongoDB Backend

A clean, modular Express backend with ES modules, Mongoose, JWT authentication, and user-scoped CRUD operations.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **User Scoping**: Items are tied to the authenticated user; users can only view, update, and delete their own items.
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
    │   └── itemController.js  # User-scoped Item CRUD logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Item.js       # Generic Item schema & model
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   └── itemRoutes.js # Protected routes for /api/items
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

#### Example: Register User (`POST /api/auth/register`)
Request Body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```
Response (`201 Created`):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "_id": "671df...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "createdAt": "2026-10-26T12:00:00.000Z"
  }
}
```

#### Example: Login (`POST /api/auth/login`)
Request Body:
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
Response (`200 OK`):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "_id": "671df...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "createdAt": "2026-10-26T12:00:00.000Z"
  }
}
```

---

### 2. Item Routes (`/api/items`)
> All item routes require the `Authorization` header: `Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Get all items for logged-in user | Yes |
| `POST` | `/api/items` | Create a new item | Yes |
| `GET` | `/api/items/:id` | Get single item by ID | Yes |
| `PUT` | `/api/items/:id` | Update item by ID | Yes |
| `DELETE` | `/api/items/:id` | Delete item by ID | Yes |

#### Example: Create Item (`POST /api/items`)
Headers:
`Authorization: Bearer <token>`

Request Body:
```json
{
  "title": "Build portfolio project",
  "description": "Create full stack MERN app",
  "status": "pending"
}
```
Response (`201 Created`):
```json
{
  "_id": "671e0...",
  "title": "Build portfolio project",
  "description": "Create full stack MERN app",
  "status": "pending",
  "user": "671df...",
  "createdAt": "2026-10-26T12:05:00.000Z",
  "updatedAt": "2026-10-26T12:05:00.000Z"
}
```

