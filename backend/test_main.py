from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Calvin Eats is alive!"}

def test_menu_returns_list():
    response = client.get("/api/menu")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_rating_requires_login():
    response = client.post("/api/ratings?meal_name=Grilled Chicken&rating=5")
    assert response.status_code == 401