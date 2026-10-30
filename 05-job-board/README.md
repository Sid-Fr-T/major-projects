# Job Board (MERN Full Stack Application)

A modern, responsive full-stack Job Board web application built with the MERN stack (MongoDB, Express, React, Node.js). Features role-based registration and access control for **Recruiters** and **Applicants**, with JWT authentication, server-side role authorization middleware, and a dedicated role-tailored dashboard UI.

---

## Features

### 1. Authentication & Role Management
- **Stateless JWT Authentication**: Secure password hashing with `bcryptjs` and signed JSON Web Tokens.
- **Role Choice on Registration**: Users select their role during sign-up:
  - **Recruiter**: Can post jobs, edit/delete listings, and review applicant details.
  - **Applicant**: Can explore open positions and apply to jobs.
- **Role-Check Middleware**: Express middleware (`requireRole`) protects server endpoints against unauthorized access.
- **Persistent Sessions**: Token and user profiles stored in `localStorage` with automated Axios request header interceptors.
- **Role-Based Navbar**: Displays logged-in user name alongside an identity badge (`RECRUITER` or `APPLICANT`) and one-click logout.

### 2. Recruiter Capabilities
- **Create Job Postings**: Form supporting `title`, `company`, `location`, `salary` (optional), and `description`.
- **Edit Job Postings**: In-place editing of existing job details.
- **Delete Job Postings**: Remove job listings with confirmation dialogs and ownership verification.
- **View Applicants**: Expandable drawer for each job posting showing candidate names, email addresses (`mailto:`), and exact application timestamps.

### 3. Applicant Capabilities
- **Browse All Listings**: View all active job postings with company, location, salary, and posting date.
- **Search & Filter**: Real-time filtering by job title, company name, location, or description.
- **One-Click Application**: Applicants can apply directly to open positions.
- **Duplicate Prevention**: Strictly enforces **one application per job** on both server and client (disables button and displays `✓ Applied`).

---

## Project Structure

```text
05-job-board/
├── README.md                 # Main project documentation
├── server/                   # Express & MongoDB backend
│   ├── .env                  # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example          # Environment variable template
│   ├── package.json          # Server dependencies & scripts
│   └── src/
│       ├── config/
│       │   └── db.js         # MongoDB connection with Mongoose
│       ├── controllers/
│       │   ├── authController.js # User registration and login
│       │   └── jobController.js  # CRUD & application logic for jobs
│       ├── middleware/
│       │   ├── auth.js       # JWT bearer token verification
│       │   └── role.js       # Role-check authorization middleware
│       ├── models/
│       │   ├── Job.js        # Job schema with embedded applicants
│       │   └── User.js       # User schema with role enum
│       ├── routes/
│       │   ├── authRoutes.js # /api/auth routes
│       │   └── jobRoutes.js  # /api/jobs routes with role checks
│       └── server.js         # Express app entry point
└── client/                   # React + Vite frontend
    ├── index.html            # HTML entry point with Job Board title
    ├── package.json          # Client dependencies & scripts
    ├── vite.config.js        # Vite build configuration
    └── src/
        ├── api/
        │   └── axios.js      # Axios instance with auth interceptor
        ├── components/
        │   ├── Navbar.jsx    # Role-aware header & navigation
        │   └── ProtectedRoute.jsx # Route guard for authenticated users
        ├── context/
        │   ├── AuthContext.jsx # Auth state & actions (login, register, logout)
        │   ├── authContextInstance.js
        │   └── useAuth.js    # Custom auth hook
        ├── pages/
        │   ├── Dashboard.jsx # Role-based dashboard (Recruiter & Applicant views)
        │   ├── Login.jsx     # User login page
        │   └── Register.jsx  # Sign-up page with role selector
        ├── App.css           # Clean, responsive styles
        ├── App.jsx           # Application routing layout
        └── main.jsx          # React app bootstrap
```

---

## Getting Started & Run Steps

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/) (Atlas cloud cluster or local instance running on `localhost:27017`)

---

### Step 1: Backend Setup (`server/`)

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured (a template is provided in `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/job_board?retryWrites=true&w=majority
   JWT_SECRET=your_secret_jwt_key_here
   ```

4. Start the Express backend:
   - **Development mode** (auto-reload with `--watch`):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   The backend API runs at `http://localhost:5000`.

---

### Step 2: Frontend Setup (`client/`)

1. Open a second terminal and navigate to the `client` directory:
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

4. Open the displayed URL in your browser (typically `http://localhost:5173`).

---

## API Endpoints Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register user (`name`, `email`, `password`, `role`) | Public |
| `POST` | `/api/auth/login` | Authenticate with credentials and receive JWT | Public |

### Job Postings & Applications (`/api/jobs`)
> All job routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Retrieve all open job listings | Any authenticated user |
| `GET` | `/api/jobs/my` | Retrieve recruiter's own jobs with full applicant lists | Recruiter |
| `GET` | `/api/jobs/:id` | Retrieve single job by ID | Any authenticated user |
| `POST` | `/api/jobs` | Create a new job posting (`title`, `company`, `location`, `salary`, `description`) | Recruiter |
| `PUT` | `/api/jobs/:id` | Update an existing job posting (owner only) | Recruiter |
| `DELETE` | `/api/jobs/:id` | Delete a job posting (owner only) | Recruiter |
| `POST` | `/api/jobs/:id/apply` | Submit an application for a job (applies once per job) | Applicant |

---

## Usage Workflow

1. **Register as a Recruiter**:
   - Go to `/register`, select **Recruiter**, enter your credentials, and submit.
   - On the Dashboard, fill out the **Post a New Job** form (title, company, location, salary, description) and click **Publish Job Posting**.
   - Your job appears in your postings list with controls to **Edit**, **Delete**, and toggle **Applicants (0)**.

2. **Register as an Applicant**:
   - Open an incognito browser window or log out, go to `/register`, select **Applicant**, and sign up.
   - On the Dashboard, view all active listings, search by keyword, and click **Apply Now**.
   - The button instantly transitions to **✓ Applied**, and duplicate applications are disabled.

3. **Verify Applicant List as Recruiter**:
   - Switch back to the recruiter account.
   - Expand the **Applicants (1)** drawer on that job to view the applicant's name, email, and timestamp.

