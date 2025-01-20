import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaHome, FaPlusCircle, FaFilter } from 'react-icons/fa';
import UserFloatingPanel from '../../components/UserFloatingPanel';
import { fetchVotePageData } from '../../utils/fetchVotePageData'; // Import the helper function
import { checkIfLoggedInKick } from '../../utils/authHelpers'; // Import the helper function
import Post from '../../components/post';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const VotePage = () => {
  const router = useRouter();
  const { votePageId } = router.query;
  const [votePage, setVotePage] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [filters, setFilters] = useState({
    showVotes: true,
    showCreator: true,
    showUpdatedBy: true,
    showCategory: true,
    showStatus: true,
  });

  useEffect(() => {
    const checkPermission = async () => {
      const loggedIn = await checkIfLoggedInKick();
      if (!loggedIn) {
        router.push('/');
        return;
      }

      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        router.push('/');
        return;
      }

      try {
        const data = await fetchVotePageData(votePageId);
        setVotePage(data || {});
        setPosts(data.posts || []);
        setUsers(data.users || []);
        
        const user = data.users.find(user => user.userId === storedUserId);
        if (!user) {
          alert('У вас нет доступа к этой странице. Свяжитесь с владельцем, чтобы получить доступ.');
          router.push('/');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении данных страницы голосования:', error);
        setLoading(false);
      }
    };

    if (votePageId) {
      checkPermission();
    }
  }, [votePageId]);

  const handleAddPost = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      const user = users.find(user => user.userId === storedUserId);
      if (!user) {
        throw new Error('User not found');
      }
      const response = await axios.post(`${apiUrl}/api/posts/add`, {
        title: newPostTitle,
        description: newPostContent,
        createdBy: storedUserId,  // Use the user ID for createdBy
        votePageId,               // Pass the votePageId directly
        category: newPostCategory,
      });
      setPosts([...posts, response.data]);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('');
    } catch (error) {
      console.error('Ошибка при добавлении сообщения:', error);
      alert('Ошибка при добавлении сообщения. Попробуйте снова.');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.checked });
  };

  const handleUpvote = async (postId) => {
    try {
      await axios.post(`${apiUrl}/api/posts/${postId}/upvote`);
      // Update the post's upvotes count in the state
      setPosts(posts.map(post => post.postId === postId ? { ...post, upvotes: post.upvotes + 1 } : post));
    } catch (error) {
      console.error('Ошибка при голосовании за сообщение:', error);
      alert('Ошибка при голосовании за сообщение. Попробуйте снова.');
    }
  };

  const handleDownvote = async (postId) => {
    try {
      await axios.post(`${apiUrl}/api/posts/${postId}/downvote`);
      // Update the post's downvotes count in the state
      setPosts(posts.map(post => post.postId === postId ? { ...post, downvotes: post.downvotes + 1 } : post));
    } catch (error) {
      console.error('Ошибка при голосовании против сообщения:', error);
      alert('Ошибка при голосовании против сообщения. Попробуйте снова.');
    }
  };

  const handleEditPost = (postId) => {
    // Implement edit post functionality
    console.log(`Editing post with ID: ${postId}`);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${apiUrl}/api/posts/${postId}`);
      setPosts(posts.filter(post => post.postId !== postId));
    } catch (error) {
      console.error('Ошибка при удалении сообщения:', error);
      alert('Ошибка при удалении сообщения. Попробуйте снова.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (!votePage) {
    return <div className="flex justify-center items-center h-screen">Страница голосования не найдена</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Заголовок */}
      <div className="relative bg-blue-600 h-64 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">{votePage.name}</h1>
        <button
          className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200 flex items-center"
          onClick={() => router.push('/dashboard')}
        >
          <FaHome className="mr-2" /> Вернуться на панель управления
        </button>
      </div>

      {/* Основное содержание */}
      <div className="container mx-auto p-4">
        {/* Фильтр */}
        <div className="relative mb-6">
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200 flex items-center"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter className="mr-2" /> Фильтр
          </button>
          {showFilter && (
            <div className="absolute bg-white shadow-md rounded-lg p-4 mt-2">
              <label className="block mb-2">
                <input
                  type="checkbox"
                  name="showVotes"
                  checked={filters.showVotes}
                  onChange={handleFilterChange}
                />{' '}
                Показывать голоса
              </label>
              <label className="block mb-2">
                <input
                  type="checkbox"
                  name="showCreator"
                  checked={filters.showCreator}
                  onChange={handleFilterChange}
                />{' '}
                Показывать создателя
              </label>
              <label className="block mb-2">
                <input
                  type="checkbox"
                  name="showUpdatedBy"
                  checked={filters.showUpdatedBy}
                  onChange={handleFilterChange}
                />{' '}
                Показывать обновлено
              </label>
              <label className="block mb-2">
                <input
                  type="checkbox"
                  name="showCategory"
                  checked={filters.showCategory}
                  onChange={handleFilterChange}
                />{' '}
                Показывать категорию
              </label>
              <label className="block mb-2">
                <input
                  type="checkbox"
                  name="showStatus"
                  checked={filters.showStatus}
                  onChange={handleFilterChange}
                />{' '}
                Показывать статус
              </label>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
                onClick={() => setShowFilter(false)}
              >
                Применить
              </button>
            </div>
          )}
        </div>

        <UserFloatingPanel users={users} showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} />

        {/* Добавить сообщение */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Добавить новое сообщение</h2>
          <input
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Заголовок"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows="4"
            placeholder="Напишите ваше сообщение здесь..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <input
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Категория"
            value={newPostCategory}
            onChange={(e) => setNewPostCategory(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            onClick={handleAddPost}
          >
            <FaPlusCircle className="mr-2" /> Добавить сообщение
          </button>
        </div>

        {/* Список сообщений */}
        <div className="grid gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.postId}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
              />
            ))
          ) : (
            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-gray-800">Сообщений нет</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotePage;