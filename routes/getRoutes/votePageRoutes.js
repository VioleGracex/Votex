const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Endpoint to fetch vote pages that a user has access to
router.get('/api/votepages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const votePages = await prisma.votePage.findMany({
      where: {
        OR: [
          { createdBy: userId }, // Vote pages created by the user
          { users: { has: userId } } // Vote pages where the user is in the users array
        ]
      }
    });

    res.json(votePages);
  } catch (error) {
    console.error('Error fetching vote pages:', error);
    res.status(500).json({ error: 'Failed to fetch vote pages' });
  }
});


// Endpoint to get users, posts, and votes for a specific vote page
router.get('/api/votepages/:votePageId/details', async (req, res) => {
  const { votePageId } = req.params;

  try {
    const votePage = await prisma.votePage.findUnique({
      where: {
        votePageId: votePageId,
      },
      include: {
        author: true, // Include the user who created the vote page
        posts: {
          include: {
            votes: true,
            author: true, // Include the user who created the post
          },
        },
        votes: {
          include: {
            post: true, // Include the post associated with the vote
            author: true, // Include the user who made the vote
          },
        },
      },
    });

    if (!votePage) {
      return res.status(404).json({ error: 'Vote page not found' });
    }

    const votePageDetails = {
      ...votePage,
      postsCount: votePage.posts.length,
      votesCount: votePage.votes.length,
    };

    res.json(votePageDetails);
  } catch (error) {
    console.error('Error fetching vote page details:', error);
    res.status(500).json({ error: 'Failed to fetch vote page details' });
  }
});

module.exports = router;