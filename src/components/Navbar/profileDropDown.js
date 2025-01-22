import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProfileDropDown = ({ handleLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
        console.log(response.data); 
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

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsProfileMenuOpen(false); // Close the menu after navigation
  };

  return (
    <div className="relative">
      <button
        onClick={toggleProfileMenu}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Аватар"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <FaUser size={20} />
        )}
      </button>
      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md overflow-hidden">
          <button
            onClick={() => handleNavigation('/profile')}
            className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            Профиль
          </button>
          <button
            onClick={() => handleNavigation('/settings')}
            className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            Настройки
          </button>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown;