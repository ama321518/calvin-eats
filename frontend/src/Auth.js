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
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: '#6B0000' }}>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button
        onClick={handleSubmit}
        style={{ background: '#6B0000', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      <p onClick={() => setIsLogin(!isLogin)} style={{ color: '#6B0000', cursor: 'pointer', marginTop: '10px' }}>
        {isLogin ? 'No account? Sign up' : 'Have an account? Login'}
      </p>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Auth;