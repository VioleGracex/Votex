import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { FaTimes } from 'react-icons/fa';
import { fetchUsername } from '../utils/fetchUsername';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EditVotePageForm = ({ votePage, onClose, onUpdate }) => {
  const [name, setName] = useState(votePage.name);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [creatorUsername, setCreatorUsername] = useState('');
  const storedUserId = localStorage.getItem("userId");
  const formRef = useRef(null); // Reference to the form container

  useEffect(() => {
    const fetchUsernames = async () => {
      const promises = votePage.users.map(userId => fetchUsername(userId));
      const usernames = await Promise.all(promises);
      const usersWithNames = votePage.users.map((userId, index) => ({
        userId,
        username: usernames[index],
      })).filter(user => user.userId !== votePage.createdBy);

      setSelectedUsers(usersWithNames);
    };

    const fetchCreatorUsername = async () => {
      const username = await fetchUsername(votePage.createdBy);
      setCreatorUsername(username);
    };

    fetchCreatorUsername();
    fetchUsernames();
  }, [votePage.createdBy, votePage.users]);

  const fetchUserSuggestions = async (query) => {
    if (query.length < 2) {
      setUserSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/api/users/suggestions`, {
        params: { query },
        headers: { 'user-id': storedUserId }
      });

      // Filter out already selected users and the creator
      const suggestions = response.data.filter(user => 
        user.userId !== votePage.createdBy && 
        !selectedUsers.some(selectedUser => selectedUser.userId === user.userId)
      );
      setUserSuggestions(suggestions);
    } catch (error) {
      console.error('Ошибка при получении предложений пользователей:', error);
    }
  };

  // Debounce the fetchUserSuggestions function to avoid rapid requests
  const debouncedFetchUserSuggestions = useCallback(debounce(fetchUserSuggestions, 300), [selectedUsers]);

  const handleUserSearch = (query) => {
    debouncedFetchUserSuggestions(query);
  };

  const handleUserSelect = (user) => {
    if (!selectedUsers.some(u => u.userId === user.userId)) {
      setSelectedUsers([...selectedUsers, { userId: user.userId, username: user.username }]);
      setUserSuggestions([]);
    }
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.userId !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!storedUserId) {
      console.error('ID пользователя не найден в локальном хранилище.');
      alert('ID пользователя не найден. Пожалуйста, войдите в систему и попробуйте снова.');
      return;
    }

    try {
      const userIds = [storedUserId, ...selectedUsers.map(user => user.userId)];
      const updatedVotePage = {
        votePageId: votePage.votePageId,
        name,
        users: userIds,
      };

      await axios.post(`${apiUrl}/api/votepages/${storedUserId}/add`, updatedVotePage, {
        headers: {
          'user-id': storedUserId,
          'Authorization': `Bearer ${token}`
        }
      });
      onUpdate(updatedVotePage); // Pass the updated vote page to the parent component
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении страницы голосования:', error);
      alert('Ошибка при обновлении страницы голосования. Пожалуйста, попробуйте снова.');
    }
  };

  // Handle clicks outside the form container
  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div ref={formRef} className="bg-white p-6 rounded-lg relative z-50 w-full max-w-3xl md:max-w-2xl sm:max-w-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-black">
          <FaTimes />
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label htmlFor="name" className="block mb-2 text-lg font-semibold">Название страницы голосования</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="form-group mb-6">
            <label htmlFor="userSearch" className="block mb-2 text-lg font-semibold">Добавить пользователей</label>
            <input
              type="text"
              id="userSearch"
              placeholder="Начните вводить имя пользователя"
              onChange={(e) => handleUserSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {userSuggestions.length > 0 ? (
              <ul className="border border-gray-300 rounded-lg mt-2 max-h-40 overflow-y-auto">
                {userSuggestions.map(user => (
                  <li
                    key={user.userId}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    {user.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-600">Пользователи не найдены</p>
            )}
          </div>
          {selectedUsers.length > 0 && (
            <div className="form-group mb-6">
              <h4 className="mb-2 text-lg font-semibold">Выбранные пользователи:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedUsers.map(user => (
                  <li key={user.userId} className="p-3 border border-gray-300 rounded-lg flex justify-between items-center">
                    {user.username}
                    <button onClick={() => handleUserRemove(user.userId)} className="text-red-500 hover:text-red-700">
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Обновить страницу голосования
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVotePageForm;