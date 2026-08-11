from fastapi import FastAPI, Header, HTTPException, Depends
import bcrypt
import requests
from datetime import date, datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import psycopg2 
from dotenv import load_dotenv
import os
from jose import jwt

load_dotenv()

SECRET_KEY = "calvineats-secret-key-2026"

def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not logged in")
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["email"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database connection failed")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://vocal-kataifi-de20c9.netlify.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home(): 
    return {"message": "Calvin Eats is alive!"}

@app.get("/api/menu")
def get_menu():
    try:
        url = "https://apiservicelocatorstenantcds.fdmealplanner.com/api/v1/data-locator-webapi/7/meals?menuId=0&accountId=10013&locationId=10137&mealPeriodId=2&tenantId=7&monthId=8&startDate=2026%2F08%2F01&endDate=2026%2F08%2F31&timeOffset=300"
        response = requests.get(url, timeout=10)
        data = response.json()
        today = date.today().isoformat()
        clean_meals = []
        for day in data["result"]:
            if day["menuForDate"][:10] == today:
                clean_meals.append({
                    "date": day["menuForDate"],
                    "meals": day["menuRecipes"],
                    "meal_period": day["mealPeriodId"]
                })
        return clean_meals
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not fetch menu data")

@app.post("/api/ratings")
def add_rating(meal_name: str, rating: int, comment: str = "", email: str = Depends(verify_token)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO ratings (meal_name, rating, comment) VALUES (%s, %s, %s)",
            (meal_name, rating, comment)
        )
        conn.commit()
        conn.close()
        return {"message": "Rating saved!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save rating")

@app.get("/api/ratings/{meal_name}")
def get_ratings(meal_name: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT rating, comment FROM ratings WHERE meal_name = %s",
            (meal_name,)
        )
        rows = cursor.fetchall()
        conn.close()
        return [{"rating": row[0], "comment": row[1]} for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not fetch ratings")

@app.post("/api/signup")
def signup(email: str, password: str):
    try:
        hashed_password = bcrypt.hashpw(password[:72].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (%s, %s)",
            (email, hashed_password)
        )
        conn.commit()
        conn.close()
        return {"message": "Account created!"}
    except Exception as e:
        return {"error": "Email already exists"}

@app.post("/api/login")
def login(email: str, password: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return {"error": "Email not found"}
        
        if not bcrypt.checkpw(password[:72].encode('utf-8'), user[0].encode('utf-8')):
            return {"error": "Wrong password"}
        
        token = jwt.encode(
            {"email": email, "exp": datetime.utcnow() + timedelta(hours=24)},
            SECRET_KEY
        )
        return {"token": token}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Login failed")