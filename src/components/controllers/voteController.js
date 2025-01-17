const pool = require('../config/database');

// Add a vote (upvote or downvote)
const addVote = async (req, res) => {
  const { postId, userId, voteType } = req.body; // voteType: 'upvote' or 'downvote'
  try {
    const result = await pool.query(
      'INSERT INTO votes (post_id, user_id, vote_type) VALUES ($1, $2, $3) RETURNING *',
      [postId, userId, voteType]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get votes by post
const getVotesByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM votes WHERE post_id = $1',
      [postId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addVote, getVotesByPost };
