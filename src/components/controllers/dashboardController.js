const pool = require('../config/database');

// Create a new dashboard
const createDashboard = async (req, res) => {
  const { userId, name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO dashboards (user_id, name) VALUES ($1, $2) RETURNING *',
      [userId, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get dashboards by user
const getDashboardsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM dashboards WHERE user_id = $1',
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createDashboard, getDashboardsByUser };
