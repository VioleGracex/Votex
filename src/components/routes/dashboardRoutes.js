const express = require('express');
const router = express.Router();
const { Dashboard } = require('../models');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Create a new dashboard
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const newDashboard = await Dashboard.create({ name, userId: req.user.id });
    res.status(201).json(newDashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating dashboard', error });
  }
});

// Get all dashboards for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const dashboards = await Dashboard.findAll({ where: { userId: req.user.id } });
    res.status(200).json(dashboards);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboards', error });
  }
});

module.exports = router;
