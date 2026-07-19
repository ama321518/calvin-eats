import { useState } from 'react';

function StarRating({ mealName }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const submitRating = (star) => {
    setRating(star);
    fetch(`http://127.0.0.1:8000/api/ratings?meal_name=${mealName}&rating=${star}&comment=`, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => console.log(data));
  };

  return (
    <div>
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