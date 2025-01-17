const express = require('express');
const router = express.Router();
const { Group } = require('../models');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Create a new group within a dashboard
router.post('/:dashboardId', authMiddleware, async (req, res) => {
  try {
    const { name, password, privacy } = req.body;
    const { dashboardId } = req.params;

    const newGroup = await Group.create({
      name,
      password,
      privacy,
      dashboardId,
    });
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
});

// Get all groups within a dashboard
router.get('/:dashboardId', authMiddleware, async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const groups = await Group.findAll({ where: { dashboardId } });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving groups', error });
  }
});

// Get group by id
router.get('/group/:groupId', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving group', error });
  }
});

module.exports = router;
