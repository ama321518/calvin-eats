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
    <div>
      <h1>Calvin Eats 🍽️</h1>
      <p>Welcome, {user}! <span onClick={handleLogout} style={{color: '#6B0000', cursor: 'pointer'}}>Logout</span></p>
      <p>Today's Menu</p>
      {meals.map((day, index) => (
        <div key={index}>
          {day.meals.split(", ").map((meal,mealIndex) => (
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