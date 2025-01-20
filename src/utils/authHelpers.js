import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const checkIfLoggedIn = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return false;
  }

  try {
    const response = await axios.get(`${apiUrl}/api/check-user`, {
      headers: {
        'User-Id': userId // Send user ID in headers
      }
    });
    return response.data.exists;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // User not found
      console.warn('User not found in the database.');
      return false;
    }
    console.error('Ошибка при проверке пользователя в базе данных:', error);
    return false;
  }
};

export const checkIfLoggedInKick = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    handleLogout();
    return false;
  }

  try {
    const response = await axios.get(`${apiUrl}/api/check-user`, {
      headers: {
        'User-Id': userId // Send user ID in headers
      }
    });
    return response.data.exists;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // User not found
      console.warn('User not found in the database.');
      handleLogout();
      return false;
    }
    console.error('Ошибка при проверке пользователя в базе данных:', error);
    handleLogout();
    return false;
  }
};

export const handleLogout = () => {
  const userId = localStorage.getItem("userId");

  // Check if userId exists before attempting to log out
  if (!userId) {
    console.warn("No user is currently logged in.");
    window.location.href = "/";
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("userId");
 
  window.location.href = "/";
};