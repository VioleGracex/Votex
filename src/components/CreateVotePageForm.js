import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { FaTimes } from 'react-icons/fa';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CreateVotePageForm = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const storedUserId = localStorage.getItem("userId");

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
      setUserSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
    }
  };

  // Debounce the search function to avoid rapid requests
  const debouncedFetchUserSuggestions = useCallback(debounce(fetchUserSuggestions, 300), []);

  const handleUserSearch = (query) => {
    debouncedFetchUserSuggestions(query);
  };

  const handleUserSelect = (user) => {
    if (!selectedUsers.some(u => u.userId === user.userId)) {
      setSelectedUsers([...selectedUsers, user]);
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
      console.error('User ID not found in local storage.');
      alert('User ID not found. Please log in and try again.');
      return;
    }

    try {
      const votePageId = name.toLowerCase().replace(/\s+/g, '-');
      const userIds = [storedUserId, ...selectedUsers.map(user => user.userId)]; // Prepend storedUserId

      // Create or update the vote page
      const response = await axios.post(
        `${apiUrl}/api/votepages/${storedUserId}/add`,
        {
          votePageId,
          name,
          users: userIds, // Sending user IDs as strings
        },
        {
          headers: {
            'user-id': storedUserId, // Ensure userId is sent in request headers
            'Authorization': `Bearer ${token}`
          }
        }
      );
      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating or updating vote page:', error);
      alert('Error creating or updating vote page. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg relative z-50 w-full max-w-3xl md:max-w-2xl sm:max-w-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-black">
          <FaTimes />
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label htmlFor="name" className="block mb-2 text-lg font-semibold">Vote Page Name</label>
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
            <label htmlFor="userSearch" className="block mb-2 text-lg font-semibold">Add Users</label>
            <input
              type="text"
              id="userSearch"
              placeholder="Start typing a user name"
              onChange={(e) => handleUserSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {userSuggestions && userSuggestions.length > 0 ? (
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
              <p className="mt-2 text-gray-600">No users found</p>
            )}
          </div>
          {selectedUsers.length > 0 && (
            <div className="form-group mb-6">
              <h4 className="mb-2 text-lg font-semibold">Selected Users:</h4>
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
            Create Vote Page
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVotePageForm;