const express = require('express');
const router = express.Router();
const { Vote, Post } = require('../models');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Upvote or downvote a post
router.post('/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'

    // Check if the vote type is valid
    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    // Create the vote
    const vote = await Vote.create({
      postId,
      userId: req.user.id,
      voteType,
      createdBy: req.user.id,
    });

    // Update the post's vote counts
    const post = await Post.findByPk(postId);
    if (voteType === 'upvote') {
      post.upvotes += 1;
    } else {
      post.downvotes += 1;
    }

    await post.save();

    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ message: 'Error voting on post', error });
  }
});

module.exports = router;
