# MERN Blog Application

A clean, responsive full-stack MERN (MongoDB, Express, React, Node.js) blog platform featuring JWT authentication, public article browsing, dedicated single post reading, and author-scoped post management.

---

## Features

- **Public Home Page (`/`)**:
  - Anyone can browse and read all published blog articles.
  - Displays article titles, author names, publication dates, and content snippets.
  - Direct links to open the full single post page.

- **Single Post Reading Page (`/post/:id`)**:
  - Public view displaying the full article content, author attribution, and publication timestamp.
  - Preserves paragraph formatting and line breaks.
  - Automatically displays author management controls ("Edit in Dashboard" and "Delete Post") if the viewing user is the post's author.

- **JWT Authentication**:
  - Secure user registration and login with encrypted passwords (`bcryptjs`).
  - Stateless JSON Web Token authentication with token storage in `localStorage`.
  - Unauthenticated users attempting to access protected routes are redirected to `/login`.

- **Protected Author Dashboard (`/dashboard`)**:
  - Accessible only to logged-in users.
  - **Create Post**: Publish new posts with title and content.
  - **Manage My Posts**: Filtered list showing only the authenticated user's posts.
  - **Edit Post**: In-place editing of post title and content.
  - **Delete Post**: Safely delete posts with confirmation dialog.

- **Author-Scoped Authorization**:
  - Strict server-side verification ensures users can only update or delete posts that they authored (`403 Forbidden` if unauthorized).

- **Modern & Responsive UI**:
  - Responsive layout for mobile, tablet, and desktop.
  - Clean typography, card layouts, and sticky navigation bar.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Axios, Vanilla CSS |
| **Backend** | Node.js (ES Modules), Express.js, Mongoose ODM |
| **Database** | MongoDB (Atlas or Local) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |

---

## Project Structure

```text
02-blog-website/
├── README.md               # Root project documentation and run steps
├── client/                 # React + Vite frontend
│   ├── index.html          # HTML entry point (title: MERN Blog)
│   ├── package.json        # Frontend dependencies & scripts
│   ├── vite.config.js      # Vite configuration
│   └── src/
│       ├── api/
│       │   └── axios.js    # Axios client with JWT Authorization interceptor
│       ├── components/
│       │   ├── Navbar.jsx  # Top navigation bar (branding, links, user status)
│       │   └── ProtectedRoute.jsx # Route guard for authenticated views
│       ├── context/
│       │   ├── AuthContext.jsx # Auth provider state (login, register, logout)
│       │   └── useAuth.js  # Custom hook to consume AuthContext
│       ├── pages/
│       │   ├── Home.jsx       # Public feed showing all blog posts
│       │   ├── PostDetail.jsx # Public single post view
│       │   ├── Dashboard.jsx  # Author dashboard (create, edit, delete own posts)
│       │   ├── Login.jsx      # User login form
│       │   └── Register.jsx   # User registration form
│       ├── App.jsx         # App routing structure
│       ├── App.css         # Styling for cards, hero, forms, and articles
│       ├── index.css       # Global resets
│       └── main.jsx        # React root with BrowserRouter and AuthProvider
└── server/                 # Express backend
    ├── .env                # Environment variables (PORT, MONGO_URI, JWT_SECRET)
    ├── .env.example        # Environment variable template
    ├── package.json        # Backend dependencies & scripts
    └── src/
        ├── config/
        │   └── db.js       # MongoDB connection setup via Mongoose
        ├── controllers/
        │   ├── authController.js # Register and login handlers
        │   └── postController.js # CRUD handlers with author scoping
        ├── middleware/
        │   └── auth.js     # JWT Bearer token authentication middleware
        ├── models/
        │   ├── Post.js     # Post schema: title, content, author, createdAt
        │   └── User.js     # User schema: name, email, password, role
        ├── routes/
        │   ├── authRoutes.js # /api/auth routes
        │   └── postRoutes.js # /api/posts routes
        └── server.js       # Express server entry point
```

---

## Post Data Model

```javascript
{
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date }, // Managed via timestamps
  updatedAt: { type: Date }  // Managed via timestamps
}
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Log in and receive JWT token | Public |

### Blog Posts (`/api/posts`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Get all blog posts (sorted newest first) | Public |
| `GET` | `/api/posts/:id` | Get single post by ID with author details | Public |
| `GET` | `/api/posts/mine` | Get all posts created by logged-in user | Private (Bearer Token) |
| `POST` | `/api/posts` | Create a new blog post (`title`, `content`) | Private (Bearer Token) |
| `PUT` | `/api/posts/:id` | Update author's own post by ID | Private (Bearer Token) |
| `DELETE` | `/api/posts/:id` | Delete author's own post by ID | Private (Bearer Token) |

---

## Run Steps (Getting Started)

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas connection string)

---

### 2. Backend Setup (`server/`)

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured with your credentials (or copy from `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   - **Development mode** (with auto-reload):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   Backend will be running on `http://localhost:5000`.

---

### 3. Frontend Setup (`client/`)

1. Open a second terminal and navigate to the `client/` directory:
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

4. Open your browser and navigate to the URL shown by Vite:
   ```
   http://localhost:5173
   ```

---

## Verification & Walkthrough

1. **Browse Articles (Public)**:
   - Visit `http://localhost:5173`. You will see the public home page feed.
2. **Read Single Post (Public)**:
   - Click "Read Article →" on any post or go to `http://localhost:5173/post/<id>` to view the full post.
3. **Register / Login**:
   - Click "Register" to create an author account.
   - Upon registration/login, you will be redirected to the **My Posts** Dashboard (`/dashboard`).
4. **Create a Post**:
   - In the Dashboard, enter a **Post Title** and **Post Content**, then click **Publish Post**.
   - Your new post will immediately appear under "My Posts" and on the public Home feed.
5. **Edit / Delete**:
   - In the Dashboard (or from the single post view), click **Edit** to modify your title/content or **Delete** to remove your post.
   - Attempting to update or delete someone else's post via API will return `403 Forbidden`.

