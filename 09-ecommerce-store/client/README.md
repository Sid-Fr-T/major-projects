# React + Vite Frontend - E-Commerce Store (ShopSphere)

A modern React frontend for the E-Commerce Store application built with Vite, React Router v7, and Axios.

## Features

- **AuthContext**: Persists user data and JWT token to `localStorage`, providing `login`, `register`, and `logout` actions.
- **CartContext**: Persistent shopping cart with actions for `addToCart`, `removeFromCart`, `updateQuantity`, and `clearCart`, plus live cart count badge.
- **Product Catalog (`Dashboard.jsx`)**: Responsive card grid with product images, pricing, stock indicators, real-time search filtering, and an expandable "Add Product" form.
- **Shopping Cart (`Cart.jsx`)**: Review cart items, modify quantities, remove items, view order totals, and checkout with dummy "Pay Now".
- **My Orders (`Orders.jsx`)**: Review past orders, view items ordered, and click "Pay Now" on pending orders to mark them as paid.
- **Navbar**: Displays brand logo, active links to Products, Cart (with badge), My Orders, user greeting, and logout button.
- **Single Stylesheet (`App.css`)**: Modern, responsive styling with clean UI components.

---

## Getting Started

1. **Start the Express backend** (in `server/` folder):
   ```bash
   cd server
   npm run dev
   ```

2. **Start the React frontend** (in `client/` folder):
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Open the browser URL shown by Vite (typically `http://localhost:5173`).
