# Smart Lead Dashboard

<p align="center">
  <img src="client/public/logo.png" alt="Smart Lead Dashboard Logo" width="100" style="border-radius:20px"/>
</p>

<p align="center">
  <strong>AI-Powered Lead Management CRM — Built with the MERN Stack</strong><br/>
  Track, nurture, and convert leads with a beautiful analytics dashboard and a live AI assistant.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-orange" />
</p>

---

## ✨ Features

- **Full CRUD** — Create, read, update, and delete leads with instant feedback
- **Role-based access** — Admin and Sales roles with separate permissions
- **Live AI Assistant** — Powered by Groq's LLaMA 3.3 70B, with your pipeline context injected automatically
- **Analytics Dashboard** — Stat cards with trend badges, pipeline status bars, source breakdown, and conversion rate donut chart
- **Authentication** — JWT-based auth with protected routes and persistent sessions
- **CSV Export** — Export your entire lead list with one click
- **Responsive** — Mobile-first layout with collapsible sidebar
- **Dark Mode** — System-aware with manual toggle
- **Shopeers-inspired UI** — Clean glassmorphic design with micro-animations

## 🖥️ Screenshots

| Login | Dashboard | Leads |
|-------|-----------|-------|
| Split-panel auth | Stats + AI chat | Filter & table |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone
```bash
git clone https://github.com/coderMayank69/Smart-Lead-Dashboard.git
cd Smart-Lead-Dashboard
```

### 2. Server setup
```bash
cd server
cp ../.env.example .env   # fill in your values
npm install
npm run dev               # starts on :5000
```

### 3. Client setup
```bash
cd client
# .env already has VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev               # starts on :5173
```

### 4. Docker (full stack)
```bash
# From project root — needs MONGODB_URI + JWT_SECRET in .env
docker compose up --build
# Frontend: http://localhost
```

## 🔑 Environment Variables

### Server (`server/.env`)
| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | | Token expiry (default: `7d`) |
| `CLIENT_URL` | | Comma-separated allowed origins |
| `GROQ_API_KEY` | ✅ | Groq API key for AI assistant |
| `PORT` | | Server port (default: `5000`) |

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

## 🏗️ Architecture

```
Smart-Lead-Dashboard/
├── client/               # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/          # Axios API clients
│   │   ├── components/   # UI + layout + lead components
│   │   ├── hooks/        # useLeads, useDebounce
│   │   ├── pages/        # Dashboard, Leads, Login, Register
│   │   ├── store/        # Zustand auth + UI stores
│   │   └── types/        # Shared TypeScript interfaces
│   └── public/           # Logo, favicon
└── server/               # Express + TypeScript
    └── src/
        ├── config/       # DB + env config
        ├── controllers/  # Auth + Lead + AI handlers
        ├── middlewares/  # Auth, validation, error handling
        ├── models/       # Mongoose User + Lead models
        ├── routes/       # Auth, Lead, AI routes
        └── validators/   # Zod schemas
```

## 🤖 AI Assistant

The AI assistant uses **Groq's LLaMA 3.3 70B** model. On each message it automatically injects your current pipeline stats as context so it can give specific, actionable insights:

> "You have 24 total leads. Website is your top source at 67%. Your qualified conversion rate is 29% — industry average is 20-25%, so you're performing well!"

## 🚢 Deployment

### Render (recommended)
1. Push to GitHub
2. Create **Web Service** for `server/` → set all env vars in Render dashboard → add `GROQ_API_KEY`
3. Create **Web Service** for `client/` → set `VITE_API_URL` to your Render server URL

The CORS config automatically accepts any `.onrender.com` and `.vercel.app` origin.

## 📄 Demo Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | password123 |
| Sales | sales@demo.com | password123 |

## 📝 License
MIT — Built by [Mayank Singh](https://mayank-developer.vercel.app)
