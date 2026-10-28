# Complaint Portal (MERN Stack)

A full-stack Complaint Management and Tracking web application built with the **MERN** stack (MongoDB, Express.js, React, Node.js) featuring JWT authentication and role-based access control.

---

## 🌟 Key Features

### 👤 Role-Based Access Control
- **Automatic First-User Admin**: The first user registered in the database automatically receives the `admin` role. All subsequent users are registered as standard `user` accounts.
- **Role Badging**: Clear visual indicators in the navbar and cards distinguishing Admins from regular Users.

### 📝 User Capabilities
- **Authentication**: Secure registration and login using bcrypt password hashing and JWT (JSON Web Tokens).
- **Raise Complaints**: Submit complaints specifying **Title**, **Category** (e.g., Technical, Billing, Facilities, Customer Service, General), and detailed **Description**.
- **Track Status**: Real-time status tracking with color-coded status badges:
  - 🟡 **Open**: Complaint submitted and awaiting review.
  - 🔵 **In Progress**: Under active investigation or resolution.
  - 🟢 **Resolved**: Issue addressed and closed.
- **Admin Remarks**: View resolution notes and remarks provided by administrators.
- **Search & Filters**: Filter complaints by status (`All`, `Open`, `In Progress`, `Resolved`), category, or search by keywords.
- **Manage Complaints**: Edit details or withdraw/delete complaints while in `open` status.

### 🛡️ Admin Capabilities
- **Global Overview**: View all complaints submitted across all users with submitter details (name and email).
- **Status & Remark Updates**: Change complaint status (`open` ➔ `in-progress` ➔ `resolved`) and attach an administrative remark explaining the resolution or progress.
- **Analytics & Metrics**: Instant metrics overview showing counts for Total, Open, In Progress, and Resolved complaints.
- **Complaint Management**: Delete spam or obsolete complaints.
- **Dual Capability**: Admins can also raise their own complaints when needed.

---

## 🏗️ Tech Stack

- **Frontend**:
  - React 19 + Vite
  - React Router DOM v7
  - Axios with JWT request interceptor
  - Clean, responsive CSS with status badges and modern card grid
- **Backend**:
  - Node.js & Express.js (ES Modules)
  - MongoDB & Mongoose ORM
  - JWT (`jsonwebtoken`) for stateless authentication
  - Password hashing with `bcryptjs`
  - CORS and `dotenv`

---

## 📋 Data Models

### 1. Complaint Model (`server/src/models/Complaint.js`)
| Field | Type | Description |
|---|---|---|
| `title` | String (Required, Trimmed) | Brief summary of the complaint |
| `description` | String (Required, Trimmed) | Detailed description of the issue |
| `category` | String (Required) | Category (Technical, Billing, Service, Facilities, etc.) |
| `status` | String (Enum) | `open`, `in-progress`, `resolved` (Default: `open`) |
| `remark` | String (Trimmed) | Administrative note or resolution remarks |
| `user` | ObjectId (Ref: `User`) | Reference to user who raised the complaint |
| `createdAt` / `updatedAt` | Date (Timestamps) | Automatic creation and update timestamps |

### 2. User Model (`server/src/models/User.js`)
| Field | Type | Description |
|---|---|---|
| `name` | String (Required) | Full name of the user |
| `email` | String (Required, Unique) | User's email address |
| `password` | String (Required) | Hashed password (`bcryptjs`) |
| `role` | String (Enum) | `'admin'` or `'user'` (Default: `'user'`; 1st user is `'admin'`) |

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user (1st user is assigned `admin` role)
- `POST /api/auth/login` - Authenticate user & receive JWT token

### Complaint Routes (`/api/complaints`) — Protected (Bearer Token)
- `GET /api/complaints` - Retrieve complaints (Admin gets all complaints; regular users get their own)
  - Supports query params: `?status=open|in-progress|resolved` and `?category=...`
- `GET /api/complaints/:id` - Retrieve a specific complaint by ID
- `POST /api/complaints` - Raise a new complaint (`title`, `category`, `description`)
- `PUT /api/complaints/:id` - Update complaint:
  - **Admin**: Update `status` and `remark`
  - **User**: Update `title`, `description`, `category`
- `DELETE /api/complaints/:id` - Delete complaint (Admin or owner)

---

## 🚀 Getting Started & Run Steps

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or MongoDB Atlas)

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Verify or create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/complaint_portal
   JWT_SECRET=your_super_secret_jwt_key
   ```
   *(A pre-configured `.env` is already present in `server/.env`)*

4. Start the backend server:
   - For development with auto-reload:
     ```bash
     npm run dev
     ```
   - For standard start:
     ```bash
     npm start
     ```
   Server will run on **http://localhost:5000**.

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the `client/` directory:
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
   Client will run on **http://localhost:5173** (or the port indicated in Vite output).

---

### Step 3: Usage Workflow

1. Navigate to **http://localhost:5173** in your browser.
2. Click **Register** and create your first account.
   > **Note**: The **first registered user** automatically becomes the **Admin**.
3. Log in with the admin account to access the Admin Dashboard.
4. Open an incognito/private browser window, register a second account (which will be a standard **User**).
5. As the standard user:
   - Fill out the **Raise a New Complaint** form.
   - Select a category, enter title and description, and click **Submit Complaint**.
   - Observe the complaint in the "My Complaints" list with status `Open`.
6. Switch back to the Admin browser window:
   - View the complaint under "All Submitted Complaints" with the submitter's name and email.
   - Select a new status (e.g., `In Progress` or `Resolved`).
   - Enter an admin remark (e.g., *"Assigned technician. Issue resolved."*).
   - Click **Update Status**.
7. In the User browser window, refresh or view the updated status and the highlighted **Admin Remark** callout!

