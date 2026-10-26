# Habit Tracker (MERN Stack)

A modern, responsive full-stack **Habit Tracker** application built with MongoDB, Express.js, React (Vite), and Node.js. It features secure JWT authentication, habit tracking with customizable frequencies (daily and weekly), automatic streak calculations, an interactive 7-day weekly progress view, and one-click completion toggling for today.

---

## ✨ Features

- **🔐 User Authentication**:
  - Secure registration and login using JWT (JSON Web Tokens).
  - Password hashing via `bcryptjs`.
  - User-scoped data isolation (users can only access and manage their own habits).
  - Protected client routes with persistent token storage.

- **📋 Habit Management (Full CRUD)**:
  - Create new habits with customizable frequency: **Daily** or **Weekly**.
  - Edit habit details (name and frequency).
  - Delete habits with confirmation safeguards.
  - Comprehensive habit overview with dashboard progress statistics.

- **🔥 Smart Streak Calculation**:
  - **Daily Habits**: Calculates consecutive days completed up to today (keeps the streak active if yesterday was completed and today is still in progress).
  - **Weekly Habits**: Calculates consecutive weeks with at least one completion.
  - Prominent visual streak badge with dynamic flame indicators.

- **📅 Interactive Weekly View (Last 7 Days)**:
  - Visual 7-day consistency strip for each habit displaying the day of the week, day of the month, and completion status.
  - Distinct visual indicators: completed (`✓`), today's pending state, and past incomplete days.
  - Clickable day buttons allowing users to easily toggle completion for any of the past 7 days.

- **⚡ Quick Actions & Dashboard Insights**:
  - One-click **"Mark Done for Today"** button with immediate status toggle (`✓ Done for Today`).
  - Real-time statistics banner showing total habits, habits completed today, and completion rate.

---

## 🏗️ Project Architecture

```text
13-habit-tracker/
├── README.md                 # Project documentation
├── .gitignore
├── server/                   # Express & MongoDB Backend
│   ├── .env                  # Environment configuration
│   ├── .env.example          # Sample environment variables
│   ├── package.json          # Server dependencies & scripts
│   └── src/
│       ├── config/
│       │   └── db.js         # MongoDB connection setup
│       ├── controllers/
│       │   ├── authController.js   # JWT authentication controller
│       │   └── habitController.js  # Habit CRUD & toggle controller
│       ├── middleware/
│       │   └── auth.js       # JWT authorization middleware
│       ├── models/
│       │   ├── Habit.js      # Habit schema (name, frequency, completedDates, user)
│       │   └── User.js       # User schema & password comparison
│       ├── routes/
│       │   ├── authRoutes.js # Routes for /api/auth
│       │   └── habitRoutes.js# Routes for /api/habits
│       └── server.js         # Express app entry point
└── client/                   # React Frontend (Vite)
    ├── index.html            # Main HTML document
    ├── package.json          # Client dependencies & scripts
    ├── vite.config.js        # Vite configuration
    └── src/
        ├── App.jsx           # Route declarations & main layout
        ├── App.css           # Styling for dashboard, cards, weekly grid & auth
        ├── main.jsx          # React DOM entry point
        ├── api/
        │   └── axios.js      # Axios instance with auth token interceptor
        ├── components/
        │   ├── Navbar.jsx    # Header navigation with brand and user greeting
        │   └── ProtectedRoute.jsx # Route guard for authenticated pages
        ├── context/
        │   ├── AuthContext.jsx       # Auth provider & state
        │   └── useAuth.js            # Custom authentication hook
        ├── pages/
        │   ├── Dashboard.jsx # Habit tracker dashboard & weekly view
        │   ├── Login.jsx     # User login page
        │   └── Register.jsx  # User registration page
        └── utils/
            └── habitUtils.js # Streak calculation & weekly date helpers
```

---

## 🗄️ Habit Data Model

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `String` | Yes | Name of the habit (e.g., "Morning Run", "Drink 2L Water") |
| `frequency` | `String` | Yes | Enum: `'daily'` or `'weekly'` (default: `'daily'`) |
| `completedDates`| `[Date]` | No | Array of dates on which the habit was completed |
| `user` | `ObjectId`| Yes | Reference to the owning `User` document |
| `createdAt` / `updatedAt` | `Date` | Auto | Managed by Mongoose timestamps |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)

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
   MONGO_URI=mongodb://localhost:27017/habit_tracker_db
   JWT_SECRET=your_super_secret_jwt_key
   ```
   *(A sample file is available at `server/.env.example`)*

4. Start the backend server:
   - For development (with auto-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
   *The backend will run at `http://localhost:5000`.*

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run at `http://localhost:5173`.*

4. Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |

### 📌 Habits (`/api/habits`)
*Requires `Authorization: Bearer <token>` header.*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/habits` | Retrieve all habits for the logged-in user | Yes |
| `POST` | `/api/habits` | Create a new habit (`name`, `frequency`) | Yes |
| `GET` | `/api/habits/:id` | Retrieve a specific habit by ID | Yes |
| `PUT` | `/api/habits/:id` | Update habit details (`name`, `frequency`) | Yes |
| `DELETE` | `/api/habits/:id` | Delete a habit by ID | Yes |
| `POST` | `/api/habits/:id/toggle` | Toggle completion for today or specified `{ date }` | Yes |

#### Example: Toggle Today's Completion (`POST /api/habits/:id/toggle`)
Request Body (optional):
```json
{
  "date": "2026-10-26"
}
```
If omitted, defaults to the current day. If the date is already present in `completedDates`, it is removed (unmarked); if not present, it is added.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), Bcryptjs, CORS, Dotenv
- **Frontend**: React 19, React Router v7, Axios, Vite
- **Styling**: Modern, responsive custom CSS (CSS Variables, Flexbox, Grid)

