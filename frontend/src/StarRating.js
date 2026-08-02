import { useState, useEffect } from 'react';

function StarRating({ mealName }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/ratings/${encodeURIComponent(mealName)}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAvgRating(avg.toFixed(1));
        }
      });
  }, [mealName]);

  const submitRating = (star) => {
    setRating(star);
    fetch(`https://calvin-eats-backend.onrender.com/api/ratings?meal_name=${encodeURIComponent(mealName)}&rating=${star}&comment=`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(() => {
    fetch(`https://calvin-eats-backend.onrender.com/api/ratings/${encodeURIComponent(mealName)}`)  
        .then(res => res.json())
        .then(data => {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAvgRating(avg.toFixed(1));
        });
    });
  };

  return (
    <div>
      {avgRating && <p style={{color: '#6B0000'}}>⭐ Average: {avgRating}/5</p>}
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => submitRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{ 
            cursor: 'pointer', 
            fontSize: '24px',
            color: star <= (hover || rating) ? '#F0B429' : '#ccc'
          }}
        >
          ★
        </span>
      ))}
      {rating > 0 && <p>You rated: {rating} stars</p>}
    </div>
  );
}

export default StarRating;