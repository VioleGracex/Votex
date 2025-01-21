import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchUsername = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/users/${userId}/username`);
    
    // Check if response.data exists and has a username property
    if (response.data && response.data.username) {
      return response.data.username;
    } else {
      // Handle the case where the expected data is not present
      console.error('Error: Username not found in response data');
      return 'Unknown User';
    }
  } catch (error) {
    console.error('Ошибка при получении имени пользователя:', error);
    return 'Unknown User'; // Return a default value on error
  }
};