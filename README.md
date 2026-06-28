# TaskFlow — Advanced To-Do List Application (MERN Stack)

A production-grade task management application built with **MongoDB**, **Express.js**, **React.js**, and **Node.js**.

---

## ✨ Features

### Core Requirements
- ✅ **Complete CRUD** — Create, Read, Update, Delete tasks via REST APIs
- ✅ **React Hooks & Reusable Components** — Context API, custom hooks, modular UI
- ✅ **Task Status Workflow** — Pending → In-Progress → Completed
- ✅ **Server-side Validation** — express-validator with structured error responses
- ✅ **Pagination, Filtering & Sorting** — Multi-field filters with date ranges
- ✅ **JWT Authentication** — Register, login, protected routes, auto-logout
- ✅ **Clean Architecture** — Routes / Controllers / Models separation (MVC)

### Extra Features
- 🎨 **Dark/Light Theme** — Animated toggle with localStorage persistence
- 📊 **Dashboard Analytics** — Status, priority, and productivity charts (Chart.js)
- 🏷️ **Tags & Categories** — Color-coded labels for organizing tasks
- 📅 **Due Dates** — Date picker with overdue/today/upcoming indicators
- ⭐ **Priority Levels** — Low / Medium / High / Critical with visual indicators
- 🔍 **Global Search** — Debounced search across all tasks
- 📌 **Kanban Board** — Drag & drop between status columns
- 🗑️ **Soft Delete & Trash** — 30-day auto-purge, restore functionality
- 📤 **Export Tasks** — Download as CSV or PDF
- 🔔 **Toast Notifications** — Animated notifications for all operations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), Chart.js, @hello-pangea/dnd, jsPDF |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Styling | Vanilla CSS with CSS Variables (dual theme) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**Default `.env` values:**
```
MONGO_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

### 4. Open in Browser

Navigate to **http://localhost:5173**

---

## 📁 Project Structure

```
├── server/                     # Backend (Express.js)
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Route handlers
│   ├── middleware/              # Auth, error handler, validation
│   ├── models/                 # Mongoose schemas (User, Task)
│   ├── routes/                 # API route definitions
│   ├── utils/                  # ApiError class
│   └── server.js               # Entry point
│
├── client/                     # Frontend (React + Vite)
│   └── src/
│       ├── api/                # Axios instance
│       ├── components/         # Reusable UI components
│       ├── context/            # Auth, Theme, Toast providers
│       ├── hooks/              # Custom React hooks
│       ├── pages/              # Page components
│       ├── utils/              # Constants & helpers
│       ├── App.jsx             # Router & providers
│       └── App.css             # Design system
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get profile |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List (paginated, filtered) |
| POST | `/api/tasks` | Create |
| PUT | `/api/tasks/:id` | Update |
| PATCH | `/api/tasks/:id/status` | Update status |
| DELETE | `/api/tasks/:id` | Soft delete |
| PATCH | `/api/tasks/:id/restore` | Restore |
| DELETE | `/api/tasks/:id/permanent` | Permanent delete |
| GET | `/api/tasks/trash` | List trash |
| GET | `/api/tasks/analytics` | Dashboard data |

### Export
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export/csv` | Download CSV |

---

## 👤 Author

Built as an internship project for Full Stack Development.

---
