import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VotePage = ({ votePageData }) => {
  const router = useRouter();
  const { votePageId } = router.query; // Get the dynamic route parameter
  const [votePage, setVotePage] = useState(votePageData);
  const [posts, setPosts] = useState(votePageData.posts);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPost = async () => {
    try {
      const response = await axios.post(`${apiUrl}/posts`, {
        votePageId,
        content: newPostContent,
      });
      setPosts([...posts, response.data]);
      setNewPostContent('');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Error adding post. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="relative bg-blue-600 h-64 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">{votePage.name}</h1>
        <button
          className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200"
          onClick={() => router.push('/dashboard')}
        >
          Return to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Add Post */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add a New Post</h2>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows="4"
            placeholder="Write your post here..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddPost}
          >
            Add Post
          </button>
        </div>

        {/* Posts List */}
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
              <p className="text-gray-800">{post.content}</p>
              <div className="text-sm text-gray-500 mt-2">Posted on {new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { votePageId } = context.params;
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  try {
    const response = await axios.get(`${apiUrl}/votepages/${votePageId}`);
    return {
      props: {
        votePageData: response.data,
      },
    };
  } catch (error) {
    console.error('Error fetching vote page:', error);
    return {
      notFound: true,
    };
  }
}

export default VotePage;