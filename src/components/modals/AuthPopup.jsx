import React, { useState, useEffect } from 'react';

const apiUrl = process.env.API_URL || 'http://localhost:5000';  // Fallback URL

const AuthPopup = ({ type, onClose }) => {
  const [view, setView] = useState(type);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const closeOnEscapeKey = (e) => e.key === 'Escape' ? onClose() : null;
      document.body.addEventListener('keydown', closeOnEscapeKey);
      return () => {
        document.body.removeEventListener('keydown', closeOnEscapeKey);
      };
    }
  }, [onClose]);

  const register = async () => {
    console.log('Регистрация с', { username, email, password });
    console.log(apiUrl); // Check if this logs the correct URL

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const result = await response.json();
      console.log('Ответ на регистрацию:', result);

      if (response.ok) {
        alert('Регистрация успешна!');
        setView('login');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      alert('Ошибка регистрации. Попробуйте еще раз.');
    }
  };

  const login = async () => {
    console.log('Вход с', { email, password });
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      console.log('Ответ на вход:', result);

      if (response.ok) {
        alert('Вход успешен!');
        localStorage.setItem('token', result.token);
        onClose();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert('Ошибка входа. Попробуйте еще раз.');
    }
  };

  const sendResetLink = async () => {
    try {
      const response = await fetch(`${apiUrl}/send-reset-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Ссылка для сброса пароля отправлена на ваш email!');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Ошибка отправки ссылки для сброса пароля:', error);
      alert('Ошибка отправки ссылки. Попробуйте еще раз.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg relative z-50 w-full max-w-md">
        <button onClick={onClose} className="absolute top-2 right-2 text-black">
          X
        </button>
        <div className="container mx-auto p-4 border border-gray-300 rounded-lg">
          {view === 'register' && (
            <>
              <h2 className="text-center text-2xl mb-4">Регистрация</h2>
              <div className="form-group mb-4">
                <label htmlFor="username" className="block mb-2">Имя пользователя</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="password" className="block mb-2">Пароль</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <button
                  onClick={register}
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                <input
                  type="email"
                  id="loginEmail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="loginPassword" className="block mb-2">Пароль</label>
                <input
                  type="password"
                  id="loginPassword"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <button
                  onClick={login}
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                <input
                  type="email"
                  id="resetEmail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <button
                  onClick={sendResetLink}
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Отправить ссылку для сброса
                </button>
              </div>
              <div className="text-center">
                <button onClick={() => setView('login')} className="text-blue-500 hover:underline">Вернуться к входу</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
