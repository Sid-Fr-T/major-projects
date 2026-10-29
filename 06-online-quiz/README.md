# Online Quiz System (MERN Stack)

A full-stack MERN (MongoDB, Express, React, Node.js) online quiz application with JWT authentication, multiple-choice quizzes, instant scoring evaluation, user score history tracking, and custom quiz creation.

---

## Features

- **JWT Authentication & User Management**:
  - Secure registration and login with bcrypt password hashing.
  - Stateless JSON Web Token authentication with auto-attach via Axios interceptors.
  - Protected client routes for taking quizzes, viewing results, and checking history.

- **Quiz Management & Pre-Seeded Quizzes**:
  - Pre-seeded with **2 sample quizzes containing 5 questions each**:
    1. *JavaScript Fundamentals* (variables, types, scoping, array methods, JSON).
    2. *Web Development & React* (lifecycle hooks, JSX, Virtual DOM, HTTP codes, list keys).
  - Each question features **question text, 4 distinct options (A, B, C, D), and a correct answer**.
  - Auto-seeding on initial server launch if the database is empty, plus manual seed CLI command (`npm run seed`).

- **Interactive Quiz Taking**:
  - Clean question-by-question layout with intuitive radio card options.
  - Live progress bar tracking answered vs. total questions.
  - Anti-cheat design: correct answers are omitted from the quiz payload and evaluated safely on the server.

- **Instant Scoring & Performance Breakdown**:
  - Immediate score calculation upon submission (`score / totalQuestions` and percentage).
  - Achievement badges based on performance tier (100% Perfect, 80%+ Excellent, 60%+ Passed, <60% Review).
  - Answer breakdown highlighting correct selections, mistakes, and revealing correct answers.

- **Dedicated Score History Page**:
  - Persistent record of every quiz attempt scoped to the authenticated user.
  - Summary metrics: Total Quizzes Completed, Average Score %, and Highest Score %.
  - History log displaying quiz title, score, percentage badge, date/time, and one-click "Retake Quiz" option.

- **Custom Quiz Creation**:
  - Collapsible quiz creation form on the dashboard to build new quizzes.
  - Form validation for quiz title, description, question text, 4 options, and correct answer selection.

- **Modern & Responsive UI**:
  - Clean, responsive CSS with mobile-friendly cards and navigation.

---

## Tech Stack

- **Frontend**: React 19, Vite, React Router DOM 7, Axios
- **Backend**: Node.js, Express 4 (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Styling**: Modern vanilla CSS with responsive grid and card layout

---

## Directory Structure

```text
06-online-quiz/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios instance with auth token interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar with brand and user links
│   │   │   └── ProtectedRoute.jsx # Route guard for authenticated pages
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Auth state provider (login, register, logout)
│   │   │   └── useAuth.js      # Custom authentication hook
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Available quizzes list & quiz builder form
│   │   │   ├── TakeQuiz.jsx    # Interactive quiz test runner & results breakdown
│   │   │   ├── ScoreHistory.jsx# User's score history log and statistics
│   │   │   ├── Login.jsx       # Login form
│   │   │   └── Register.jsx    # User registration form
│   │   ├── App.jsx             # Router layout configuration
│   │   ├── App.css             # Main styling for quizzes, forms, and results
│   │   └── main.jsx            # React root mount
│   ├── index.html              # HTML entry point (Quiz System)
│   └── package.json
│
├── server/                     # Express & MongoDB Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # Mongoose MongoDB connection
│   │   │   └── seedData.js     # 2 sample quizzes (5 questions each) & auto-seed
│   │   ├── controllers/
│   │   │   ├── authController.js  # Register & login controller
│   │   │   ├── quizController.js  # Quiz CRUD, questions retrieval & answer scoring
│   │   │   └── scoreController.js # User score history retrieval & management
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification middleware
│   │   ├── models/
│   │   │   ├── Quiz.js         # Quiz schema (questions, 4 options, correctAnswer)
│   │   │   ├── Score.js        # Score attempt schema (user, quiz, score, percentage)
│   │   │   └── User.js         # User schema for authentication
│   │   ├── routes/
│   │   │   ├── authRoutes.js   # /api/auth routes
│   │   │   ├── quizRoutes.js   # /api/quizzes routes
│   │   │   └── scoreRoutes.js  # /api/scores routes
│   │   ├── seed.js             # Standalone seed execution script
│   │   └── server.js           # Server entry point
│   ├── .env                    # Backend environment variables
│   └── package.json
└── README.md                   # Project documentation
```

---

## Getting Started & Run Steps

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas cluster connection string)

---

### Step 1: Backend Setup

1. Open a terminal in the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/online_quiz?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. *(Optional)* Seed the database with sample quizzes manually:
   ```bash
   npm run seed
   ```
   > **Note**: The server also automatically seeds the 2 sample quizzes on initial startup if the database contains no quizzes.

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

---

### Step 2: Frontend Setup

1. Open a separate terminal in the `client` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend application will be accessible at `http://localhost:5173`.

---

## How to Use the App

1. **Register / Log In**:
   - Navigate to `http://localhost:5173/register` to create a new user account.
   - Or log in with existing credentials at `http://localhost:5173/login`.
2. **Dashboard**:
   - Browse the available quizzes (*JavaScript Fundamentals*, *Web Development & React*, or user-created quizzes).
   - Click **Take Quiz →** to start any quiz.
   - Click **+ Create Custom Quiz** to define a new quiz with custom questions, 4 options, and correct answers.
3. **Taking a Quiz**:
   - Read the question and choose one of the 4 options (A, B, C, D).
   - Track your answering progress via the progress bar.
   - Click **Submit Quiz →** to finish and send your answers for evaluation.
4. **Instant Score & Answer Review**:
   - View your score (e.g. `4 / 5 (80%)`) and performance badge.
   - Review each question: correct answers show in green; incorrect answers highlight your pick in red and reveal the correct answer.
   - Options to **Retake Quiz**, **View Score History**, or return to **All Quizzes**.
5. **Score History**:
   - Access via the **Score History** link in the navbar or `/history`.
   - View aggregate metrics: Total Quizzes Completed, Average Score, and Highest Score.
   - Review past attempts with date/time, score fraction, percentage badge, and one-click retake.

---

## API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |

### 2. Quizzes (`/api/quizzes`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/quizzes` | List all available quizzes with total questions count | Yes |
| `GET` | `/api/quizzes/:id` | Get quiz questions with options (correct answer omitted) | Yes |
| `POST` | `/api/quizzes/:id/submit` | Submit answers object, evaluate score, save attempt record | Yes |
| `POST` | `/api/quizzes` | Create a new quiz with questions, 4 options, & correct answer | Yes |
| `DELETE` | `/api/quizzes/:id` | Delete a quiz by ID | Yes |

### 3. Scores & History (`/api/scores`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/scores` | Get all past quiz attempts and scores for logged-in user | Yes |
| `DELETE` | `/api/scores/:id` | Delete a score record from user history | Yes |

