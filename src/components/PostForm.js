import React, { useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const PostForm = ({ title, content, category, setTitle, setContent, setCategory, onSubmit, submitLabel, onClose }) => {
  const formRef = useRef(null);

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={formRef} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-4 sm:mx-6 lg:mx-8 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center">{submitLabel}</h2>
        <input
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows="4"
          placeholder="Напишите ваше сообщение здесь..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Категория"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200"
          onClick={onSubmit}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default PostForm;