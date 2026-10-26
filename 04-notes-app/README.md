# Notes App (MERN Stack)

A clean, full-stack MERN application for managing personal notes with JWT authentication, real-time search, pin priority, custom note colors, and a responsive card grid layout.

---

## Features

- **JWT Authentication**
  - Secure registration and login with encrypted passwords (`bcryptjs`).
  - Stateless JSON Web Token authentication with user-scoped resources.
  - Route protection on both backend and frontend (`ProtectedRoute`).
  - Auto-login state persistence using `localStorage`.

- **Note Management (Full CRUD)**
  - **Create**: Add new notes with a title, content, color, and pin status.
  - **Read**: Fetch all notes belonging to the authenticated user.
  - **Update**: In-place edit mode for updating note title, content, color, and pin status.
  - **Delete**: Remove notes with a confirmation prompt.

- **Note Properties**
  - `title` *(String, required)*: Note header or summary.
  - `content` *(String, optional)*: Detailed body text with preserved formatting and line breaks.
  - `color` *(String, default: `#ffffff`)*: Customizable background color with a quick-select pastel palette.
  - `pinned` *(Boolean, default: `false`)*: Bookmark status for important notes.

- **Pinned Notes Priority**
  - 1-click pin toggle directly on each note card and inside the creation/edit forms.
  - Pinned notes automatically float to the top (`pinned: true` notes appear first), followed by the newest notes.

- **Real-Time Search Box**
  - Responsive search bar to filter notes instantly by matching keywords in the `title` or `content`.
  - Quick-clear button (`✕`) to reset search criteria.

- **Responsive Card Grid Layout**
  - Flexible CSS Grid layout (`auto-fill`) adapting seamlessly to mobile, tablet, and desktop viewports.
  - Clean card design displaying custom background colors, active pin indicators, timestamps, and action buttons.

---

## Tech Stack

- **Frontend**: React 19, Vite, React Router v7, Axios, Modern CSS
- **Backend**: Node.js, Express (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS

---

## Project Structure

```text
04-notes-app/
├── client/                      # React + Vite frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js         # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Global header & logout
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Auth state & token persistence
│   │   │   ├── authContextInstance.js
│   │   │   └── useAuth.js       # Hook for auth context
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Notes dashboard (search, grid, pin toggle)
│   │   │   ├── Login.jsx        # Login page
│   │   │   └── Register.jsx     # Registration page
│   │   ├── App.css              # Application stylesheet
│   │   ├── App.jsx              # App layout and route switch
│   │   ├── index.css            # Base resets
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                      # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js# User register & login
│   │   │   └── noteController.js# User-scoped Note CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT protection middleware
│   │   ├── models/
│   │   │   ├── Note.js          # Note schema (title, content, color, pinned)
│   │   │   └── User.js          # User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # /api/auth routes
│   │   │   └── noteRoutes.js    # /api/notes routes
│   │   └── server.js            # Express server entry point
│   ├── .env.example             # Example environment variables
│   ├── package.json
│   └── README.md
└── README.md                    # Project documentation
```

---

## Run Steps

### 1. Prerequisites
- **Node.js**: v18.x or higher installed.
- **npm**: v9.x or higher installed.
- **MongoDB**: A local MongoDB instance running on `mongodb://localhost:27017` or a MongoDB Atlas connection string.

---

### 2. Backend Setup (`server`)

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `server/` root (or copy from `.env.example`):
     ```bash
     cp .env.example .env
     ```
   - Verify the configuration in `server/.env`:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/webdev_db
     JWT_SECRET=your_jwt_secret_key_here
     ```

4. Start the backend server:
   - **Development mode** (auto-reload with Node `--watch`):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   - The backend runs on `http://localhost:5000`.

---

### 3. Frontend Setup (`client`)

1. Open a separate terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser:
   - Typically `http://localhost:5173`.

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |

### Notes (`/api/notes`)
*Header required: `Authorization: Bearer <token>`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | Get all notes for user (pinned first, supports `?search=`) | Yes |
| `POST` | `/api/notes` | Create a new note (`title`, `content`, `color`, `pinned`) | Yes |
| `GET` | `/api/notes/:id` | Get single note by ID | Yes |
| `PUT` | `/api/notes/:id` | Update note by ID | Yes |
| `DELETE` | `/api/notes/:id` | Delete note by ID | Yes |

