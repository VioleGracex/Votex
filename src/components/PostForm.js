import React, { useRef, useEffect } from 'react';

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
    <div ref={formRef} className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-4">{submitLabel}</h2>
      <input
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4"
        rows="4"
        placeholder="Напишите ваше сообщение здесь..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Категория"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        onClick={onSubmit}
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default PostForm;