"use client";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Dashboard from "../pages/dashboard"; // Example protected page
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const isTesting = true; // Set this to true for testing
  const isAdminTesting = false; // Set this to true for admin auto login

  useEffect(() => {
    // This ensures that the Router runs only on the client side
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <AuthProvider isTesting={isTesting} isAdminTesting={isAdminTesting}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}