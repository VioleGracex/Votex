const express = require('express');
const router = express.Router();
const { Post, Vote, Comment } = require('../models');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Create a new post in a group
router.post('/:groupId', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { groupId } = req.params;

    const newPost = await Post.create({
      title,
      content,
      groupId,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Get all posts from a group
router.get('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const posts = await Post.findAll({ where: { groupId } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error });
  }
});

// Filter posts (most upvotes, downvotes, etc.)
router.get('/:groupId/filter', async (req, res) => {
  try {
    const { groupId } = req.params;
    const filter = req.query.filter || 'most_interactions'; // Default filter

    let order;
    switch (filter) {
      case 'most_upvotes':
        order = [['upvotes', 'DESC']];
        break;
      case 'most_downvotes':
        order = [['downvotes', 'DESC']];
        break;
      case 'most_interactions':
        order = [[sequelize.fn('sum', sequelize.col('upvotes + downvotes')), 'DESC']];
        break;
      default:
        order = [['createdAt', 'DESC']];
    }

    const posts = await Post.findAll({
      where: { groupId },
      order,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering posts', error });
  }
});

module.exports = router;
