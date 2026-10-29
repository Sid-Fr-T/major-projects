# 🎟️ EventHub - Event Booking MERN Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for discovering, hosting, and booking events. Built with JWT authentication, real-time seat tracking, and responsive minimalist styling.

---

## 🌟 Key Features

- **Public Event Browsing**: Anyone (guests and logged-in users) can view upcoming events with detailed schedules, locations, descriptions, and real-time available seats.
- **JWT Authentication**: Secure user registration and login using `bcryptjs` for password hashing and JSON Web Tokens stored in `localStorage`.
- **Instant Seat Reservation**: Authenticated users can register for an event with a single click; available seats decrement automatically.
- **Duplicate Booking Prevention**: Backend and frontend guardrails prevent duplicate registrations by the same user for any event.
- **Booking Cancellation**: Users can cancel existing reservations at any time; seats are automatically restored to the available pool.
- **"My Bookings" Management**: A dedicated view allowing users to see all events they have booked and manage cancellations.
- **Event Creation**: Authenticated users can host and publish new events with form fields: `title`, `description`, `date & time`, `location`, and total `seats`.
- **Pre-Seeded Events**: Includes 5 realistic pre-seeded events out of the box (auto-seeded on server startup or runnable via script).
- **Responsive Minimal UI**: Clean, accessible design featuring modern cards, status badges, and mobile-friendly navigation.

---

## 🏗️ Architecture & Data Model

### Event Model (`server/src/models/Event.js`)
| Field | Type | Required | Description |
|---|---|---|---|
| `title` | String | Yes | Name/title of the event |
| `description` | String | No | Detailed description of the event |
| `date` | Date | Yes | Date and scheduled time of the event |
| `location` | String | Yes | Physical venue address or online location |
| `seats` | Number | Yes | Current remaining seats (min: 0) |
| `registeredUsers` | `[ObjectId]` | No | Array of User IDs who booked this event |
| `createdBy` | ObjectId | No | User ID of the event creator |
| `createdAt` / `updatedAt` | Date | Auto | Mongoose timestamps |

---

## 📡 API Reference

### Events (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | Retrieve all events sorted by date |
| `GET` | `/api/events/my-bookings` | Private | Retrieve events booked by logged-in user |
| `GET` | `/api/events/:id` | Public | Get single event details |
| `POST` | `/api/events` | Private | Create a new event |
| `POST` | `/api/events/:id/register` | Private | Register for event (seats - 1) |
| `POST` | `/api/events/:id/cancel` | Private | Cancel booking (seats + 1) |
| `DELETE` | `/api/events/:id` | Private | Delete an event |

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account and receive JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and receive JWT |

---

## 🚀 Getting Started & Run Steps

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection URI)

---

### Step 1: Backend Setup & Seed Database

1. Open a terminal and navigate to the `server` directory:
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
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Seed the 5 initial events (optional, also auto-seeds on first launch if empty):
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on [http://localhost:5000](http://localhost:5000).*

---

### Step 2: Frontend Setup

1. Open a second terminal and navigate to the `client` directory:
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
   *The frontend will run on [http://localhost:5173](http://localhost:5173).*

---

## 🧪 Testing the Application

1. **Guest Browsing**: Open `http://localhost:5173` without logging in. All 5 seeded events will display with date, location, and remaining seats.
2. **Registration**: Click **Register** on the top right or on any event card. Create an account.
3. **Book an Event**: Click **Register (Book Seat)** on any event. Notice the seat counter decreases by 1 and the card marks as **✓ Booked**.
4. **Duplicate Prevention**: Try booking the same event again; it shows you are already registered.
5. **My Bookings**: Click **My Bookings** in the navbar or on the dashboard tab to view your booked tickets.
6. **Cancellation**: Click **Cancel Booking**; the event is removed from "My Bookings" and the seat count increments back.
7. **Create Event**: Click **+ Host New Event** to publish your own event with custom date, venue, and seats.

