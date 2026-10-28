# Express & MongoDB Backend - Link Shortener

A clean, modular Express backend with ES modules, Mongoose, JWT authentication, and user-scoped Link Shortener CRUD operations.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **User Scoping**: Links are tied to the authenticated user; users can only view and delete their own links.
- **Link Shortening**: Generates random 6-character unique alphanumeric short codes.
- **Public Redirection & Click Tracking**: `/s/:shortCode` atomically increments click count and redirects to `originalUrl`.
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
    │   └── linkController.js  # Link creation, listing, deletion, redirect logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Link.js       # Link schema & model (originalUrl, shortCode, clicks, user)
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   └── linkRoutes.js # Protected routes for /api/links
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

---

### 2. Protected Link Routes (`/api/links`)
> All link routes require the `Authorization` header: `Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/links` | Get all links for logged-in user | Yes |
| `POST` | `/api/links` | Create a new shortened link (`originalUrl`) | Yes |
| `DELETE` | `/api/links/:id` | Delete link by ID | Yes |

#### Example: Create Link (`POST /api/links`)
Headers:
`Authorization: Bearer <token>`

Request Body:
```json
{
  "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
}
```

Response (`201 Created`):
```json
{
  "_id": "671e0...",
  "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  "shortCode": "aB3dE9",
  "clicks": 0,
  "user": "671df...",
  "createdAt": "2026-10-28T12:05:00.000Z",
  "updatedAt": "2026-10-28T12:05:00.000Z"
}
```

---

### 3. Public Short Link Redirect Route (`/s/:shortCode`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/s/:shortCode` | Increments link clicks and redirects to original URL | No (Public) |
