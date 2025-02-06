
import React, { useState } from 'react';
import '../pages/home.css'; // External CSS file for styling
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (event) => {
      event.preventDefault();
  
      try {
        const response = await fetch('https://medianet-staff-frontend.onrender.com/api/staffRoutes/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          setErrorMessage(data.error || 'Login failed');
        } else {
          alert('Login successful');
          navigate('/dashboard');
          console.log(data);
        }
      } catch (error) {
        setErrorMessage('Network error. Please try again.');
        console.error('Error:', error);
      }
    };
  
    return (
      <div className="login-container">
        <div className="login-card">
          <h2 className="title">Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    );
  };
  

export default Home;
