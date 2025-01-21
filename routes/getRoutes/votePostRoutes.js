const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Get posts for a specific vote page
router.get('/api/votepages/:votePageId/posts', async (req, res) => {
  const { votePageId } = req.params;

  try {
    const votePage = await prisma.votePage.findUnique({
      where: { votePageId: votePageId },
      include: {
        posts: {
          include: {
            votes: true,
            author: true, // Include the user who created the post
          },
        },
      },
    });

    if (!votePage) {
      return res.status(404).json({ error: 'Vote page not found' });
    }

    const posts = votePage.posts;

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Endpoint to get all votes for a specific post
router.get('/api/votes/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const votes = await prisma.vote.findMany({
      where: { postId: postId },
      include: {
        author: true,  // Include the user who made the vote
        post: true,  // Include the post associated with the vote
      }
    });

    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

module.exports = router;