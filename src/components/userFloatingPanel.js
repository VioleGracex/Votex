import React from 'react';
import { FaUserCircle, FaUsers } from 'react-icons/fa';

const UserFloatingPanel = ({ users, showUserMenu, setShowUserMenu }) => {
  return (
    <div className="fixed bottom-4 right-4 w-full max-w-xs">
      <button
        className="bg-blue-600 text-white w-full px-6 py-3 rounded-lg shadow hover:bg-blue-700 flex items-center justify-between"
        onClick={() => setShowUserMenu(!showUserMenu)}
      >
        <span className="flex items-center">
          <FaUsers className="mr-2" /> Пользователи
        </span>
        <span>{showUserMenu ? '▲' : '▼'}</span>
      </button>
      <div
        className={`absolute bottom-full right-0 mb-2 bg-white shadow-md rounded-lg p-4 w-full transition-transform transform ${
          showUserMenu ? 'scale-y-100' : 'scale-y-0'
        } origin-bottom`}
      >
        <div className="flex flex-col">
          {users.length ? (
            users.map((user) => (
              <div key={user.userId} className="flex items-center mb-2">
                <FaUserCircle size={24} className="text-gray-600" />
                <span className="ml-2">{user.username}</span>
                <span className="ml-auto bg-gray-400 h-3 w-3 rounded-full"></span>
              </div>
            ))
          ) : (
            <p className="text-gray-800">Нет пользователей</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFloatingPanel;