import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FiMoreVertical } from 'react-icons/fi';
import { FaUser, FaFileAlt, FaVoteYea, FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';

const VotePageCard = ({ votePage, onEdit, onDelete, onLeave, zIndex }) => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const menuRef = useRef(null);

  // Check if the current user is the owner of the vote page
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsOwner(votePage.createdBy === userId);
  }, [votePage.ownerId]);

  const handleClick = () => {
    router.push(`/votepage/${votePage.votePageId}`);
  };

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent triggering the handleClick
    setMenuVisible(prev => !prev);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent triggering the handleClick
    onEdit();
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering the handleClick
    onDelete();
  };

  const handleLeave = (e) => {
    e.stopPropagation(); // Prevent triggering the handleClick
    onLeave();
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    if (menuVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuVisible]);

  return (
    <div
      className="relative p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 ease-in-out cursor-pointer hover:scale-105"
      style={{ zIndex }}
      onClick={handleClick}
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-blue-500 dark:text-gray-200 hover:underline truncate">{votePage.name}</h3>
      <div className="absolute top-4 right-4 z-50" ref={menuRef}>
        <button
          className="block text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          style={{ zIndex: 51 }}
        >
          <FiMoreVertical size={20} />
        </button>
        {menuVisible && (
          <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            {isOwner ? (
              <>
                <button 
                  onClick={handleEdit} 
                  className="flex items-center px-4 py-2 sm:px-6 sm:py-3 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FaEdit className="mr-2" /> Редактировать
                </button>
                <button 
                  onClick={handleDelete} 
                  className="flex items-center px-4 py-2 sm:px-6 sm:py-3 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-700 dark:text-gray-300"
                >
                  <FaTrash className="mr-2" /> Удалить
                </button>
              </>
            ) : (
              <button 
                onClick={handleLeave} 
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-700 dark:text-gray-300"
              >
                <FaSignOutAlt className="mr-2" /> Выйти
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4 sm:mt-6 text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2 group relative">
          <FaUser size={18} />
          <p className="truncate">{votePage.users?.length || 0}</p>
          <span className="absolute bottom-full mb-2 bg-gray-700 text-white text-xs rounded-lg p-1 hidden group-hover:block">
            Пользователи
          </span>
        </div>
        <div className="flex items-center space-x-2 group relative">
          <FaFileAlt size={18} />
          <p className="truncate">{votePage.postsCount || 0}</p>
          <span className="absolute bottom-full mb-2 bg-gray-700 text-white text-xs rounded-lg p-1 hidden group-hover:block">
            Сообщения
          </span>
        </div>
        <div className="flex items-center space-x-2 group relative">
          <FaVoteYea size={18} />
          <p className="truncate">{votePage.votesCount || 0}</p>
          <span className="absolute bottom-full mb-2 bg-gray-700 text-white text-xs rounded-lg p-1 hidden group-hover:block">
            Голоса
          </span>
        </div>
      </div>
    </div>
  );
};

export default VotePageCard;