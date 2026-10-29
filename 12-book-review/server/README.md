# Express & MongoDB Backend - Book Review API

Express backend with ES modules, Mongoose, JWT authentication, and Book Review CRUD operations with calculated rating aggregations.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **Book Catalog**: Add, list, view, and delete books with cover images and authors.
- **Reviews & Ratings**: Post reviews with 1-5 ratings and comments; enforced single review per user per book.
- **Aggregation**: Computes average rating and review counts on the fly.
- **MongoDB & Mongoose**: Schemas with validation, defaults, unique compound indexes, and timestamps.
- **CORS & Environment Variables**: Configured via `cors` and `dotenv`.

---

## Directory Structure

```text
server/
├── .env                  # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── .env.example          # Example environment variable template
├── .gitignore
├── package.json          # Node dependencies and scripts
├── README.md             # Backend documentation
└── src/
    ├── config/
    │   └── db.js         # MongoDB connection setup
    ├── controllers/
    │   ├── authController.js  # Registration and login logic
    │   └── bookController.js  # Book and Review CRUD logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Book.js       # Book schema & model (title, author, description, coverUrl, user)
    │   ├── Review.js     # Review schema & model (book, user, rating, comment)
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   └── bookRoutes.js # Protected routes for /api/books
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
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Run the server**:
   - Development mode (with auto-reload):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

---

## API Endpoints

### 1. Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT | No |

### 2. Books & Reviews Routes (`/api/books`)
> All `/api/books` routes require the `Authorization` header: `Bearer <token>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Get all books with average ratings & review counts | Yes |
| `POST` | `/api/books` | Create a new book | Yes |
| `GET` | `/api/books/:id` | Get book details, average rating, and reviews | Yes |
| `DELETE` | `/api/books/:id` | Delete book (creator only) and its reviews | Yes |
| `POST` | `/api/books/:id/reviews` | Add review (1 review per user per book) | Yes |
| `DELETE` | `/api/books/:id/reviews/:reviewId` | Delete a review (owner only) | Yes |
