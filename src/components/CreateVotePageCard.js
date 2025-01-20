import React from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const VotePageCard = ({ votePage, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{votePage.title}</h3>
        <p className="text-gray-600 mt-2">{votePage.description}</p>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          className="flex items-center text-indigo-500 hover:text-indigo-800"
          onClick={onEdit}
        >
          <FiEdit className="mr-1" /> Редактировать
        </button>
        <button
          className="flex items-center text-red-500 hover:text-red-800"
          onClick={onDelete}
        >
          <FiTrash className="mr-1" /> Удалить
        </button>
      </div>
    </div>
  );
};

export default VotePageCard;