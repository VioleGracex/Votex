import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import VotePageCard from "../components/VotePageCard";
import CreateVotePageForm from "../components/CreateVotePageForm";
import ProfileDropDown from "../components/Navbar/ProfileDropDown";
import {
  checkIfLoggedIn,
  checkIfLoggedInKick,
  handleLogout,
} from "../utils/authHelpers";
import "../app/globals.css";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [votePages, setVotePages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isCreatingVotePage, setIsCreatingVotePage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIfLoggedInKick();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const storedUserId = localStorage.getItem("userId");
        const storedUsername = localStorage.getItem("username");
        setUserId(storedUserId);
        setUsername(storedUsername);
      } else {
        handleLogout();
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const votePagesResponse = await axios.get(
          `${apiUrl}/api/votepages/${userId}`
        );
        setVotePages(votePagesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        alert("Ошибка при получении данных. Пожалуйста, попробуйте снова.");
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCreateVotePage = (votePage) => {
    setVotePages([...votePages, votePage]);
  };

  const handleEditVotePage = (votePageId) => {
    alert(`Редактировать страницу голосования: ${votePageId}`);
  };

  const handleDeleteVotePage = async (votePageId) => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить эту страницу голосования?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${apiUrl}/api/votepages/${votePageId}`);
      setVotePages(votePages.filter((vp) => vp.votePageId !== votePageId));
    } catch (error) {
      console.error("Ошибка при удалении страницы голосования:", error);
      alert(
        "Ошибка при удалении страницы голосования. Пожалуйста, попробуйте снова."
      );
    }
  };

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVotePages = votePages.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(votePages.length / itemsPerPage);

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

  // Calculate unique users
  const uniqueUsers = new Set();
  votePages.forEach((vp) => {
    vp.users.forEach((user) => uniqueUsers.add(user.userId));
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Загрузка...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        Пользователь не вошел в систему. Пожалуйста, войдите в систему.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="flex justify-between items-center py-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Панель управления</h1>
        <ProfileDropDown handleLogout={handleLogout} />
      </header>

      <main className="mt-8">
        {/* User Greeting and Profile Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Добро пожаловать, {username}!
          </h2>
          <p className="text-gray-600">
            Ваши страницы голосования и активность представлены ниже.
          </p>
        </section>

        {/* Statistics and Summary */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Статистика</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">
                Всего страниц голосования
              </h3>
              <p className="text-2xl">{votePages.length}</p>
            </div>
            <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Активные голосования</h3>
              <p className="text-2xl">
                {votePages.filter((vp) => vp.status === 1).length}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Завершенные голосования</h3>
              <p className="text-2xl">
                {votePages.filter((vp) => vp.status === 0).length}
              </p>
            </div>
            <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Пользователи</h3>
              <p className="text-2xl">{uniqueUsers.size}</p>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="mb-10">
          <input
            type="text"
            placeholder="Поиск страниц голосования..."
            className="w-full p-4 border border-gray-300 rounded-lg"
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </section>

        {/* Vote Pages */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Ваши страницы голосования
            </h2>
            <button
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => setIsCreatingVotePage(true)}
            >
              <FiPlus size={20} className="mr-2" />
              Создать новую
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentVotePages
              .filter((votePage) =>
                votePage.name.toLowerCase().includes(searchQuery)
              )
              .map((votePage) => (
                <VotePageCard
                  key={votePage.votePageId}
                  votePage={votePage}
                  onEdit={() => handleEditVotePage(votePage.votePageId)}
                  onDelete={() => handleDeleteVotePage(votePage.votePageId)}
                />
              ))}
          </div>
        </section>

        {isCreatingVotePage && (
          <CreateVotePageForm
            onClose={() => setIsCreatingVotePage(false)}
            onCreate={handleCreateVotePage}
          />
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          {currentPage > 1 && (
            <button
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              onClick={handlePreviousPage}
            >
              <FiArrowLeft size={20} />
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
              <FiArrowRight size={20} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;