import { useState, useEffect } from 'react';
import './App.css';
import StarRating from './StarRating';

function App() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/menu')
      .then(res => res.json())
      .then(data => setMeals(data));
  }, []);

  return (
  <div>
    <h1>Calvin Eats 🍽️</h1>
    <p>Today's Menu</p>
    {meals.map((day, index) => (
      <div key={index}>
        {day.meals.split(", ").map((meal, mealIndex) => (
  <div key={mealIndex}>
    <p className="meal-card">{meal}</p>
    <StarRating mealName={meal} />
  </div>
))}
      </div>
    ))}
  </div>
);
    
}

export default App;