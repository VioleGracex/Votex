import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CreateVotePageForm = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const storedUserId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!storedUserId) {
      console.error('ID пользователя не найден в локальном хранилище.');
      alert('ID пользователя не найден. Пожалуйста, войдите в систему и попробуйте снова.');
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/votepages/${storedUserId}`,
        { votePageId: name.toLowerCase().replace(/\s+/g, '-'), name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error('Ошибка создания страницы голосования:', error);
      alert('Ошибка создания страницы голосования. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg relative z-50 w-full max-w-md">
        <button onClick={onClose} className="absolute top-2 right-2 text-black">
          X
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="name" className="block mb-2">Название страницы голосования</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Создать страницу голосования
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVotePageForm;