# Express, Socket.IO & MongoDB Backend

A real-time chat backend built with Express, Socket.IO, MongoDB, Mongoose, and JWT authentication.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **Real-Time Communication**: Socket.IO integration for instant bidirectional messaging and live connection tracking.
- **Global Chat Room**: Live broadcast of chat messages to all connected clients.
- **Message Persistence**: All chat messages stored in MongoDB with sender information and timestamps.
- **Live Online Users Count**: Real-time tracking and broadcasting of active online users.
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
    │   ├── authController.js     # Registration and login logic
    │   └── messageController.js  # Chat message history and REST creation
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Message.js    # Message schema & model (sender, text, timestamps)
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js    # Routes for /api/auth
    │   └── messageRoutes.js # Protected routes for /api/messages
    └── server.js         # HTTP + Socket.IO server initialization
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

### 2. Message Routes (`/api/messages`)
> Protected routes require the `Authorization` header: `Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages` | Retrieve global message history | Yes |
| `POST` | `/api/messages` | Create a new message & broadcast | Yes |

---

## Socket.IO Events

| Event | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `connect` | Client → Server | `{ auth: { token } }` | Authenticates socket connection |
| `authenticate` | Client → Server | `token` string | Late-authentication for socket |
| `sendMessage` | Client → Server | `{ text, token }` | Send a new message to global chat |
| `receiveMessage` | Server → Client | Populated message object | Broadcasts message to all clients |
| `onlineCount` | Server → Client | Number | Emits current count of online users |
