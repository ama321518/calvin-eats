import { useState } from 'react';

function StarRating({ mealName }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
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