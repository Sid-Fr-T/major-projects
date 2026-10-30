# Express & MongoDB Backend - E-Commerce Store

Express backend with ES modules, MongoDB / Mongoose, JWT authentication, Product Catalog, and Orders with dummy payment processing.

## Features

- **JWT Authentication**: Secure stateless authentication using bcryptjs and jsonwebtoken.
- **Product Model & Seed**: Schema with `name`, `price`, `imageUrl`, `description`, and `stock`. Seeded with 8 products.
- **Order Model & Processing**: Schema with `user`, `items` (product, name, price, quantity, imageUrl), `total`, and `status` (`pending`, `paid`, `cancelled`).
- **Dummy Pay Now**: Endpoint `PUT /api/orders/:id/pay` simulating payment and marking the order as `paid`.
- **User-Scoped Orders**: Customers can only view and manage their own orders.

---

## Directory Structure

```text
server/
├── .env                  # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── .env.example          # Example environment variable template
├── package.json          # Node dependencies and scripts
├── README.md             # Backend documentation
└── src/
    ├── config/
    │   └── db.js         # MongoDB connection setup
    ├── controllers/
    │   ├── authController.js     # User registration and login
    │   ├── productController.js  # Product catalog and auto-seeding
    │   └── orderController.js    # Order checkout, history, and dummy pay
    ├── data/
    │   └── seedProducts.js       # 8 initial e-commerce products
    ├── middleware/
    │   └── auth.js       # JWT verification middleware
    ├── models/
    │   ├── Order.js      # Order schema & model
    │   ├── Product.js    # Product schema & model
    │   └── User.js       # User schema & model
    ├── routes/
    │   ├── authRoutes.js # Routes for /api/auth
    │   ├── productRoutes.js # Routes for /api/products
    │   └── orderRoutes.js   # Routes for /api/orders
    ├── seed.js           # Database seeder script
    └── server.js         # Express app initialization and server entry point
```

---

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure `.env`**:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Seed database with 8 products**:
   ```bash
   npm run seed
   ```

4. **Run server**:
   - Dev mode: `npm run dev`
   - Start: `npm start`

---

## API Endpoints

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get JWT

### 2. Products (`/api/products`)
- `GET /api/products` - List all products (with optional `?search=`)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Protected)
- `PUT /api/products/:id` - Update product (Protected)
- `DELETE /api/products/:id` - Delete product (Protected)

### 3. Orders (`/api/orders`)
- `GET /api/orders` - Get current user's orders (Protected)
- `GET /api/orders/:id` - Get specific order by ID (Protected)
- `POST /api/orders` - Checkout / create new order (Protected)
- `PUT /api/orders/:id/pay` - Dummy Pay Now: marks order as paid (Protected)
