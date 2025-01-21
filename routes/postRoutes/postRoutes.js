const express = require('express');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Create or update a post
router.post('/api/posts/add', async (req, res) => {
  const { postId, title, description, status, createdBy, votePageId, category } = req.body;

  try {
    let post;
    if (postId) {
      // Check if the post exists
      post = await prisma.post.findUnique({
        where: { postId },
      });

      if (post) {
        // Update the existing post
        post = await prisma.post.update({
          where: { postId },
          data: {
            title,
            description,
            status,
            category,
          },
        });
        return res.status(200).json(post);
      }
    }

    // Create a new post
    post = await prisma.post.create({
      data: {
        postId: postId || crypto.randomBytes(16).toString('hex'),
        title,
        description,
        status,
        createdBy,
        votePageId,
        category,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating or updating post:', error);
    res.status(400).json({ error: 'Failed to create or update post' });
  }
});

// Create or update a vote page for a specific user
router.post('/api/votepages/:userId/add', async (req, res) => {
  const { userId } = req.params;
  const { votePageId, name, users = [] } = req.body; // Default to an empty array if users is not provided

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the vote page already exists
    let votePage = await prisma.votePage.findUnique({
      where: { votePageId },
    });

    if (votePage) {
      // Update the existing vote page
      votePage = await prisma.votePage.update({
        where: { votePageId },
        data: { name, users: { set: users } },
      });
    } else {
      // Create a new vote page
      votePage = await prisma.votePage.create({
        data: {
          votePageId,
          name,
          createdBy: userId,
          userId: userId, // Ensure userId is included here
          users: {
            set: users, // Since users is an array of strings
          },
        },
      });
    }

    res.status(201).json(votePage);
  } catch (error) {
    console.error('Error creating or updating vote page:', error);
    res.status(400).json({ error: 'Failed to create or update vote page' });
  }
});

// Create or update a comment
router.post('/api/comments/add', async (req, res) => {
  const { commentId, createdBy, content } = req.body;

  try {
    let comment;
    if (commentId) {
      // Check if the comment exists
      comment = await prisma.comment.findUnique({
        where: { commentId },
      });

      if (comment) {
        // Update the existing comment
        comment = await prisma.comment.update({
          where: { commentId },
          data: { content },
        });
        return res.status(200).json(comment);
      }
    }

    // Create a new comment
    comment = await prisma.comment.create({
      data: {
        commentId: commentId || crypto.randomBytes(16).toString('hex'),
        createdBy,
        content,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating or updating comment:', error);
    res.status(400).json({ error: 'Failed to create or update comment' });
  }
});

// Cast or update a vote (upvote or downvote)
router.post('/api/votes/cast', async (req, res) => {
  const { postId, userId, votePageId, voteType } = req.body;

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user has already voted on this post
    const existingVote = await prisma.vote.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingVote) {
      // Update the existing vote
      const updatedVote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { voteType },
      });
      return res.status(200).json(updatedVote);
    } else {
      // Create a new vote
      const vote = await prisma.vote.create({
        data: {
          postId,
          userId,
          votePageId,
          voteType,
        },
      });
      return res.status(201).json(vote);
    }
  } catch (error) {
    console.error('Error casting or updating vote:', error);
    res.status(400).json({ error: 'Failed to cast or update vote' });
  }
});

module.exports = router;