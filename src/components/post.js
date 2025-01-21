import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import { fetchUsername } from '../utils/fetchUsername'; // Import the fetchUsername function

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const Post = ({ post, onEdit, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [userVote, setUserVote] = useState(null);
  const [votes, setVotes] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = await fetchUsername(post.createdBy);
        setUsername(username);
      } catch (error) {
        // Handle error if needed
      }
    };

    fetchData();
    fetchVotes();
  }, [post.createdBy, post.postId]);

  const fetchVotes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/votes/${post.postId}`);
      setVotes(response.data);
      
      // Check if the current user has already voted and set the userVote state
      const storedUserId = localStorage.getItem("userId");
      const existingUserVote = response.data.find(vote => vote.userId === storedUserId);
      if (existingUserVote) {
        setUserVote(existingUserVote.voteType);
      }
    } catch (error) {
      console.error('Ошибка при получении голосов:', error);
    }
  };

  const castVote = async (voteType) => {
    const storedUserId = localStorage.getItem("userId");
    try {
      const response = await axios.post(`${apiUrl}/api/votes/cast`, {
        postId: post.postId,
        userId: storedUserId,
        votePageId: post.votePageId,
        voteType,
      });
      setUserVote(voteType);
      fetchVotes(); // Update votes after casting vote
    } catch (error) {
      console.error(`Ошибка при ${voteType === 1 ? 'голосовании за' : 'голосовании против'} поста:`, error);
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuVisible(prev => !prev);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(post.postId);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(post.postId);
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
    <div className="bg-white shadow-md rounded-lg p-4 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Переключить меню"
          >
            <FaEllipsisV size={20} />
          </button>
          {menuVisible && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 text-left w-full hover:bg-gray-100 text-gray-700"
              >
                <FaEdit className="mr-2" /> Редактировать
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 text-left w-full hover:bg-gray-100 text-red-700"
              >
                <FaTrash className="mr-2" /> Удалить
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-800 mt-2">{post.description}</p>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <div className="relative group flex items-center">
            <button
              onClick={() => castVote(1)}
              className={`flex items-center px-3 py-1 rounded-l-full ${userVote === 1 ? 'bg-green-800 text-white' : 'bg-green-600 text-white hover:bg-green-800'}`}
              aria-label="Голосовать за"
              disabled={userVote === 1}
            >
              <FaArrowUp size={20} />
              <span className="ml-2">{votes.filter(vote => vote.voteType === 1).length}</span>
            </button>
            <button
              onClick={() => castVote(0)}
              className={`flex items-center px-3 py-1 rounded-r-full ${userVote === 0 ? 'bg-red-800 text-white' : 'bg-red-600 text-white hover:bg-red-800'}`}
              aria-label="Голосовать против"
              disabled={userVote === 0}
            >
              <FaArrowDown size={20} />
              <span className="ml-2">{votes.filter(vote => vote.voteType === 0).length}</span>
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()} | {username}
        </div>
      </div>
    </div>
  );
};

export default Post;