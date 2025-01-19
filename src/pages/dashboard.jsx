import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import VotePageCard from "../components/VotePageCard";
import CreateVotePageForm from "../components/CreateVotePageForm";
import ProfileDropDown from "../components/Navbar/ProfileDropDown";
import "../app/globals.css";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [votePages, setVotePages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isCreatingVotePage, setIsCreatingVotePage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Проверка, вошел ли пользователь в систему, по наличию userId в localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(userId);
        const votePagesResponse = await axios.get(`${apiUrl}/votepages/${userId}`);
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
      await axios.delete(`${apiUrl}/votepages/${votePageId}`);
      setVotePages(votePages.filter((vp) => vp.votePageId !== votePageId));
    } catch (error) {
      console.error("Ошибка при удалении страницы голосования:", error);
      alert("Ошибка при удалении страницы голосования. Пожалуйста, попробуйте снова.");
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <header className="flex justify-between items-center py-4 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-blueAccent">Панель управления</h1>
        <ProfileDropDown handleLogout={handleLogout} />
      </header>

      <main className="mt-8">
        <section className="mb-8">
          <h2 className="text-2xl mb-4 font-semibold text-blueAccent">Ваши страницы голосования</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {votePages.map((votePage) => (
              <VotePageCard
                key={votePage.votePageId}
                votePage={votePage}
                onEdit={() => handleEditVotePage(votePage.votePageId)}
                onDelete={() => handleDeleteVotePage(votePage.votePageId)}
              />
            ))}
            <div
              className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer bg-blueAccent text-white"
              onClick={() => setIsCreatingVotePage(true)}
            >
              <FiPlus size={24} />
              <span>Создать новую</span>
            </div>
          </div>
        </section>

        {isCreatingVotePage && (
          <CreateVotePageForm
            onClose={() => setIsCreatingVotePage(false)}
            onCreate={handleCreateVotePage}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;