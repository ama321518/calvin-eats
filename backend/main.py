from fastapi import FastAPI
import requests
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
import psycopg2 
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn



app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home(): 
    return {"message": "Calvin Eats is alive!"}

@app.get("/api/menu")
def get_menu():
    url = "https://apiservicelocatorstenantcds.fdmealplanner.com/api/v1/data-locator-webapi/7/meals?menuId=0&accountId=10013&locationId=10137&mealPeriodId=2&tenantId=7&monthId=7&startDate=2026%2F07%2F01&endDate=2026%2F07%2F31&timeOffset=300"
    response = requests.get(url)
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


@app.post("/api/ratings")
def add_rating(meal_name: str, rating: int, comment: str = ""):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO ratings (meal_name, rating, comment) VALUES (%s, %s, %s)",
        (meal_name, rating, comment)
    )
    conn.commit()
    conn.close()
    return {"message": "Rating saved!"}
   

@app.get("/api/ratings/{meal_name}")
def get_ratings(meal_name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT rating, comment FROM ratings WHERE meal_name = %s",
        (meal_name,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [{"rating": row[0], "comment": row[1]} for row in rows]