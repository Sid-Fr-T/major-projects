# Recipe Book Backend

A modular Express backend with ES modules, MongoDB (Mongoose), JWT authentication, public recipe title search, recipe CRUD operations, and user favorites tracking.

## Features

- **ES Modules (`import`/`export`)**: Modern JavaScript syntax throughout.
- **Authentication**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **Recipe Model**: Includes `title`, `ingredients` (array of strings), `steps`, `category`, `imageUrl`, author (`user`), and `savedBy` (array of user IDs).
- **Public Title Search**: Anyone can search recipes by title (case-insensitive regex search) and filter by category.
- **Protected Recipe Creation & Management**: Logged-in users can create recipes, while only original authors can edit or delete their recipes.
- **Save / Unsave Favorites**: Authenticated users can bookmark recipes and fetch their collection via `/api/recipes/saved`.
- **Database Seeder**: Pre-loaded with demo recipes and an author account.

---

## Directory Structure

```text
server/
├── .env                  # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── .env.example          # Example environment variable template
├── .gitignore            # Git ignore rule for node_modules and .env
├── package.json          # Node dependencies and scripts
├── README.md             # Backend documentation
└── src/
    ├── config/
    │   └── db.js         # MongoDB connection setup
    ├── controllers/
    │   ├── authController.js    # Registration and login logic
    │   └── recipeController.js  # Recipe CRUD, search, and favorites logic
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Recipe.js     # Recipe schema & model
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js   # Routes for /api/auth
    │   └── recipeRoutes.js # Routes for /api/recipes
    ├── seed.js           # Sample database seeder
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

3. **(Optional) Seed sample data**:
   ```bash
   npm run seed
   ```

4. **Run the server**:
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
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |

---

### 2. Recipe Routes (`/api/recipes`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/recipes` | Search & browse all recipes (`?search=...`, `?category=...`) | No (Public) |
| `GET` | `/api/recipes/saved` | Get recipes saved/favorited by logged-in user | Yes |
| `GET` | `/api/recipes/:id` | Get details of a single recipe | No (Public) |
| `POST` | `/api/recipes` | Create a new recipe | Yes |
| `PUT` | `/api/recipes/:id` | Update an existing recipe (creator only) | Yes |
| `DELETE` | `/api/recipes/:id` | Delete a recipe (creator only) | Yes |
| `POST` | `/api/recipes/:id/favorite` | Toggle save/unsave recipe as favorite | Yes |
