# Life ke Dohe , Khatri ke Pohe - Production Minimalist Quote App

A minimalist, high-performance, single-page Quote & Dohe application built with **FastAPI (Python)**, **SQLite + SQLAlchemy**, **React (Vite)**, and **Tailwind CSS**.

---

## ✨ Features

- 🏆 **Homepage Heading**: *"Life ke Dohe , Khatri ke Pohe"* prominently displayed.
- 🎨 **Dynamic Color Palette Engine**: Smooth background & accent color morphing on every quote change.
- 🎯 **Ultra Minimalist UX**: Center-aligned *"Next Quote"* button directly beneath the quote display. Top-left dropdown menu for *"View All Quotes"* and *"Add New Quote"*.
- ⚡ **SPA Architecture**: Zero page reloads, custom `useQuotes` hook for API and state management.
- 📜 **Interactive Modals**:
  - **View All Modal**: Search filter, category pills, copy quote to clipboard, and instant delete action.
  - **Add Quote Modal**: Form validation for text, author, and category with automatic backend database persistence.
- 🚀 **Production Deployment Ready**: Configured for Render/Railway (Backend) & Vercel (Frontend).

---

## 📁 Directory Structure

```text
quote-app/
├── backend/
│   ├── main.py            # FastAPI application routes & CORS
│   ├── database.py        # SQLAlchemy session & SQLite setup
│   ├── models.py          # Quote database schema
│   ├── schemas.py         # Pydantic validation schemas
│   ├── seed.py            # Initial dohes & quotes seeder
│   ├── requirements.txt   # Backend dependencies
│   ├── Procfile           # Production runner for Render/Railway
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── HeaderDropdown.jsx   # Top-left minimalist menu
    │   │   ├── QuoteDisplay.jsx     # Center hero quote view
    │   │   ├── ControlButtons.jsx   # Center-aligned Next Quote button
    │   │   ├── QuoteListModal.jsx   # All quotes list & search drawer
    │   │   └── AddQuoteModal.jsx    # Manual quote submission form
    │   ├── hooks/
    │   │   └── useQuotes.js         # Custom state & API hook
    │   ├── utils/
    │   │   └── palettes.js          # Dynamic color themes
    │   ├── App.jsx                  # Main SPA container
    │   ├── main.jsx                 # Entry point
    │   └── index.css                # Glassmorphism & custom utility CSS
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vercel.json                  # Vercel deployment routing rewrite
    ├── package.json
    └── .gitignore
```

---

## 🚀 How to Run Locally

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
> The API will start on `http://127.0.0.1:8000`. Interactive docs are available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup (React + Vite)
Open a new terminal tab/window:
```bash
cd frontend
npm install
npm run dev
```
> The React app will start on `http://localhost:5173`.

---

## 🌐 Easy Deployment Guide

### Backend Deployment (Render / Railway)
1. Push this code repository to GitHub.
2. Go to [Render.com](https://render.com) -> New Web Service.
3. Connect your repository and select the `/backend` directory.
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy! Render will give you a public URL (e.g. `https://your-quote-backend.onrender.com`).

### Frontend Deployment (Vercel)
1. Go to [Vercel.com](https://vercel.com) -> Add New Project.
2. Select your repository and choose the `frontend` folder as the Root Directory.
3. Set Environment Variable:
   - `VITE_API_URL` = `https://your-quote-backend.onrender.com`
4. Update `frontend/vercel.json` with your deployed backend URL.
5. Click **Deploy**!
