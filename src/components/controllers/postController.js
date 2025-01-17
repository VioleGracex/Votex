const pool = require('../config/database');

// Create a new post
const createPost = async (req, res) => {
  const { dashboardId, title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (dashboard_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [dashboardId, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get posts by dashboard
const getPostsByDashboard = async (req, res) => {
  const { dashboardId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE dashboard_id = $1',
      [dashboardId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createPost, getPostsByDashboard };
