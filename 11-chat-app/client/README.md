# React + Vite Chat Frontend

A real-time chat frontend built with React 19, Vite, Socket.IO Client, React Router v7, and Axios.

## Features

- **Real-Time Messaging**: Connects to the Socket.IO server for instantaneous message broadcasting and receiving.
- **Global Chat Room**: Single unified chat room where authenticated users can chat live.
- **Message History**: Loads historical messages from MongoDB on entry with sender names and timestamps.
- **Live Online User Count**: Displays a live indicator with active connected users count.
- **Auto-Scroll**: Automatically scrolls to the newest message upon load and message arrival.
- **AuthContext**: Persists user session and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **Protected Routes**: Ensures only authenticated users can access the chat room.
- **Clean Responsive UI**: Modern responsive design with message bubbles differentiating own messages from others.

---

## Getting Started

1. **Start the Express backend** (in `server/` directory):
   ```bash
   cd server
   npm run dev
   ```
   Backend runs at `http://localhost:5000`.

2. **Start the React frontend** (in `client/` directory):
   ```bash
   cd client
   npm run dev
   ```
   Open the browser URL shown by Vite (typically `http://localhost:5173`).
