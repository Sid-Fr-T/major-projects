# EventHub - Server API

Express backend with MongoDB, JWT authentication, and Event Booking management.

## Features
- **Event Model**: title, description, date, location, seats, registeredUsers, createdBy.
- **Seeded Data**: 5 pre-configured events ready for testing.
- **Public & Protected Endpoints**: Anyone can view events; registration and creation require JWT authentication.
- **Atomic Registration & Cancellation**: Seats dynamically decrement on booking and increment upon cancellation, blocking duplicates.

## API Endpoints
- `GET /api/events` - View all events (Public)
- `GET /api/events/my-bookings` - View authenticated user's registered events (Private)
- `GET /api/events/:id` - View single event details (Public)
- `POST /api/events` - Create a new event (Private)
- `POST /api/events/:id/register` - Book a seat for an event (Private)
- `POST /api/events/:id/cancel` - Cancel existing booking (Private)
- `DELETE /api/events/:id` - Delete event (Private)
- `POST /api/auth/register` - Register user (Public)
- `POST /api/auth/login` - User login (Public)

## Running the Server
```bash
npm install
npm run seed   # Seed the 5 sample events
npm run dev    # Start server with file watch on http://localhost:5000
```
