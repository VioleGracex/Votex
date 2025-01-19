// pages/_app.js
import React, { useEffect, useState } from 'react';
import '../styles/globals.css'; // Import global styles


function MyApp({ Component, pageProps }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
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

  if (!username) {
    return null; // or a loading spinner
  }

  return <Component {...pageProps} />;
}

export default MyApp;