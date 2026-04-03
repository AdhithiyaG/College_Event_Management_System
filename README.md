# 🎓 College Event Management System

> A full-stack platform that streamlines college event organization — from discovery to QR-powered check-in.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue?style=flat-square&logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![Postgres](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)

---

## ✨ What It Does

Students browse and register for college events in seconds. On registration, they receive a **confirmation email with a unique QR code**. At the event, admins scan the QR code with their device camera to mark attendance instantly — no paperwork, no manual lists.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                                                             │
│   ┌──────────────────┐         ┌──────────────────────┐    │
│   │   Student View   │         │     Admin View        │    │
│   │                  │         │                       │    │
│   │ • Browse Events  │         │ • Dashboard & Stats   │    │
│   │ • Register       │         │ • Create/Edit Events  │    │
│   │ • View QR Code   │         │ • QR Camera Scanner   │    │
│   └────────┬─────────┘         └──────────┬────────────┘   │
│            │          React + Vite         │                │
│            └──────────────┬───────────────┘                │
└───────────────────────────┼─────────────────────────────────┘
                            │ Axios (REST API)
┌───────────────────────────┼─────────────────────────────────┐
│                     API LAYER                               │
│                                                             │
│              ┌────────────▼──────────────┐                 │
│              │    Node.js + Express       │                 │
│              │                           │                 │
│              │  /api/auth    → Auth       │                 │
│              │  /api/events  → Events     │                 │
│              │  /api/registrations        │                 │
│              │               → Register  │                 │
│              │               → Attend    │                 │
│              └──────┬────────────┬───────┘                 │
│                     │            │                         │
│              JWT Middleware   Role Guard                    │
│              (authenticate)  (STUDENT/ADMIN)               │
└─────────────────────┼────────────┼─────────────────────────┘
                      │            │
┌─────────────────────┼────────────┼─────────────────────────┐
│                  DATA LAYER      │                          │
│                                  │                         │
│   ┌──────────────────┐    ┌──────▼──────────────┐         │
│   │   PostgreSQL DB   │    │   Nodemailer         │         │
│   │                  │    │                      │         │
│   │  Users           │    │  Confirmation Email  │         │
│   │  Events          │◄───│  + QR Code Attachment│         │
│   │  Registrations   │    │                      │         │
│   │                  │    └──────────────────────┘         │
│   │  (via Prisma ORM)│                                     │
│   └──────────────────┘                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Core Flow

```
Student Registers
      │
      ▼
Check: Event Active? Capacity Available? Already Registered?
      │
      ▼
Create Registration in DB
      │
      ▼
Generate Unique QR Code (registration ID encoded)
      │
      ▼
Send Confirmation Email with QR Code
      │
      ▼
Admin Scans QR at Event → Attendance Marked ✓
```

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔐 JWT Auth | Access + refresh token flow with role-based access |
| 📅 Event Management | Admins create, edit, delete events with capacity control |
| 🎫 Smart Registration | Prevents duplicate registrations, enforces capacity limits |
| 📷 QR Check-in | Camera-based QR scanning for instant attendance marking |
| 📧 Email Confirmation | Auto-sent on registration with embedded QR code |
| 📊 Admin Dashboard | Real-time stats — registrations, capacity, attendance |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- React Router DOM
- Tailwind CSS v3
- Axios
- html5-qrcode

**Backend**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Nodemailer
- JWT (jsonwebtoken)
- bcryptjs
- qrcode

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/college-event-management.git
cd college-event-management
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/collegeevents"
JWT_SECRET=your_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Run migrations and start:
```bash
npx prisma migrate dev
npm run dev
```

### 3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 📁 Project Structure

```
college-event-management/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Auth, Event, Registration logic
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/       # JWT auth + role guards
│   │   ├── services/        # Email service
│   │   ├── utils/           # QR code generator
│   │   └── config/          # Prisma client
│   └── prisma/
│       └── schema.prisma    # DB schema
│
└── frontend/
    └── src/
        ├── pages/           # Login, Register, Events, Admin
        ├── components/      # Navbar, EventCard, QRScanner
        ├── context/         # Auth context
        └── services/        # Axios API calls
```

---

## 🗄️ Database Schema

```
User ──────────────── Registration ──────────────── Event
 id                       id                          id
 name                     userId (FK)                 title
 email                    eventId (FK)                description
 password                 qrCode                      date
 role (STUDENT/ADMIN)     attended                    venue
 department               createdAt                   capacity
 year                                                 isActive
```

> `@@unique([userId, eventId])` — prevents duplicate registrations at the DB level.

---

## 🔑 API Reference

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Events
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/events` | Public |
| GET | `/api/events/:id` | Public |
| POST | `/api/events` | Admin |
| PUT | `/api/events/:id` | Admin |
| DELETE | `/api/events/:id` | Admin |

### Registrations
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/registrations/register` | Student |
| GET | `/api/registrations/my-registrations` | Student |
| DELETE | `/api/registrations/:id` | Student |
| GET | `/api/registrations/event/:eventId` | Admin |
| POST | `/api/registrations/attendance` | Admin |

---

## 👤 Author

**Adhithiya G** — AI & Data Science, Batch 2023–2027

[![GitHub](https://img.shields.io/badge/GitHub-yourusername-black?style=flat-square&logo=github)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Adhithiya-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/yourprofile)

---

> Built as a portfolio project to demonstrate full-stack development with real-world features like QR-based attendance, JWT auth, and role-based access control.
