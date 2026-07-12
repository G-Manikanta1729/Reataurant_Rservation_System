# 🍽️ Restaurant Reservation Management System

A full-stack **Restaurant Reservation Management System** developed using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. The application enables customers to reserve tables online while providing administrators with tools to manage tables and reservations efficiently.

---

# 🌐 Live Demo

### Frontend
https://reataurant-rservation-system-navy.vercel.app

### Backend API
https://restaurant-reservation-backend-gjho.onrender.com

### GitHub Repository
https://github.com/G-Manikanta1729/Reataurant_Rservation_System

---

# 📌 Project Overview

The Restaurant Reservation Management System digitizes the restaurant booking process by allowing customers to:

- Register and Login securely
- View available tables
- Book tables for specific dates and time slots
- View reservation history
- Cancel reservations

Administrators can:

- View all reservations
- Manage restaurant tables
- Cancel customer reservations
- Monitor reservation details

---

# ✨ Features

## Customer Features

- User Registration
- Secure Login using JWT Authentication
- View Available Tables
- Create Reservations
- View Reservation History
- Cancel Reservations
- Filter Reservations
  - All
  - Upcoming
  - Past
  - Cancelled

---

## Administrator Features

- Admin Login
- View All Reservations
- Filter Reservations by Date
- Cancel Any Reservation
- Manage Restaurant Tables
- Add Tables
- Delete Tables
- Seed Default Tables

---

# 🛠 Technology Stack

## Frontend

- React.js
- React Router DOM
- Axios
- React Hot Toast

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

## Database

- MongoDB Atlas
- Mongoose ODM

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

# 📁 Project Structure

```
Restaurant_Reservation_System
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   └── utils
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── services
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# 🔐 Authentication

The application uses **JSON Web Token (JWT)** based authentication.

### Customer

- Register
- Login
- Access protected routes

### Admin

- Secure Login
- Role-based authorization
- Access admin dashboard

---

# 🍽 Reservation Workflow

1. User registers/login.
2. Customer views available tables.
3. Selects:
   - Date
   - Time Slot
   - Number of Guests
4. System validates:
   - Table Capacity
   - Existing Reservations
5. Reservation is created.
6. Customer can cancel reservation later.

---

# 👨‍💼 Admin Workflow

Administrator can:

- View every reservation
- Search reservations
- Filter by reservation date
- Cancel reservations
- Add restaurant tables
- Delete restaurant tables
- Seed default restaurant tables

---

# 📊 Database Collections

## Users

- Name
- Email
- Password
- Role

---

## Tables

- Table Number
- Capacity
- Availability

---

## Reservations

- Customer
- Table
- Reservation Date
- Time Slot
- Guests
- Status

---

# 🔒 Validation

The system validates:

- Duplicate Reservations
- Table Capacity
- Past Dates
- Required Fields
- Authentication
- Authorization

---

# 🌐 REST API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| GET | /api/auth/me | Get Current User |

---

## Tables

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/tables | Get All Tables |
| POST | /api/tables | Create Table (Admin) |
| DELETE | /api/tables/:id | Delete Table |
| POST | /api/tables/seed | Seed Default Tables |

---

## Reservations

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/reservations | Get Reservations |
| POST | /api/reservations | Create Reservation |
| DELETE | /api/reservations/:id | Cancel Reservation |
| GET | /api/reservations/date | Filter Reservations |

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/G-Manikanta1729/Reataurant_Rservation_System.git
```

```
cd Reataurant_Rservation_System
```

---

## Backend Setup

```
cd backend
```

Install dependencies

```bash
npm install
```

Create `.env`

```
PORT=5000

MONGODB_URI=Your MongoDB Atlas URI

JWT_SECRET=Your JWT Secret

NODE_ENV=development
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```
cd frontend
```

Install dependencies

```bash
npm install
```

Create `.env`

```
REACT_APP_API_URL=http://localhost:5000/api
```

Run Frontend

```bash
npm start
```

---

# 👤 Default Admin Account

```
Email:
admin@restaurant.com

Password:
admin123
```

---

# 🧪 Testing

### Customer

- Register
- Login
- Create Reservation
- View Reservations
- Cancel Reservation

### Administrator

- Login
- View All Reservations
- Manage Tables
- Filter Reservations
- Cancel Reservations

---

# 📈 Future Enhancements

- Email Notifications
- Payment Integration
- Waitlist System
- Online Payments
- Table Availability Calendar
- Reservation Reminders
- Mobile Application
- Analytics Dashboard
- Report Generation

---

# 📷 Screenshots

Add screenshots of:

- Login Page
- Register Page
- Customer Dashboard
- Reservation Page
- Admin Dashboard

---

# 👨‍💻 Author

**Grandhe Manikanta Sri Sai Kiran**

B.Tech – Information Technology

Prasad V. Potluri Siddhartha Institute of Technology

GitHub:
https://github.com/G-Manikanta1729

---

# 📄 License

This project was developed for educational and assessment purposes.

---

## ⭐ Thank You
