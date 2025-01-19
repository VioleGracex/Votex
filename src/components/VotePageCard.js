import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FiMoreVertical } from 'react-icons/fi';
import { FaUser, FaFileAlt, FaVoteYea } from 'react-icons/fa';

const VotePageCard = ({ votePage, onEdit, onDelete }) => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

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
      className="relative p-4 border border-gray-300 rounded-lg hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer z-10"
      onClick={handleClick}
    >
      <h3 className="text-lg mb-2 text-blue-600">{votePage.name}</h3>
      <div className="absolute top-2 right-2 z-20" ref={menuRef}>
        <button
          className="block text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full transform hover:scale-110 transition"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <FiMoreVertical />
        </button>
        {menuVisible && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-30">
            <button 
              onClick={handleEdit} 
              className="block px-4 py-2 text-left w-full hover:bg-gray-100"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete} 
              className="block px-4 py-2 text-left w-full hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="absolute bottom-2 right-2 flex space-x-4 text-xs text-gray-600 z-10">
        <div className="flex items-center space-x-1 group relative">
          <FaUser />
          <p>{votePage.users?.length || 0}</p>
          <span className="absolute bottom-full mb-1 bg-gray-700 text-white text-xs rounded-lg p-1 hidden group-hover:block">Users</span>
        </div>
        <div className="flex items-center space-x-1 group relative">
          <FaFileAlt />
          <p>{votePage.postsCount || 0}</p>
          <span className="absolute bottom-full mb-1 bg-gray-700 text-white text-xs rounded-lg p-1 hidden group-hover:block">Posts</span>
        </div>
        <div className="flex items-center space-x-1 group relative">
          <FaVoteYea />
          <p>{votePage.votesCount || 0}</p>
          <span className="absolute bottom-full mb-1 bg-gray-700 text-white text-xs rounded-lg p-1 hidden group-hover:block">Votes</span>
        </div>
      </div>
    </div>
  );
};

export default VotePageCard;