import { useState, useEffect } from 'react';

function StarRating({ mealName }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    fetch(`https://calvin-eats-backend.onrender.com/api/ratings/${encodeURIComponent(mealName)}`)
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
      {avgRating && (
        <div className="rating-summary">
          <span className="rating-number">Average {avgRating}</span>
          <span className="rating-summary-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} style={{ color: star <= Math.round(avgRating) ? '#F0B429' : '#ccc' }}>★</span>
            ))}
          </span>
        </div>
      )}
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