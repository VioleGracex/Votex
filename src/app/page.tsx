"use client";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Dashboard from "../pages/Dashboard";
import VotePage from "../pages/VotePage"; // Import the new VotePage component

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState<string | null>(null); // State to store the username

  useEffect(() => {
    // This ensures that the Router runs only on the client side
    setIsClient(true);

    // Fetch the username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    // Listen for storage changes to handle logout from other tabs
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!isClient || !username) {
    return null; // or a loading spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/votepage/:votePageId" element={<VotePage />} /> {/* Add the dynamic route */}
      </Routes>
    </Router>
  );
}