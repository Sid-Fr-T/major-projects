# Real-Time Chat Application (MERN + Socket.IO)

A full-stack real-time chat application built with MongoDB, Express, React, Node.js, and Socket.IO. Authenticated users join a global chat room where they can view persisted message history, see live incoming messages instantaneously, and monitor the current count of online users.

---

## Features

- **Global Chat Room**: A single, shared room for all authenticated users to chat in real time.
- **Instant Messaging with Socket.IO**: Live, bidirectional event-driven communication powered by Socket.IO on the server and `socket.io-client` on the client.
- **Message Persistence**: All messages are stored in MongoDB with the sender reference, text content, and timestamps (`createdAt`).
- **Live Online User Count**: Real-time presence indicator showing how many users are currently online.
- **Message History**: Loads all previous messages upon login/page load and displays them chronologically with automatic scroll to bottom.
- **Sender Identification**: Distinguishes between your messages and other users' messages with tailored bubble alignments and sender badges.
- **JWT Authentication**: Secure user registration and login with encrypted passwords (`bcryptjs`) and token-based route protection.
- **Responsive & Clean UI**: Minimal modern CSS interface with clean message bubbles, status indicators, and mobile-responsive layout.

---

## Tech Stack

- **Backend**:
  - Node.js & Express (ES Modules)
  - Socket.IO (`socket.io`)
  - MongoDB & Mongoose
  - JSON Web Tokens (`jsonwebtoken`)
  - Password hashing (`bcryptjs`)
  - CORS & Dotenv
- **Frontend**:
  - React 19
  - Vite
  - Socket.IO Client (`socket.io-client`)
  - React Router v7
  - Axios
  - Custom CSS (`App.css`)

---

## Project Structure

```text
11-chat-app/
├── client/                     # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── api/axios.js        # Axios instance with JWT interceptor
│   │   ├── components/         # Navbar, ProtectedRoute
│   │   ├── context/            # AuthContext, useAuth
│   │   ├── pages/              # Dashboard (Chat Room), Login, Register
│   │   ├── App.css             # Chat styling and responsive layouts
│   │   ├── App.jsx             # Main layout & router setup
│   │   └── main.jsx            # React root entry point
│   ├── index.html              # HTML shell & page title
│   └── package.json
├── server/                     # Express + Socket.IO backend
│   ├── src/
│   │   ├── config/db.js        # MongoDB connection
│   │   ├── controllers/        # authController, messageController
│   │   ├── middleware/auth.js  # JWT protect middleware
│   │   ├── models/             # User, Message
│   │   ├── routes/             # authRoutes, messageRoutes
│   │   └── server.js           # Express app & Socket.IO server
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   └── package.json
└── README.md                   # Project documentation
```

---

## Run Steps

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** instance (local MongoDB or MongoDB Atlas URI)

---

### 2. Backend Setup (`server/`)

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
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/chat_app?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```
   *(A sample `.env.example` is also provided in the `server` folder).*

4. Start the server:
   - **Development mode** (auto-reload on save):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Setup (`client/`)

1. Open a second terminal and navigate to the `client` directory:
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

4. Open the displayed URL in your browser:
   ```text
   http://localhost:5173
   ```

---

## How to Test Real-Time Functionality

1. Open `http://localhost:5173` in a browser window.
2. Register a user (e.g., Alice) and log in. You will enter the Global Chat Room.
3. Open a second browser window (or Incognito tab) at `http://localhost:5173`.
4. Register a second user (e.g., Bob) and log in.
5. Notice the **Online Users Count** update to reflect the connected users.
6. Type a message from Alice — it will instantly appear on Bob's screen in real time without refreshing.
7. Type a reply from Bob — it will instantly appear on Alice's screen.
8. Refresh either browser tab to verify that message history is persisted in MongoDB.

---

## API & Socket Reference

### REST Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Log in and receive JWT token | Public |
| `GET` | `/api/messages` | Fetch global chat message history | Protected |
| `POST` | `/api/messages` | Post a message via REST & broadcast | Protected |

### Socket.IO Events

- **`sendMessage`** (`Client -> Server`): Emits `{ text, token }` to save and broadcast a message.
- **`receiveMessage`** (`Server -> Client`): Broadcasts newly sent message with sender details and timestamp to all clients.
- **`onlineCount`** (`Server -> Client`): Broadcasts current number of active online users whenever a user connects or disconnects.
- **`authenticate`** (`Client -> Server`): Sends JWT token to authenticate socket connection.

