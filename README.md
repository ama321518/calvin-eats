# Calvin Eats 🍽️

A full stack web application that displays Calvin University's daily dining hall menu and allows students to rate meals in real time.

## Live Demo
https://calvin-eats.netlify.app/

## The Problem
Calvin's dining hall website shows the menu but gives you no way to know if the food is actually good. Calvin Eats adds community ratings so students can see what's worth eating before they walk over.

## Features
- 📅 Real-time daily menu fetched from Calvin's dining system
- ⭐ Star ratings (1-5) on each meal with live average scores
- 🔐 User authentication with secure signup and login
- 💾 Ratings persisted to a cloud database
- 📱 Accessible from any device via browser

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Supabase) |
| Auth | JWT tokens + bcrypt |
| Deployment | Render (backend), Netlify (frontend) |
| Testing | pytest, Jest |

## How It Works
1. Student visits the app and creates an account
2. Today's dining hall menu is fetched automatically from Calvin's third-party API
3. Student rates each meal 1-5 stars
4. Rating is saved to Supabase database
5. Average rating updates instantly for all users to see

## Running Locally

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm start
```

## Environment Variables
Create a `.env` file in the `backend` folder:

## Tests
```bash
# Backend
pytest test_main.py -v

# Frontend
npm test
```

## Author
Ama Yeboah — [GitHub](https://github.com/ama321518)
