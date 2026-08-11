import { useState, useEffect } from 'react';
import './App.css';
import StarRating from './StarRating';
import Auth from './Auth';

function App() {
  const [meals, setMeals] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) setUser(email);
  }, []);

  useEffect(() => {
    fetch('https://calvin-eats-backend.onrender.com/api/menu')
      .then(res => res.json())
      .then(data => setMeals(data));
  }, []);

  const handleLogin = (email) => {
    localStorage.setItem('email', email);
    setUser(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="menu-container">
      <div className="header-bar">
        <h1>Calvin Eats 🍽️</h1>
        <span className="logout-link" onClick={handleLogout}>
          {user} · Logout
        </span>
      </div>
      <p>Today's Menu</p>
      {meals.map((day, index) => (
        <div className="menu-list" key={index}>
          {day.meals.split(", ").map((meal, mealIndex) => (
            <div className="meal-row" key={mealIndex}>
              <span className="meal-name">{meal}</span>
              <StarRating mealName={meal} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;