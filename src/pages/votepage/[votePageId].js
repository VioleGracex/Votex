import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const VotePage = () => {
  const router = useRouter();
  const { votePageId } = router.query; // Получить параметр динамического маршрута
  const [votePage, setVotePage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Получить данные страницы голосования при монтировании компонента или изменении votePageId
  useEffect(() => {
    const fetchVotePageData = async () => {
      try {
        console.log(votePageId);
        const response = await axios.get(`${apiUrl}/api/votepages/${votePageId}/posts`);
        setVotePage(response.data.votePage || {});
        setPosts(response.data.posts || []);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении данных страницы голосования:', error);
        setLoading(false);
      }
    };

    if (votePageId) {
      fetchVotePageData();
    }
  }, [votePageId]);

  const handleAddPost = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/posts`, {
        votePageId: votePageId,
        content: newPostContent,
      });
      setPosts([...posts, response.data]);
      setNewPostContent('');
    } catch (error) {
      console.error('Ошибка при добавлении сообщения:', error);
      alert('Ошибка при добавлении сообщения. Попробуйте снова.');
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
          className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200"
          onClick={() => router.push('/dashboard')}
        >
          Вернуться на панель управления
        </button>
      </div>

      {/* Основное содержание */}
      <div className="container mx-auto p-4">
        {/* Добавить сообщение */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Добавить новое сообщение</h2>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows="4"
            placeholder="Напишите ваше сообщение здесь..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddPost}
          >
            Добавить сообщение
          </button>
        </div>

        {/* Список сообщений */}
        <div className="grid gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
                <p className="text-gray-800">{post.content}</p>
                <div className="text-sm text-gray-500 mt-2">
                  Опубликовано {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
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