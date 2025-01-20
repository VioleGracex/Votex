import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchVotePageData = async (votePageId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/votepages/${votePageId}/details`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных страницы голосования:', error);
    throw error;
  }
};