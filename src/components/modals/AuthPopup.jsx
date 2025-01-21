import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // Fallback URL

const AuthPopup = ({ type, onClose }) => {
  const [view, setView] = useState(type);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    const closeOnEscapeKey = (e) => e.key === 'Escape' ? onClose() : null;
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.body.addEventListener('keydown', closeOnEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const register = async () => {
    console.log('Registering with', { username, email, password });

    try {
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();
      console.log('Registration response:', result);

      if (response.ok) {
        alert('Registration successful!');
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.username);
        localStorage.setItem('userId', result.user.userId);
        setView('login');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration error. Please try again.');
    }
  };

  const login = async () => {
    console.log('Logging in with', { email, password });

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.username);
        localStorage.setItem('userId', result.user.userId);
        onClose();
        window.location.href = '/dashboard';
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error. Please try again.');
    }
  };

  const sendResetLink = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/send-reset-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Password reset link sent to your email!');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Password reset link error:', error);
      alert('Password reset link error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg relative z-50 w-full max-w-md shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
          <FaTimes size={20} />
        </button>
        <div className="p-4">
          {view === 'register' && (
            <>
              <h2 className="text-center text-2xl mb-4">Register</h2>
              <div className="form-group mb-4">
                <label htmlFor="username" className="block mb-2">Username</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaUser className="ml-2 text-gray-500" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
                    required
                  />
                </div>
              </div>
              <div className="form-group mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaEnvelope className="ml-2 text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
                    required
                  />
                </div>
              </div>
              <div className="form-group mb-4">
                <label htmlFor="password" className="block mb-2">Password</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaLock className="ml-2 text-gray-500" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
                    required
                  />
                </div>
              </div>
              <div className="form-group mb-4">
                <button
                  onClick={register}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Register
                </button>
              </div>
              <div className="text-center">
                <button onClick={() => setView('login')} className="text-blue-500 hover:underline">Already have an account? Login</button>
              </div>
            </>
          )}
          {view === 'login' && (
            <>
              <h2 className="text-center text-2xl mb-4">Login</h2>
              <div className="form-group mb-4">
                <label htmlFor="loginEmail" className="block mb-2">Email</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaEnvelope className="ml-2 text-gray-500" />
                  <input
                    type="email"
                    id="loginEmail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
                    required
                  />
                </div>
              </div>
              <div className="form-group mb-4">
                <label htmlFor="loginPassword" className="block mb-2">Password</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaLock className="ml-2 text-gray-500" />
                  <input
                    type="password"
                    id="loginPassword"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
                    required
                  />
                </div>
              </div>
              <div className="form-group mb-4">
                <button
                  onClick={login}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Login
                </button>
              </div>
              <div className="text-center">
                <button onClick={() => setView('register')} className="text-blue-500 hover:underline">Don't have an account? Register</button>
                <button onClick={() => setView('forgotPassword')} className="text-blue-500 hover:underline ml-4">Forgot password?</button>
              </div>
            </>
          )}
          {view === 'forgotPassword' && (
            <>
              <h2 className="text-center text-2xl mb-4">Reset Password</h2>
              <div className="form-group mb-4">
                <label htmlFor="resetEmail" className="block mb-2">Email</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaEnvelope className="ml-2 text-gray-500" />
                  <input
                    type="email"
                    id="resetEmail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
                    required
                  />
                </div>
              </div>
              <div className="form-group mb-4">
                <button
                  onClick={sendResetLink}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Send Reset Link
                </button>
              </div>
              <div className="text-center">
                <button onClick={() => setView('login')} className="text-blue-500 hover:underline">Back to Login</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;