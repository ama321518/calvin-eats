import { useState } from 'react';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const endpoint = isLogin ? 'login' : 'signup';
    fetch(`https://calvin-eats-backend.onrender.com/api/${endpoint}?email=${email}&password=${password}`, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        onLogin(email);
      } else if (data.message) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="auth-input"
        />
        <button onClick={handleSubmit} className="auth-button">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
          {isLogin ? 'No account? Sign up' : 'Have an account? Login'}
        </p>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}

export default Auth;