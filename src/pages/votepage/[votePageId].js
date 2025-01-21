import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaHome, FaPlusCircle, FaFilter } from 'react-icons/fa';
import UserFloatingPanel from '../../components/UserFloatingPanel';
import PostForm from '../../components/PostForm';
import Post from '../../components/Post';
import FilterOptions from '../../components/FilterOptions';
import { fetchVotePageData } from '../../utils/fetchVotePageData';
import { checkIfLoggedInKick } from '../../utils/authHelpers';
import { fetchUsername } from '../../utils/fetchUsername';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const filterOptions = [
  { name: 'showVotes', label: 'Показывать голоса' },
  { name: 'showCreator', label: 'Показывать создателя' },
  { name: 'showUpdatedBy', label: 'Показывать обновлено' },
  { name: 'showCategory', label: 'Показывать категорию' },
  { name: 'showStatus', label: 'Показывать статус' },
];

const VotePage = () => {
  const router = useRouter();
  const { votePageId } = router.query;
  const [votePage, setVotePage] = useState(null);
  const [creatorUsername, setCreatorUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [postId, setPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [filters, setFilters] = useState({
    showVotes: true,
    showCreator: true,
    showUpdatedBy: true,
    showCategory: true,
    showStatus: true,
    sortBy: 'mostVotes', // Add sortBy filter
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setCreatorUsername(await fetchUsername(data.author.userId));

        if (!data.users.includes(storedUserId)) {
          alert('У вас нет доступа к этой странице. Свяжитесь с владельцем, чтобы получить доступ.');
          router.push('/dashboard');
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

  const handleSubmitPost = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (!users.includes(storedUserId)) {
        throw new Error('User not found');
      }
      const response = await axios.post(`${apiUrl}/api/posts/add`, {
        postId,
        title: postTitle,
        description: postContent,
        createdBy: storedUserId,
        votePageId,
        category: postCategory,
      });
      if (postId) {
        setPosts(posts.map(post => (post.postId === postId ? response.data : post)));
      } else {
        setPosts([...posts, response.data]);
      }
      setPostTitle('');
      setPostContent('');
      setPostCategory('');
      setPostId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Ошибка при добавлении или редактировании сообщения:', error);
      alert('Ошибка при добавлении или редактировании сообщения. Попробуйте снова.');
    }
  };

  const openModal = (post = null) => {
    if (post) {
      setPostTitle(post.title);
      setPostContent(post.description);
      setPostCategory(post.category);
      setPostId(post.postId);
    } else {
      setPostTitle('');
      setPostContent('');
      setPostCategory('');
      setPostId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sortBy: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${apiUrl}/api/posts/${postId}/delete`);
      setPosts(posts.filter(post => post.postId !== postId));
    } catch (error) {
      console.error('Ошибка при удалении сообщения:', error);
      alert('Ошибка при удалении сообщения. Попробуйте снова.');
    }
  };

  const filteredPosts = posts
    .filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (filters.sortBy === 'mostVotes') {
        return b.votes.length - a.votes.length;
      } else if (filters.sortBy === 'mostUpvotes') {
        return b.votes.filter(vote => vote.voteType === 1).length - a.votes.filter(vote => vote.voteType === 1).length;
      } else if (filters.sortBy === 'mostDownvotes') {
        return b.votes.filter(vote => vote.voteType === 0).length - a.votes.filter(vote => vote.voteType === 0).length;
      }
      return 0;
    });

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (!votePage) {
    return <div className="flex justify-center items-center h-screen">Страница голосования не найдена</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Заголовок */}
      <div className="relative bg-blue-600 h-64 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white">{votePage.name}</h1>
        <p className="text-sm text-white mt-2">Создано: {creatorUsername}</p>
        <button
          className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200 flex items-center"
          onClick={() => router.push('/dashboard')}
        >
          <FaHome className="mr-2" /> Вернуться на панель управления
        </button>
      </div>

      {/* Основное содержание */}
      <div className="container mx-auto p-4">
        {/* Search and Filter Container */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              className="bg-white text-blue-600 p-2 rounded shadow hover:bg-gray-200 flex items-center"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FaFilter className="mr-2" /> Фильтр
            </button>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button
            className="bg-blue-600 text-white p-2 rounded shadow hover:bg-blue-700 flex items-center"
            onClick={() => openModal()}
          >
            <FaPlusCircle className="mr-2" /> Добавить сообщение
          </button>
        </div>

        {showFilter && (
          <FilterOptions
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        )}

        <UserFloatingPanel users={users} showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} />

        {/* Список сообщений */}
        <div className="grid gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Post
                key={post.postId}
                post={post}
                onEdit={() => openModal(post)}
                onDelete={() => handleDeletePost(post.postId)}
              />
            ))
          ) : (
            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-gray-800">Сообщений нет</p>
            </div>
          )}
        </div>
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <PostForm
              title={postTitle}
              content={postContent}
              category={postCategory}
              setTitle={setPostTitle}
              setContent={setPostContent}
              setCategory={setPostCategory}
              onSubmit={handleSubmitPost}
              submitLabel={postId ? "Редактировать сообщение" : "Добавить сообщение"}
              onClose={closeModal} // Pass the close function
            />
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={closeModal}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotePage;