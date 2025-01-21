import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaHome, FaTachometerAlt, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';
import "../app/globals.css";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('ID пользователя не найден в локальном хранилище.');
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/users/${userId}/details`);
        setUserData(response.data);

        // Update avatar preview with the correct path
        if (response.data.avatar) {
          setAvatarPreview(`/${response.data.avatar}`);
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarChange = async (e) => {
    const userId = localStorage.getItem('userId');
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Проверка размера файла (ограничение до 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Размер файла не должен превышать 2MB');
      return;
    }

    // Проверка разрешения изображения (ограничение до 500x500 пикселей)
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (img.width > 500 || img.height > 500) {
        alert('Разрешение изображения не должно превышать 500x500 пикселей');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await axios.post(`${apiUrl}/api/users/${userId}/avatar/add`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Update avatar preview with the correct path
        setAvatarPreview(`/${response.data.avatar}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
      }
    };
  };

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Настройки профиля</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            title="Home"
          >
            <FaHome size={20} />
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            title="Dashboard"
          >
            <FaTachometerAlt size={20} />
          </button>
        </div>
      </header>
      <div className="flex flex-col items-center mt-8">
        <div className="relative mb-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Аватар"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle size={128} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2 lg:w-1/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Основная информация</h2>
            <FaEdit size={20} className="text-gray-500 cursor-pointer" title="Edit Profile" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Имя пользователя:</label>
            <input
              type="text"
              value={userData.username}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="text"
              value={userData.email}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Пароль:</label>
            <input
              type="password"
              value="********"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Дата создания:</label>
            <p className="text-gray-900">{new Date(userData.createdAt).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;