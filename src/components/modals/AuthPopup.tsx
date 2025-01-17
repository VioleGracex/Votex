import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

// Modal component that handles both login and registration
const AuthPopup: React.FC<{ type: string; onClose: () => void }> = ({ type, onClose }) => {
  const [isLogin, setIsLogin] = useState(type === 'login');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track client-side rendering

  useEffect(() => {
    setIsClient(true); // Ensure modal is only rendered in the client-side
  }, []);

  if (!isClient) return null; // Avoid rendering modal during SSR

  // Toggle between login and register views
  const toggleModal = () => {
    setIsLogin(!isLogin);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const result = await response.json();
      if (result.success) {
        setIsRegistered(true);
        // Redirect to the user's dashboard
        window.location.href = `/profile/${data.username}/dashboard`;
      } else {
        console.log('Registration failed:', result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-auto relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      ariaHideApp={false}
    >
      {/* Close Button (X Icon) */}
      <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-black">
        <FaTimes />
      </button>

      <h2 className="text-lg font-bold mb-4">
        {isLogin ? 'Войти' : isRegistered ? 'Вы уже зарегистрированы!' : 'Регистрация'}
      </h2>

      {/* Login Form */}
      {isLogin && !isRegistered && (
        <form>
          <input type="email" name="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" />
          <input type="password" name="password" placeholder="Пароль" className="w-full p-2 mb-4 border rounded" />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Войти</button>
        </form>
      )}

      {/* Register Form */}
      {!isLogin && !isRegistered && (
        <form onSubmit={handleRegister}>
          <input type="text" name="username" placeholder="Имя" className="w-full p-2 mb-4 border rounded" />
          <input type="email" name="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" />
          <input type="password" name="password" placeholder="Пароль" className="w-full p-2 mb-4 border rounded" />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Зарегистрироваться</button>
        </form>
      )}

      {/* Already Registered / Login Option */}
      {isLogin && isRegistered && (
        <div className="text-center">
          <p className="mb-4">Вы уже зарегистрированы. Хотите войти?</p>
          <button onClick={toggleModal} className="w-full bg-blue-500 text-white py-2 rounded mb-4">Войти</button>
        </div>
      )}

      {/* Option to switch between login and register */}
      <div className="text-center mt-4">
        {isLogin ? (
          <p>
            Нет аккаунта?{' '}
            <button onClick={toggleModal} className="text-blue-500">
              Зарегистрироваться
            </button>
          </p>
        ) : (
          <p>
            Уже зарегистрированы?{' '}
            <button onClick={toggleModal} className="text-blue-500">
              Войти
            </button>
          </p>
        )}
      </div>
    </Modal>
  );
};

export default AuthPopup;
