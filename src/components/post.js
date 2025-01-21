import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import { fetchUsername } from '../utils/fetchUsername';

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
        console.error('Ошибка при получении имени пользователя:', error);
      }
    };

    fetchData();
    fetchVotes();
  }, [post.createdBy, post.postId]);

  const fetchVotes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/votes/${post.postId}`);
      setVotes(response.data);

      // Проверить, голосовал ли текущий пользователь, и установить состояние userVote
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
      if (userVote === voteType) {
        // Если пользователь уже проголосовал таким образом, удалить голос (разголосовать)
        const existingVote = votes.find(vote => vote.userId === storedUserId && vote.voteType === voteType);
        if (existingVote) {
          await axios.delete(`${apiUrl}/api/votes/${existingVote.id}/delete`);
          setUserVote(null);
        }
      } else {
        // В противном случае, проголосовать
        await axios.post(`${apiUrl}/api/votes/cast`, {
          postId: post.postId,
          userId: storedUserId,
          votePageId: post.votePageId,
          voteType,
        });
        setUserVote(voteType);
      }
      fetchVotes(); // Обновить голоса после голосования/разголосования
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
    <div className="bg-white shadow-lg rounded-lg p-6 relative mb-6 transition-all duration-200 transform hover:scale-105">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Переключить меню"
          >
            <FaEllipsisV size={20} />
          </button>
          {menuVisible && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
      <p className="text-gray-700 mt-2">{post.description}</p>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <button
              onClick={() => castVote(1)}
              className={`flex items-center px-3 py-1 rounded-l-full transition-all duration-200 ${userVote === 1 ? 'bg-green-700 text-white' : 'bg-green-500 text-white hover:bg-green-700'}`}
              aria-label="Голосовать за"
            >
              <FaArrowUp size={20} />
              <span className="ml-2">{votes.filter(vote => vote.voteType === 1).length}</span>
            </button>
            <button
              onClick={() => castVote(0)}
              className={`flex items-center px-3 py-1 rounded-r-full transition-all duration-200 ${userVote === 0 ? 'bg-red-700 text-white' : 'bg-red-500 text-white hover:bg-red-700'}`}
              aria-label="Голосовать против"
            >
              <FaArrowDown size={20} />
              <span className="ml-2">{votes.filter(vote => vote.voteType === 0).length}</span>
            </button>
          </div>
        </div>
        <div className="ml-auto sm:ml-0 text-right sm:text-left flex flex-col sm:flex-row sm:space-y-0 sm:space-x-1 text-sm text-gray-500">
          <div>{new Date(post.createdAt).toLocaleDateString()}</div>
          <div className='hidden lg:block '>|</div>
          <div>{username}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;