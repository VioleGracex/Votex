"use client";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



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
    <p>heelo</p>
  );
}