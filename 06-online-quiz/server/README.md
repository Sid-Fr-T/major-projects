# Quiz System - Express & MongoDB Backend

Express backend with MongoDB, JWT authentication, Quiz management, and Score tracking.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript module syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **Quiz Management**:
  - Pre-seeded with 2 sample quizzes (5 questions each: text, 4 options, correct answer).
  - Anti-cheat question delivery: `correctAnswer` is stripped on quiz fetch and validated server-side.
  - Custom quiz creation with full question, option, and answer validation.
- **Scoring & Evaluation**:
  - Dynamic score computation (`POST /api/quizzes/:id/submit`).
  - Score history saved automatically to MongoDB (`Score` collection).
  - User-scoped score history (`GET /api/scores`).
- **Database Auto-Seeding**: Automatically seeds sample quizzes if the database is empty.

---

## Directory Structure

```text
server/
├── .env                  # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── package.json          # Node dependencies and scripts
├── README.md             # Backend documentation
└── src/
    ├── config/
    │   ├── db.js         # MongoDB connection setup
    │   └── seedData.js   # 2 sample quizzes and auto-seed logic
    ├── controllers/
    │   ├── authController.js  # Registration and login logic
    │   ├── quizController.js  # Quiz CRUD and answer scoring
    │   └── scoreController.js # User score history logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Quiz.js       # Quiz model with questions & 4 options
    │   ├── Score.js      # User quiz attempt & score record model
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   ├── quizRoutes.js # Routes for /api/quizzes
    │   └── scoreRoutes.js# Routes for /api/scores
    ├── seed.js           # Manual seed script
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
   Ensure `server/.env` is configured:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/online_quiz?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Seed Quizzes (Optional)**:
   ```bash
   npm run seed
   ```

4. **Run the server**:
   - Development mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

---

## API Endpoints

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT | No |

### 2. Quizzes (`/api/quizzes`)
> All quiz routes require `Authorization: Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/quizzes` | Get list of all available quizzes | Yes |
| `GET` | `/api/quizzes/:id` | Get quiz questions & options (answers omitted) | Yes |
| `POST` | `/api/quizzes/:id/submit` | Submit answers & receive score breakdown | Yes |
| `POST` | `/api/quizzes` | Create a new quiz | Yes |
| `DELETE` | `/api/quizzes/:id` | Delete a quiz | Yes |

### 3. Scores (`/api/scores`)
> All score routes require `Authorization: Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/scores` | Get all past scores for authenticated user | Yes |
| `DELETE` | `/api/scores/:id` | Delete a score history record | Yes |
