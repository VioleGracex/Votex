import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import VotePageCard from "../components/VotePageCard";
import CreateVotePageForm from "../components/CreateVotePageForm";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [votePages, setVotePages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isCreatingVotePage, setIsCreatingVotePage] = useState(false);

  useEffect(() => {
    // This runs only in the browser
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!storedToken) {
      alert("Please log in first.");
      window.location.href = "/login";
      return;
    }

    setToken(storedToken);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const votePagesResponse = await axios.get(`${apiUrl}/votepages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVotePages(votePagesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again.");
      }
    };

    fetchData();
  }, [token]);

  const handleCreateVotePage = (votePage) => {
    setVotePages([...votePages, votePage]);
  };

  const handleEditVotePage = (votePageId) => {
    // Handle edit vote page logic here
    alert(`Edit vote page: ${votePageId}`);
  };

  const handleDeleteVotePage = async (votePageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vote page?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${apiUrl}/votepages/${votePageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVotePages(votePages.filter((vp) => vp.votePageId !== votePageId));
    } catch (error) {
      console.error("Error deleting vote page:", error);
      alert("Error deleting vote page. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl mb-2">Your Vote Pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {votePages.map((votePage) => (
            <VotePageCard
              key={votePage.votePageId}
              votePage={votePage}
              onEdit={() => handleEditVotePage(votePage.votePageId)}
              onDelete={() => handleDeleteVotePage(votePage.votePageId)}
            />
          ))}
          <div
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer"
            onClick={() => setIsCreatingVotePage(true)}
          >
            <FiPlus size={24} />
          </div>
        </div>
      </section>

      {isCreatingVotePage && (
        <CreateVotePageForm
          onClose={() => setIsCreatingVotePage(false)}
          onCreate={handleCreateVotePage}
        />
      )}
    </div>
  );
};

export default Dashboard;