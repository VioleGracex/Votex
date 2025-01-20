import React, { useState, useRef, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';

const Post = ({ post, onEdit, onDelete, onUpvote, onDownvote }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const handleUpvote = () => {
    onUpvote(post.postId);
  };

  const handleDownvote = () => {
    onDownvote(post.postId);
  };

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent triggering any parent click handlers
    setMenuVisible(prev => !prev);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent triggering any parent click handlers
    onEdit(post.postId);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering any parent click handlers
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
            aria-label="Toggle menu"
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
          <div className="relative group">
            <button
              onClick={handleUpvote}
              className="text-green-600 hover:text-green-800"
              aria-label="Upvote"
            >
              <FaThumbsUp size={20} />
            </button>
            <span className="absolute bottom-full mb-2 bg-gray-700 text-white text-xs rounded-lg p-1 hidden group-hover:block">
              Upvote
            </span>
            <span className="ml-2">{post.upvotes}</span>
          </div>
          <div className="relative group">
            <button
              onClick={handleDownvote}
              className="text-red-600 hover:text-red-800"
              aria-label="Downvote"
            >
              <FaThumbsDown size={20} />
            </button>
            <span className="absolute bottom-full mb-2 bg-gray-700 text-white text-xs rounded-lg p-1 hidden group-hover:block">
              Downvote
            </span>
            <span className="ml-2">{post.downvotes}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()} | {post.createdBy}
        </div>
      </div>
    </div>
  );
};

export default Post;