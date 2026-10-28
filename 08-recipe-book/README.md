# 🍳 Recipe Book - MERN Stack Application

A full-stack **MERN (MongoDB, Express, React, Node.js)** Recipe Book web application. Explore delicious recipes, search dishes by title, create your own culinary recipes, and save your favorite meals into a personalized cookbook.

---

## ✨ Features

- **Public Recipe Discovery & Title Search**: Anyone (guest or logged-in) can browse all recipes and search recipes by title in real-time or filter by category (Breakfast, Lunch, Dinner, Dessert, Snack, Beverage, Other).
- **Recipe Model**:
  - `title`: Recipe name (string, required)
  - `ingredients`: List of ingredients (array of strings, required)
  - `steps`: Step-by-step preparation instructions (string, required)
  - `category`: Recipe category (e.g., Breakfast, Lunch, Dinner, Dessert, Snack, Beverage, Other)
  - `imageUrl`: Image link with automatic fallback placeholder
  - `user`: Associated author / creator (ObjectId reference to User)
  - `savedBy`: Tracked user IDs who saved this recipe as a favorite
- **User Authentication (JWT)**:
  - Secure stateless authentication with JSON Web Tokens (JWT) and `bcryptjs` password hashing.
  - Persistent login state stored securely in `localStorage`.
- **Recipe Management (CRUD)**:
  - **Create**: Logged-in users can publish new recipes with formatted ingredients and cooking steps.
  - **Read**: Public view with expandable ingredient lists and preparation instructions.
  - **Update**: Recipe authors can edit their recipe's title, category, image URL, ingredients, and steps.
  - **Delete**: Recipe authors can remove their own recipes.
- **Favorites & Saved Recipes**:
  - 1-click toggle to save or unsave recipes to/from favorites.
  - Dedicated **"Saved Recipes" (`/saved`)** page accessible to authenticated users with direct unsave capability.
- **Clean & Responsive UI**:
  - Warm culinary design with cards, category badges, responsive grid layout, and accessible navigation.

---

## 🛠️ Tech Stack

- **Frontend**:
  - [React 19](https://react.dev/)
  - [Vite](https://vitejs.dev/)
  - [React Router v7](https://reactrouter.com/)
  - [Axios](https://axios-http.com/)
  - Custom CSS Grid & Flexbox (`App.css`)
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) (ES Modules)
  - [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
  - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (JWT)
  - [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
  - [cors](https://github.com/expressjs/cors) & [dotenv](https://github.com/motdotla/dotenv)

---

## 📁 Project Directory Structure

```text
08-recipe-book/
├── README.md               # Main project documentation and run steps
├── .gitignore
├── client/                 # React + Vite frontend
│   ├── index.html          # HTML template (Title: Recipe Book)
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/
│       │   └── axios.js    # Axios instance with JWT Authorization interceptor
│       ├── components/
│       │   ├── Navbar.jsx  # Top navigation with brand and user links
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── authContextInstance.js
│       │   └── useAuth.js
│       ├── pages/
│       │   ├── Dashboard.jsx     # Recipe feed, search by title, category filter & create form
│       │   ├── SavedRecipes.jsx  # Dedicated Saved Recipes page
│       │   ├── Login.jsx         # User login form
│       │   └── Register.jsx      # User registration form
│       ├── App.css         # Styling for cards, forms, grid, and navigation
│       ├── App.jsx         # Routes definition
│       └── main.jsx
└── server/                 # Express + Node.js backend
    ├── package.json
    ├── .env                # Server configuration (PORT, MONGO_URI, JWT_SECRET)
    ├── .env.example
    └── src/
        ├── config/
        │   └── db.js       # MongoDB Mongoose connection
        ├── controllers/
        │   ├── authController.js    # Authentication handlers (Register/Login)
        │   └── recipeController.js  # Recipe CRUD, search, and favorites handlers
        ├── middleware/
        │   └── auth.js     # JWT Bearer token authentication middleware
        ├── models/
        │   ├── Recipe.js   # Recipe schema & model
        │   └── User.js     # User schema & model
        ├── routes/
        │   ├── authRoutes.js        # /api/auth routes
        │   └── recipeRoutes.js      # /api/recipes routes
        ├── seed.js         # Optional database seeder with sample recipes
        └── server.js       # Express server entry point
```

---

## 🚀 Run Steps

### 1. Prerequisites
- **Node.js** (v18.x or later)
- **npm** (v9.x or later)
- **MongoDB** (A local MongoDB instance or MongoDB Atlas connection URI)

---

### 2. Backend Setup (`server/`)

1. Open a terminal and navigate to the `server` directory:
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
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   *(A sample `.env` is already configured in `server/.env`)*

4. *(Optional)* Seed initial sample recipes and a demo chef account:
   ```bash
   npm run seed
   ```
   *Demo login:*
   - **Email:** `chef@recipebook.com`
   - **Password:** `password123`

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend API will run at **`http://localhost:5000`**.

---

### 3. Frontend Setup (`client/`)

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

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |

### Recipes (`/api/recipes`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/recipes` | Search & browse all recipes (`?search=...`, `?category=...`) | No (Public) |
| `GET` | `/api/recipes/saved` | Fetch recipes saved by the authenticated user | Yes |
| `GET` | `/api/recipes/:id` | Get details of a single recipe | No (Public) |
| `POST` | `/api/recipes` | Create a new recipe | Yes |
| `PUT` | `/api/recipes/:id` | Update recipe (creator only) | Yes |
| `DELETE` | `/api/recipes/:id` | Delete recipe (creator only) | Yes |
| `POST` | `/api/recipes/:id/favorite` | Toggle save / unsave recipe as favorite | Yes |

---

## 🍳 Using the Application

1. **Search Recipes (No login required)**:
   - Type in the search box on the home page (e.g., "Pancake", "Pizza", "Pasta") to instantly filter recipes by title.
   - Click category filter buttons ("Breakfast", "Lunch", "Dinner", etc.) to filter by food category.
   - Click **"View Full Recipe"** on any card to read the full ingredients list and instructions.
2. **Publish a Recipe**:
   - Log in or register an account.
   - Click **"+ Add Recipe"** on the home page.
   - Enter title, select category, provide image URL, ingredients (one per line or comma-separated), and preparation steps.
   - Click **"Publish Recipe"**.
3. **Save to Favorites**:
   - Click the **"🤍 Save"** button on any recipe card to save it to your favorites. The heart turns red: **"❤️ Saved"**.
   - Navigate to **"❤️ Saved Recipes"** in the top navigation bar to view your bookmarked collection.
   - Click **"❤️ Saved"** or **"Remove"** anytime to unsave.

