# Recipe Book Client (React + Vite)

A modern, responsive React frontend for the Recipe Book application built with Vite, React Router v7, and Axios.

## Features

- **Public Recipe Discovery & Title Search**: Anyone can search recipes by title in real-time and filter dishes by category (Breakfast, Lunch, Dinner, Dessert, Snack, Beverage, Other).
- **Recipe Details & Steps View**: Expandable recipe cards showing ingredients list and step-by-step preparation instructions.
- **Recipe Creation & Editing**: Form for authenticated users with fields: `title`, `category`, `imageUrl`, `ingredients` (array input), and `steps`.
- **Favorites & Bookmarking**: Toggle save/unsave on recipes with an active heart badge.
- **Dedicated Saved Recipes Page (`/saved`)**: Protected route allowing users to view and manage all their saved culinary favorites.
- **Authentication**: JWT token management, persistent session state in `localStorage`, and protected route guards.
- **Responsive Card Grid (`App.css`)**: Warm, culinary-themed UI with cards, image preview fallback, category tags, and clean styling.

---

## Getting Started

1. **Install dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Production build**:
   ```bash
   npm run build
   ```
