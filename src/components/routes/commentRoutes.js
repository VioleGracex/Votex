const express = require('express');
const router = express.Router();
const { Comment } = require('../models');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Create a new comment on a post
router.post('/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const newComment = await Comment.create({
      postId,
      userId: req.user.id,
      content,
      createdBy: req.user.id,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
});

// Get all comments on a post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({ where: { postId } });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving comments', error });
  }
});

module.exports = router;
