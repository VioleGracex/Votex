import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // Резервный URL

const AuthPopup = ({ type, onClose }) => {
  const [view, setView] = useState(type);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Пароль должен содержать минимум 8 символов, включать одну цифру, одну заглавную и одну строчную букву
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const register = async () => {
    if (!validateEmail(email)) {
      showNotification('Неверный формат email');
      return;
    }

    if (!validatePassword(password)) {
      showNotification('Пароль должен содержать минимум 8 символов, включать одну цифру, одну заглавную и одну строчную букву');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();
      console.log('Ответ регистрации:', result);

      if (response.ok) {
        showNotification('Регистрация успешна!', 'success');
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.username);
        localStorage.setItem('userId', result.user.userId);
        setView('login');
      } else {
        showNotification(result.error);
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      showNotification('Ошибка регистрации. Пожалуйста, попробуйте снова.');
    }
  };

  const login = async () => {
    if (!validateEmail(email)) {
      showNotification('Неверный формат email');
      return;
    }

    console.log('Вход с', { email, password });

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log('Ответ входа:', result);

      if (response.ok) {
        showNotification('Вход успешен!', 'success');
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.username);
        localStorage.setItem('userId', result.user.userId);
        onClose();
        window.location.href = '/dashboard';
      } else {
        showNotification(result.error);
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      showNotification('Ошибка входа. Пожалуйста, попробуйте снова.');
    }
  };

  const sendResetLink = async () => {
    if (!validateEmail(email)) {
      showNotification('Неверный формат email');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/send-reset-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        showNotification('Ссылка для сброса пароля отправлена на ваш email!', 'success');
      } else {
        showNotification(result.error);
      }
    } catch (error) {
      console.error('Ошибка отправки ссылки для сброса пароля:', error);
      showNotification('Ошибка отправки ссылки для сброса пароля. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg relative z-50 w-full max-w-md shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
          <FaTimes size={20} />
        </button>
        <div className="p-4">
          {notification && (
            <div className={`mb-4 p-2 rounded-lg ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {notification.message}
            </div>
          )}
          {view === 'register' && (
            <>
              <h2 className="text-center text-2xl mb-4">Регистрация</h2>
              <div className="form-group mb-4">
                <label htmlFor="username" className="block mb-2">Имя пользователя</label>
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
                <label htmlFor="password" className="block mb-2">Пароль</label>
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
                  Зарегистрироваться
                </button>
              </div>
              <div className="text-center">
                <button onClick={() => setView('login')} className="text-blue-500 hover:underline">Уже есть аккаунт? Войти</button>
              </div>
            </>
          )}
          {view === 'login' && (
            <>
              <h2 className="text-center text-2xl mb-4">Вход</h2>
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
                <label htmlFor="loginPassword" className="block mb-2">Пароль</label>
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
                  Войти
                </button>
              </div>
              <div className="text-center">
                <button onClick={() => setView('register')} className="text-blue-500 hover:underline">Нет аккаунта? Зарегистрироваться</button>
                <button onClick={() => setView('forgotPassword')} className="text-blue-500 hover:underline ml-4">Забыли пароль?</button>
              </div>
            </>
          )}
          {view === 'forgotPassword' && (
            <>
              <h2 className="text-center text-2xl mb-4">Сброс пароля</h2>
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
                  Отправить ссылку для сброса
                </button>
              </div>
              <div className="text-center">
                <button onClick={() => setView('login')} className="text-blue-500 hover:underline">Назад к входу</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;