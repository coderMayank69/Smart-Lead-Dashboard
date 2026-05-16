# Smart Lead Dashboard

<div align="center">

<img src="client/public/logo.png" alt="Smart Lead Dashboard Logo" width="80" height="80" style="border-radius:16px; margin-bottom: 16px" />

### Smart Leads

**A production-grade full-stack Lead Management CRM built with MERN stack and TypeScript.**

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

[Live Demo](#) · [API Docs](#api-documentation) · [Report Bug](https://github.com/coderMayank69/Smart-Lead-Dashboard/issues) · [Request Feature](https://github.com/coderMayank69/Smart-Lead-Dashboard/issues)

</div>


---

## ✨ Features

### Core
- 🔐 **JWT Authentication** — Register, login, protected routes, bcrypt password hashing
- 👥 **Role-Based Access Control** — Admin (full access) and Sales (own leads) roles
- 📋 **Full Lead CRUD** — Create, Read, Update, Delete with form validation
- 🔍 **Advanced Filtering** — Multi-filter by status, source, and search query
- 📝 **Debounced Search** — 400ms delay for efficient API calls
- 📄 **Backend Pagination** — 10 records per page with full metadata
- 📤 **CSV Export** — Download filtered leads with Excel-compatible encoding

### Technical Excellence
- 🏗️ **Clean Architecture** — Controller → Service → Model separation
- 📐 **Zod Validation** — Runtime type-safe validation on both client and server
- 🎨 **Dark Mode** — System-aware with localStorage persistence
- 💅 **Design System** — Custom Tailwind CSS components with animations
- 🐳 **Docker Setup** — Full containerized environment with docker-compose
- 🔒 **Security** — Helmet, rate limiting, CORS, input sanitization

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| State | Zustand (persisted) |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Validation | Zod |
| DevOps | Docker, docker-compose |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
smart-lead-dashboard/
├── client/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── api/               # Typed API calls (axios instances)
│   │   ├── components/
│   │   │   ├── ui/            # Design system primitives
│   │   │   ├── leads/         # Lead-specific components
│   │   │   └── layout/        # Sidebar, Header, DashboardLayout
│   │   ├── hooks/             # useLeads, useDebounce custom hooks
│   │   ├── pages/             # Login, Register, Dashboard, Leads
│   │   ├── router/            # ProtectedRoute, PublicRoute guards
│   │   ├── store/             # Zustand stores (auth, ui)
│   │   ├── types/             # Shared TypeScript interfaces
│   │   └── utils/             # cn, csv export, constants
├── server/                    # Express + TypeScript backend
│   ├── src/
│   │   ├── config/            # MongoDB connection
│   │   ├── controllers/       # Request handlers
│   │   ├── middlewares/       # Auth, RBAC, validation, error handler
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # Express routers
│   │   ├── services/          # Business logic layer
│   │   ├── types/             # Shared interfaces
│   │   ├── utils/             # JWT, response helpers
│   │   └── validators/        # Zod schemas
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/coderMayank69/Smart-Lead-Dashboard.git
cd Smart-Lead-Dashboard
```

### 2. Setup the server
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 3. Setup the client
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

### 4. Open in browser
- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000/health

---

## 🐳 Docker Setup

Run the entire stack with one command:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
| Service | Port |
|---------|------|
| Frontend (nginx) | 5173 |
| Backend API | 5000 |
| MongoDB | 27017 |

---

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Create new account |
| POST | `/auth/login` | ❌ | Login and get token |
| GET | `/auth/me` | ✅ | Get current user profile |

### Leads

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/leads` | ✅ | Any | List leads (with filters) |
| POST | `/leads` | ✅ | Any | Create new lead |
| GET | `/leads/stats` | ✅ | Any | Get pipeline stats |
| GET | `/leads/:id` | ✅ | Any | Get lead by ID |
| PUT | `/leads/:id` | ✅ | Any | Update lead |
| DELETE | `/leads/:id` | ✅ | Any | Delete lead |

### Query Parameters (GET /leads)

| Param | Type | Values | Description |
|-------|------|--------|-------------|
| `status` | string | New, Contacted, Qualified, Lost | Filter by status |
| `source` | string | Website, Instagram, Referral | Filter by source |
| `search` | string | any | Search name or email |
| `sortBy` | string | latest, oldest | Sort order |
| `page` | number | ≥1 | Page number |
| `limit` | number | 1-100 | Records per page |

### Response Format

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": { "leads": [...] },
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "data": [
    { "field": "email", "message": "Enter a valid email address" }
  ]
}
```

---

## 🔐 Security Features

- **JWT** tokens with configurable expiry
- **bcrypt** password hashing (12 rounds)
- **Helmet** security headers
- **Rate limiting** — 200 req/15min globally, 20 req/15min on auth routes
- **CORS** restricted to configured client URL
- **Input validation** via Zod on all endpoints
- **Mongoose query sanitization** via schema types

---

## 🎨 UI Components

Built reusable component library:
- `Button` — variants: primary, secondary, danger, ghost + loading state
- `Input` — with label, error, hint, left/right icon
- `Select` — custom styled dropdown
- `Modal` — accessible with Escape key + scroll lock
- `StatusBadge / SourceBadge` — color-coded with dot indicator
- `EmptyState` — consistent empty data display
- `Skeleton` — shimmer loading placeholders
- `ConfirmDialog` — destructive action confirmation
- `Pagination` — smart page number display

---

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-lead-dashboard
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 👨‍💻 Author

**Mayank Singh**
- Portfolio: [mayank-developer.vercel.app](https://mayank-developer.vercel.app/)
- GitHub: [@coderMayank69](https://github.com/coderMayank69)

---

## 📄 License

MIT © Mayank Singh
