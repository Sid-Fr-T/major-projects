# ShopSphere - MERN E-Commerce Store

A clean, full-stack E-Commerce store built with MongoDB, Express.js, React 19, and Node.js (MERN) with JWT authentication.

---

## Features

### 1. Product Catalog & Model
- **Product Schema**: Contains `name`, `price`, `imageUrl`, `description`, and `stock` with Mongoose validation and timestamps.
- **Pre-Seeded with 8 Products**: Automatically seeded with 8 realistic products (electronics, audio, gadgets, accessories) on startup or via `npm run seed`.
- **Add New Product Form**: Dynamic form fields on the dashboard to easily add new items with image previews and stock tracking.
- **Product Search**: Real-time search filter across product names and descriptions.

### 2. Shopping Cart
- **Add to Cart**: Add any in-stock product with automatic stock threshold enforcement.
- **Change Quantity**: Increment and decrement buttons (`+` and `−`) that respect inventory stock limits.
- **Remove Items**: Easily remove individual items or clear the entire cart.
- **Navbar Cart Badge**: Live item count indicator displayed in the navigation bar.
- **Persistence**: Cart contents persist in `localStorage`.

### 3. Order Checkout & Dummy "Pay Now"
- **Checkout Process**: Convert cart items into an official `Order` record with `items`, `total`, and `status: 'pending'`.
- **Automatic Stock Adjustment**: Product stock is decremented upon order creation.
- **Dummy "Pay Now" Button**: Click the dummy "Pay Now" button on checkout or in "My Orders" to immediately simulate payment and mark the order as `paid`.

### 4. "My Orders" Page
- **Order History**: Scoped to the logged-in user, displaying all placed orders sorted by date.
- **Order Details**: Visual thumbnail images, item breakdowns, quantities, individual item subtotals, and total price.
- **Status Badges**: Color-coded badges for `Pending` and `Paid`.
- **In-Place Payment**: Unpaid orders feature a one-click "Pay Now" button that instantly updates status to `Paid`.

### 5. Authentication (JWT)
- **Token-based Authentication**: Secure user registration and login using bcryptjs password hashing and JSON Web Tokens.
- **Protected Routes**: Protected frontend routes (`/`, `/cart`, `/orders`) and protected API endpoints.

---

## Directory Structure

```text
09-ecommerce-store/
├── README.md               # Main project documentation
├── server/
│   ├── .env                # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json        # Server dependencies and scripts
│   ├── README.md           # Backend documentation
│   └── src/
│       ├── config/db.js    # MongoDB database connection
│       ├── controllers/
│       │   ├── authController.js     # User registration and login
│       │   ├── productController.js  # Product listing, CRUD, and auto-seeding
│       │   └── orderController.js    # Order checkout, history, and dummy pay
│       ├── data/
│       │   └── seedProducts.js       # 8 initial e-commerce products
│       ├── middleware/
│       │   └── auth.js               # JWT verification middleware
│       ├── models/
│       │   ├── Order.js              # Order model (items, total, status)
│       │   ├── Product.js            # Product model (name, price, image, stock)
│       │   └── User.js               # User model
│       ├── routes/
│       │   ├── authRoutes.js         # /api/auth routes
│       │   ├── productRoutes.js      # /api/products routes
│       │   └── orderRoutes.js        # /api/orders routes
│       ├── seed.js                   # Standalone seeding script
│       └── server.js                 # Express server entry point
└── client/
    ├── package.json        # Frontend dependencies (React, Vite, Axios)
    ├── index.html          # HTML entry point with store branding
    └── src/
        ├── api/axios.js    # Axios client with JWT interceptor
        ├── components/
        │   ├── Navbar.jsx            # Store navbar with cart badge
        │   └── ProtectedRoute.jsx    # Route guard for authenticated users
        ├── context/
        │   ├── AuthContext.jsx       # Authentication state and tokens
        │   └── CartContext.jsx       # Shopping cart state and methods
        ├── pages/
        │   ├── Dashboard.jsx         # Product catalog and Add Product form
        │   ├── Cart.jsx              # Cart page and checkout with Pay Now
        │   ├── Orders.jsx            # My Orders page with Pay Now button
        │   ├── Login.jsx             # User login
        │   └── Register.jsx          # User registration
        ├── App.jsx                   # Route configuration
        ├── App.css                   # Responsive, modern styling
        └── main.jsx                  # React entry point
```

---

## Getting Started & Run Steps

### 1. Prerequisites
- **Node.js** (v18 or newer recommended)
- **MongoDB** (Local instance or MongoDB Atlas URI)

---

### 2. Backend Setup (`server/`)

1. Open a terminal and navigate to the `server` folder:
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
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce_store?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. (Optional) Run the product seeder manually:
   ```bash
   npm run seed
   ```
   *(Note: The server also auto-seeds the 8 initial products if the database product collection is empty.)*

5. Start the backend server:
   - **Development mode (with file watching)**:
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   The backend will be running at `http://localhost:5000`.

---

### 3. Frontend Setup (`client/`)

1. Open a new terminal and navigate to the `client` folder:
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

4. Open your browser and navigate to the local URL displayed in the terminal (usually `http://localhost:5173`).

---

## API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |

### Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all products (supports `?search=query`) | No |
| `GET` | `/api/products/:id` | Get single product by ID | No |
| `POST` | `/api/products` | Create a new product (name, price, imageUrl, description, stock) | Yes |
| `PUT` | `/api/products/:id` | Update product details | Yes |
| `DELETE` | `/api/products/:id` | Delete a product | Yes |

### Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | Get all orders belonging to the logged-in user | Yes |
| `GET` | `/api/orders/:id` | Get details of a specific order | Yes |
| `POST` | `/api/orders` | Create order from cart (items, total, status: 'pending') | Yes |
| `PUT` | `/api/orders/:id/pay` | Dummy Pay Now: marks order status as 'paid' | Yes |

