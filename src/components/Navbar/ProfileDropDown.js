import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';

const ProfileDropDown = ({ handleLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleProfileMenu}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        <FaUser size={20} />
      </button>
      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md overflow-hidden">
          <button
            className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            Профиль
          </button>
          <button
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