# Portfolio CMS (MERN Stack)

A lightweight, modern **Portfolio Content Management System (CMS)** built using the **MERN** stack (MongoDB, Express, React, Node.js) with JWT authentication and role-based access control.

The application allows the public to view a developer's portfolio (about bio, skills, and project showcase), while restricting content management (about text, skills, and projects CRUD) strictly to users registered with the **Admin** role.

---

## 🌟 Feature List

### 1. Role-Based Authentication (JWT)
- **Registration with Role Choice**: Choose between **Admin** or standard **User** directly on the registration form.
- **Role Enforcement**:
  - **Admin**: Full access to the Admin CMS dashboard (`/admin`) to create, update, and delete portfolio data and projects.
  - **User**: Read-only access to view the public portfolio showcase (`/`). Attempting to access the admin panel displays an access restriction notice.
- **Secure Password Hashing**: Passwords encrypted using `bcryptjs` with salt rounds.
- **Stateless Session Management**: Signed JWT tokens stored in `localStorage` and sent via `Authorization: Bearer <token>` request headers.

### 2. Public Portfolio Home Page (`/`)
- **No Login Required**: Anyone visiting the site can browse the portfolio.
- **Hero & Bio Section**: Displays developer name, professional headline, and an engaging "About Me" description.
- **Skills & Technologies**: Displays technical skills as stylish pill badges.
- **Project Showcase Grid**:
  - Project preview cards rendered with **Image URLs** (with fallback for broken or missing links).
  - Project title and description.
  - External link button ("View Project &rarr;").
- **Admin Quick Bar**: Shows a banner with a direct link to the Admin Panel when logged in as an administrator.

### 3. Admin CMS Panel (`/admin` or `/dashboard`)
- **Restricted Access**: Protected both on the frontend (React Router `ProtectedRoute` checking `role === 'admin'`) and backend (`adminOnly` middleware returning `403 Forbidden` for non-admins).
- **Edit About Text & Skills**:
  - Live form to update display name, professional headline, bio about text, and comma-separated skills list.
- **Manage Projects (Full CRUD)**:
  - **Create**: Add new projects with `title`, `description`, `link`, and `imageUrl` (no file uploads needed, accepts any direct image URL).
  - **Live Image Preview**: Visual thumbnail preview as soon as an image URL is entered.
  - **Read**: Grid of existing projects with quick details.
  - **Update**: In-place edit mode to update project titles, descriptions, links, and image URLs.
  - **Delete**: One-click deletion with browser confirmation dialog.

### 4. Clean, Minimal & Responsive UI
- Minimalist CSS design system using CSS variables, flexbox, and responsive CSS Grid.
- Fully responsive on mobile, tablet, and desktop screens.
- Clean navbar with dynamic links, role badges (`Admin` / `User`), and quick logout.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js (ES Modules), MongoDB & Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Frontend**: React 19, Vite, React Router v7, Axios
- **Styling**: Modern, lightweight custom CSS (`App.css`)

---

## 📁 Project Structure

```text
10-portfolio-cms/
├── README.md                      # Complete project documentation
├── .gitignore
├── server/
│   ├── .env                       # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example
│   ├── package.json
│   ├── README.md                  # Backend specific documentation
│   └── src/
│       ├── server.js              # Express app entry point
│       ├── config/
│       │   └── db.js              # MongoDB Mongoose connection
│       ├── controllers/
│       │   ├── authController.js  # Registration & Login logic
│       │   ├── portfolioController.js # Portfolio profile (about & skills) logic
│       │   └── projectController.js   # Projects CRUD logic
│       ├── middleware/
│       │   └── auth.js            # JWT verification & adminOnly middleware
│       ├── models/
│       │   ├── Portfolio.js       # Portfolio profile schema (about, skills)
│       │   ├── Project.js         # Project schema (title, desc, link, imageUrl)
│       │   └── User.js            # User schema with roles ('user', 'admin')
│       └── routes/
│           ├── authRoutes.js      # /api/auth (register, login)
│           ├── portfolioRoutes.js # /api/portfolio (GET public, PUT admin)
│           └── projectRoutes.js   # /api/projects (GET public, POST/PUT/DELETE admin)
└── client/
    ├── index.html                 # App HTML entry ("Portfolio CMS")
    ├── package.json
    ├── vite.config.js
    ├── README.md                  # Frontend specific documentation
    └── src/
        ├── main.jsx               # React DOM root
        ├── App.jsx                # Application routes layout
        ├── App.css                # Clean stylesheet
        ├── api/
        │   └── axios.js           # Axios instance with auth interceptor
        ├── components/
        │   ├── Navbar.jsx         # Navigation bar with role badge
        │   └── ProtectedRoute.jsx # Role-aware route guard
        ├── context/
        │   ├── AuthContext.jsx    # Auth state provider
        │   ├── authContextInstance.js
        │   └── useAuth.js         # Custom hook for auth context
        └── pages/
            ├── Home.jsx           # Public portfolio showcase
            ├── Dashboard.jsx      # Admin CMS panel (About, Skills, Projects)
            ├── Login.jsx          # Login page with role-aware redirection
            └── Register.jsx       # Registration page with role choice
```

---

## 🚀 Run Steps

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection URI)

---

### 1. Backend Setup

1. Open a terminal in the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio_cms?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   ```

4. Start the backend server:
   - **Development mode** (auto-reload with Node watch):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   *The server will start on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a second terminal in the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL displayed in the terminal:
   ```text
   http://localhost:5173
   ```

---

## 🧪 Testing the Application (Walkthrough)

1. **Visit Public Portfolio**:
   - Go to `http://localhost:5173/`.
   - You will see the public portfolio containing about information, skills pills, and featured projects.

2. **Register an Admin User**:
   - Click **Register** in the top navbar.
   - Enter your name, email, password, and select **Admin (CMS & Portfolio Editor)** from the Role Choice dropdown.
   - Click **Register**. You will be redirected straight to the **Admin CMS Panel** (`/admin`).

3. **Edit About Text & Skills**:
   - In the Admin Panel, edit the **Display Name**, **Headline**, **About Text**, and **Skills & Technologies** (separated by commas).
   - Click **Save Portfolio Profile**.
   - Navigate to the **Portfolio** tab in the navbar to verify your changes are reflected live on the public page.

4. **Add a Project with Image URL**:
   - In the Admin Panel, fill out the **Add New Project** form:
     - **Title**: `My Full Stack App`
     - **Link**: `https://github.com`
     - **Image URL**: `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80`
     - **Description**: `A high-performance full-stack web application.`
   - Notice the instant image preview.
   - Click **Add Project**.

5. **Edit & Delete Projects**:
   - Under **Manage Projects**, click **Edit** on any project to modify its fields inline and click **Save**.
   - Click **Delete** to remove a project.

6. **Test Role Restrictions**:
   - Log out by clicking **Logout**.
   - Click **Register** and create a new account selecting **User (Public Portfolio Viewer)**.
   - Upon logging in as standard User, navigate to `http://localhost:5173/admin`.
   - The route guard will display **Access Restricted** informing you that only Admins can edit the CMS.

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (`name`, `email`, `password`, `role`) | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |

### Portfolio Profile (`/api/portfolio`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/portfolio` | Retrieve complete portfolio (about, skills, projects) | Public |
| `PUT` | `/api/portfolio` | Update about text, skills, title, and display name | Private (**Admin only**) |

### Projects (`/api/projects`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Get all projects | Public |
| `GET` | `/api/projects/:id` | Get single project by ID | Public |
| `POST` | `/api/projects` | Create a new project (`title`, `description`, `link`, `imageUrl`) | Private (**Admin only**) |
| `PUT` | `/api/projects/:id` | Update project by ID | Private (**Admin only**) |
| `DELETE` | `/api/projects/:id` | Delete project by ID | Private (**Admin only**) |

