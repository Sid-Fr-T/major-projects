# Express & MongoDB Backend - Link Shortener

A clean, modular Express backend with ES modules, Mongoose, JWT authentication, and user-scoped Link Shortener CRUD operations.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **User Scoping**: Links are tied to the authenticated user; users can only view and delete their own links.
- **6-Character Code Generation**: Secure, collision-resistant random alphanumeric string generation (`[a-zA-Z0-9]`).
- **Public Redirection (`/s/:shortCode`)**: Directs traffic to the destination URL while atomically incrementing clicks.
- **MongoDB & Mongoose**: `Link` and `User` schemas with validation, defaults, and timestamps.
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
    │   └── linkController.js  # Link CRUD & public redirect logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Link.js       # Link schema & model (originalUrl, shortCode, clicks, user)
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   └── linkRoutes.js # Protected routes for /api/links
    └── server.js         # Express app initialization, /s/:shortCode redirect, and server entry point
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
   MONGO_URI=mongodb://localhost:27017/link_shortener
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

### 2. Public Redirection Route

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/s/:shortCode` | Redirect to original URL and increment `clicks` | No |

### 3. Link Management Routes (`/api/links`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/links` | Get all links belonging to the authenticated user | Yes |
| `POST` | `/api/links` | Create a new shortened link (`{ originalUrl }`) | Yes |
| `DELETE` | `/api/links/:id` | Delete a specific link owned by the user | Yes |
