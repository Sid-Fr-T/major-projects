# Book Review Application (MERN Stack)

A full-stack MERN application for exploring books, submitting community reviews, and calculating average ratings with secure JWT authentication.

---

## Features

- **JWT Authentication**:
  - Secure registration and login with bcryptjs password hashing.
  - JWT token storage in `localStorage` with automatic Authorization headers via Axios interceptors.
  - Protected routes redirecting unauthenticated users to `/login`.

- **Book Catalog & Management**:
  - Add books with **Title**, **Author**, **Description**, and **Cover URL**.
  - **Smart Cover Image Resolver**: Automatically resolves and displays cover images from:
    - Direct image links (`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, `.gif`)
    - Wikipedia / Wikimedia File and article pages (e.g. `https://en.wikipedia.org/wiki/File:...` or `https://commons.wikimedia.org/wiki/File:...`)
    - Open Library book & ISBN links (`openlibrary.org/books/...`, `openlibrary.org/works/...`)
    - Google Drive share links
    - Dropbox links (`dl=0` automatically converted to direct raw images)
    - Imgur links
    - Any web page with OpenGraph / Twitter image metadata
  - Live thumbnail preview in the "Add Book" form.
  - Search and filter books by title or author in real time.
  - Delete books (permitted for the user who added them).

- **One Review Per Book**:
  - Users can submit **one review per book** with a rating from **1 to 5 stars** and an optional comment.
  - Enforced at both the database level via a compound unique index (`{ book: 1, user: 1 }`) and controller logic with friendly error messages.
  - Users can delete their own reviews if they wish to update or remove their feedback.

- **Dynamic Average Rating**:
  - Average ratings (e.g. `4.5 / 5`) and review counts are calculated dynamically.
  - Displayed on the main dashboard book cards as well as on dedicated book pages.
  - Visual star rating indicator (`★ ★ ★ ★ ☆`).

- **Dedicated Book Details Page (`/books/:id`)**:
  - Complete book information, cover image, and creator attribution.
  - Prominent average rating panel with total review counter.
  - Interactive star rating selector and review submission form.
  - Community reviews list showing reviewer name, rating stars, date, and comments.

---

## Tech Stack

- **Frontend**: React 19, Vite, React Router v7, Axios, Pure CSS (`App.css`)
- **Backend**: Node.js (ES Modules), Express.js, MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`

---

## Project Structure

```text
12-book-review/
├── README.md
├── package.json (root or server/client configs)
├── server/
│   ├── .env                    # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── src/
│       ├── config/
│       │   └── db.js           # MongoDB connection
│       ├── controllers/
│       │   ├── authController.js   # User registration & login
│       │   └── bookController.js   # Books & reviews CRUD with aggregations
│       ├── middleware/
│       │   └── auth.js         # JWT verification middleware
│       ├── models/
│       │   ├── User.js         # User model
│       │   ├── Book.js         # Book model (title, author, description, coverUrl, user)
│       │   └── Review.js       # Review model (book, user, rating [1-5], comment)
│       ├── routes/
│       │   ├── authRoutes.js   # /api/auth
│       │   └── bookRoutes.js   # /api/books and reviews
│       └── server.js           # Express app entry point
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── README.md
    └── src/
        ├── api/
        │   └── axios.js        # Axios instance with auth interceptor
        ├── components/
        │   ├── Navbar.jsx      # Navigation bar
        │   └── ProtectedRoute.jsx
        ├── context/
        │   ├── AuthContext.jsx # Auth state management
        │   ├── authContextInstance.js
        │   └── useAuth.js
        ├── pages/
        │   ├── Dashboard.jsx   # Books catalog & add book form
        │   ├── BookDetails.jsx # Book page with average rating & reviews
        │   ├── Login.jsx       # Login form
        │   └── Register.jsx    # Registration form
        ├── App.css             # Responsive styling
        ├── App.jsx             # Routes
        └── main.jsx
```

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |

### Books & Reviews (`/api/books`)
> Requires `Authorization: Bearer <token>` header

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Retrieve all books with average ratings & review counts | Yes |
| `POST` | `/api/books` | Add a book (`title`, `author`, `description`, `coverUrl`) | Yes |
| `GET` | `/api/books/:id` | Get book details, calculated average rating, and reviews | Yes |
| `DELETE` | `/api/books/:id` | Delete a book (creator only) and its reviews | Yes |
| `POST` | `/api/books/:id/reviews` | Post a review (`rating`: 1-5, `comment`) (1 per user per book) | Yes |
| `DELETE` | `/api/books/:id/reviews/:reviewId` | Delete user's own review | Yes |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

---

## Run Steps

### 1. Backend Setup
1. Open a terminal and navigate to `server/`:
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
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/book_review?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the backend server:
   - **Development mode** (auto-reload):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   Server will run at `http://localhost:5000`.

---

### 2. Frontend Setup
1. Open another terminal and navigate to `client/`:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173` (or the URL printed by Vite).

---

### 3. Usage Guide
1. **Register**: Create an account via `/register`.
2. **Explore Catalog**: On the dashboard, view existing books, check average ratings, and use the search bar.
3. **Add a Book**: Fill in the title, author, optional cover image URL, and description, then click **Add Book**.
4. **View Book Details & Reviews**: Click **View & Review** on any book card to open its dedicated page.
5. **Post a Review**: Select a 1-5 star rating and enter your review comment. Notice that once submitted, you cannot post a second review for the same book, and the average rating updates immediately!

