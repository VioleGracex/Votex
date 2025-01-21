import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaPlusCircle, FaFilter, FaUser, FaArrowLeft } from 'react-icons/fa';
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
        setUsers(data.users || []);
        setCreatorUsername(await fetchUsername(data.author.userId));

        const postsWithUsernames = await Promise.all(
          (data.posts || []).map(async (post) => {
            const username = await fetchUsername(post.createdBy);
            return { ...post, creatorUsername: username };
          })
        );
        setPosts(postsWithUsernames);

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
      const username = await fetchUsername(storedUserId);
      const newPost = { ...response.data, creatorUsername: username };
      if (postId) {
        setPosts(posts.map(post => (post.postId === postId ? newPost : post)));
      } else {
        setPosts([...posts, newPost]);
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

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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
      <div className="relative bg-blue-600 h-64 flex flex-col items-center justify-center">
        <button
          className="absolute top-4 left-4 bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200 flex items-center"
          onClick={() => router.push('/dashboard')}
        >
          <FaArrowLeft className="mr-2" /> <span className="hidden md:inline">Вернуться на панель управления</span>
        </button>
        <h1 className="text-4xl font-bold text-white">{votePage.name}</h1>
        <p className="text-sm text-white mt-2">Создано: {creatorUsername}</p>
      </div>

      {/* Основное содержание */}
      <div className="container mx-auto px-4 py-8 max-w-screen-xl">
        {/* Search and Filter Container */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              className="bg-white text-blue-600 p-2 rounded shadow hover:bg-gray-200 flex items-center"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FaFilter className="mr-2" /> <span className="hidden md:inline">Фильтр</span>
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
            className="bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 flex items-center justify-center w-10 h-10 md:w-auto md:h-auto"
            onClick={() => openModal()}
          >
            <FaPlusCircle className="md:mr-2" /> <span className="hidden md:inline">Добавить предложение</span>
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
        <div className="grid gap-6 max-w-3xl mx-auto">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
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

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          {currentPage > 1 && (
            <button
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              onClick={handlePreviousPage}
            >
              <FaArrowLeft size={20} />
            </button>
          )}
          <span className="text-gray-700">
            Страница {currentPage} из {totalPages}
          </span>
          {currentPage < totalPages && (
            <button
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              onClick={handleNextPage}
            >
              <FaArrowRight size={20} />
            </button>
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