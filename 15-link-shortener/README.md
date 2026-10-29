# Link Shortener (MERN Stack)

A clean, modern URL shortener web application built with MongoDB, Express, React, and Node.js (MERN) featuring JWT authentication, automated 6-character short code generation, click tracking, and user-scoped link management.

---

## Features

- **JWT Authentication**: Secure user registration and login with bcrypt password hashing and token persistence.
- **Link Shortening**: Generates a unique, random 6-character alphanumeric short code (`[a-zA-Z0-9]`) for any destination URL.
- **URL Normalization & Validation**: Automatically handles protocol prefixes (`https://`) and validates URL structures.
- **Public Redirection Route (`/s/:shortCode`)**: Public endpoint that redirects visitors directly to the destination URL while atomically incrementing the click counter.
- **Click Tracking & Dashboard Analytics**:
  - Displays real-time click counts for each shortened link.
  - Summary metrics displaying total links created and total clicks across all links.
  - Manual refresh option to quickly view updated click statistics.
- **One-Click Copy**: Convenient copy button with instant feedback to copy the shortened URL to your clipboard.
- **Link Management**: Scoped user access allowing users to create, list, and delete their own links.
- **Responsive Minimal UI**: Clean, responsive layout styled with modern CSS variables.

---

## Link Data Model

Defined in `server/src/models/Link.js`:

| Field | Type | Description |
| :--- | :--- | :--- |
| `originalUrl` | `String` (Required) | The target destination URL |
| `shortCode` | `String` (Required, Unique) | Random 6-character alphanumeric string |
| `clicks` | `Number` (Default: 0) | Number of times the short link has been accessed |
| `user` | `ObjectId` (Ref: `'User'`) | Reference to the owning user |
| `createdAt` / `updatedAt` | `Date` (Timestamps) | Automatic creation and update timestamps |

---

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/s/:shortCode` | Redirect to `originalUrl` and increment `clicks` |
| `GET` | `/` | API health check |

### Protected Routes (Requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/links` | Retrieve all links created by the authenticated user |
| `POST` | `/api/links` | Create a new shortened link (`{ originalUrl }`) |
| `DELETE` | `/api/links/:id` | Delete a specific link owned by the authenticated user |

---

## Project Structure

```text
15-link-shortener/
├── README.md
├── server/
│   ├── .env                    # Server environment variables
│   ├── .env.example            # Example configuration
│   ├── package.json
│   ├── README.md
│   └── src/
│       ├── config/
│       │   └── db.js           # MongoDB connection
│       ├── controllers/
│       │   ├── authController.js # Register & login logic
│       │   └── linkController.js # Link CRUD & redirect logic
│       ├── middleware/
│       │   └── auth.js         # JWT verification middleware
│       ├── models/
│       │   ├── Link.js         # Link schema (originalUrl, shortCode, clicks, user)
│       │   └── User.js         # User schema
│       ├── routes/
│       │   ├── authRoutes.js   # /api/auth routes
│       │   └── linkRoutes.js   # /api/links routes
│       └── server.js           # Server entry point & /s/:shortCode redirect
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html              # Page title: Link Shortener
    └── src/
        ├── App.jsx             # Main router & routes (/login, /register, /, /s/:shortCode)
        ├── App.css             # Component & layout styles
        ├── api/
        │   └── axios.js        # Axios instance with JWT interceptor
        ├── components/
        │   ├── Navbar.jsx      # Header with brand and auth state
        │   └── ProtectedRoute.jsx # Route guard for logged-in users
        ├── context/
        │   └── AuthContext.jsx # Authentication state provider
        └── pages/
            ├── Dashboard.jsx   # Create link form, summary stats & link cards
            ├── Login.jsx       # Login form
            ├── Register.jsx    # Registration form
            └── RedirectHandler.jsx # Client-side fallback redirect handler
```

---

## Run Steps

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)

---

### Step 1: Start the Backend Server

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/link_shortener?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

---

### Step 2: Start the Frontend Client

1. Open a second terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

### Step 3: Using the Application

1. Open `http://localhost:5173` in your browser.
2. Register a new account or log in.
3. Paste any URL into the input field (e.g. `https://github.com` or `google.com`) and click **Shorten URL**.
4. The new link card will appear with your random 6-character short link (e.g. `http://localhost:5000/s/X7k9Pq`) and initial click count `0`.
5. Click the short link or copy it and open it in a browser tab:
   - The server redirects to your original destination URL.
   - The click count increments by 1.
6. Click **Refresh Counts** or reload the dashboard to see the updated click count.
7. Click **Delete** on any link card to remove the link when no longer needed.

