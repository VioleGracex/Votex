import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FiPlus, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import VotePageCard from "../components/VotePageCard";
import CreateVotePageForm from "../components/CreateVotePageForm";
import EditVotePageForm from "../components/EditVotePageForm";
import ProfileDropDown from "../components/Navbar/profileDropDown";
import { checkIfLoggedInKick, handleLogout } from "../utils/authHelpers";
import "../app/globals.css";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const router = useRouter();
  const [votePages, setVotePages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isCreatingVotePage, setIsCreatingVotePage] = useState(false);
  const [isEditingVotePage, setIsEditingVotePage] = useState(false);
  const [votePageToEdit, setVotePageToEdit] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const calculateUniqueUsers = (votePages) => {
    const uniqueUsers = new Set();
    votePages.forEach((vp) => {
      if (vp && vp.users) {
        vp.users.forEach((user) => uniqueUsers.add(user));
      }
    });
    return uniqueUsers.size;
  };

  const fetchVotePages = async () => {
    if (!userId) return;

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
    fetchVotePages();
  }, [userId]);

  const handleCreateVotePage = async (votePage) => {
    try {
      await axios.post(`${apiUrl}/api/votepages/${userId}/add`, votePage);
      fetchVotePages(); // Refetch the vote pages after creating a new one
    } catch (error) {
      console.error("Ошибка при создании страницы голосования:", error);
      alert(
        "Ошибка при создании страницы голосования. Пожалуйста, попробуйте снова."
      );
    }
  };

  const handleEditVotePage = (votePageId) => {
    const votePage = votePages.find((vp) => vp.votePageId === votePageId);
    setVotePageToEdit(votePage);
    setIsEditingVotePage(true);
  };

  const handleUpdateVotePage = (updatedVotePage) => {
    setVotePages(
      votePages.map((vp) =>
        vp.votePageId === updatedVotePage.votePageId ? updatedVotePage : vp
      )
    );
  };

  const handleDeleteVotePage = async (votePageId) => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить эту страницу голосования?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `${apiUrl}/api/votepages/${userId}/${votePageId}/delete`
      );
      fetchVotePages(); // Refetch the vote pages after deleting one
    } catch (error) {
      console.error("Ошибка при удалении страницы голосования:", error);
      alert(
        "Ошибка при удалении страницы голосования. Пожалуйста, попробуйте снова."
      );
    }
  };

  // Filter vote pages based on search query
  const filteredVotePages = votePages.filter((votePage) =>
    votePage.name.toLowerCase().includes(searchQuery)
  );

  // Calculate paginated data based on filtered vote pages
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVotePages = filteredVotePages.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredVotePages.length / itemsPerPage);

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
  const uniqueUsersCount = calculateUniqueUsers(votePages);

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
    <div className="max-w-screen-xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <header className="flex justify-between items-center py-4 md:py-6 border-b border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Панель управления
        </h1>
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            onClick={() => router.push("/")}
          >
            <FaHome size={20} />
          </button>
          <ProfileDropDown handleLogout={handleLogout} />
        </div>
      </header>

      <main className="mt-6 md:mt-8">
        {/* User Greeting and Profile Information */}
        <section className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Добро пожаловать, {username}!
          </h2>
          <p className="text-gray-600">
            Ваши страницы голосования и активность представлены ниже.
          </p>
        </section>

        {/* Statistics and Summary */}
        <section className="mb-8 md:mb-10">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Статистика
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            <div className="bg-blue-100 text-blue-800 p-3 md:p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Всего страниц</h3>
              <p className="text-2xl">{votePages.length}</p>
            </div>
            <div className="bg-green-100 text-green-800 p-3 md:p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Активные</h3>
              <p className="text-2xl">
                {votePages.filter((vp) => vp.status === 1).length}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 p-3 md:p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Завершенные</h3>
              <p className="text-2xl">
                {votePages.filter((vp) => vp.status === 0).length}
              </p>
            </div>
            <div className="bg-red-100 text-red-800 p-3 md:p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Пользователи</h3>
              <p className="text-2xl">{uniqueUsersCount}</p>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="mb-8 md:mb-10">
          <input
            type="text"
            placeholder="Поиск страниц..."
            className="w-full p-3 md:p-4 border border-gray-300 rounded-lg"
            onChange={(e) => {
              setSearchQuery(e.target.value.toLowerCase());
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </section>

        {/* Vote Pages */}
        <section className="mb-8 md:mb-10">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Ваши страницы голосования
            </h2>
            <button
              className="flex items-center justify-center bg-blue-500 text-white w-12 h-12 md:w-auto md:px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => setIsCreatingVotePage(true)}
            >
              <FiPlus size={20} />
              <span className="hidden sm:inline md:ml-2">Создать новую</span>
            </button>
          </div>

          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentVotePages.map((votePage, index) => (
              <VotePageCard
                key={votePage.votePageId}
                votePage={votePage}
                onEdit={() => handleEditVotePage(votePage.votePageId)}
                onDelete={() => handleDeleteVotePage(votePage.votePageId)}
                zIndex={currentVotePages.length - index}
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

        {isEditingVotePage && votePageToEdit && (
          <EditVotePageForm
            votePage={votePageToEdit}
            onClose={() => setIsEditingVotePage(false)}
            onUpdate={handleUpdateVotePage}
          />
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 md:mt-6 space-x-4">
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
