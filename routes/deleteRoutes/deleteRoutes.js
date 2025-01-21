const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Delete a post
router.delete('/api/posts/:postId/delete', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await prisma.post.delete({
      where: { postId },
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(400).json({ error: 'Failed to delete post' });
  }
});

// Delete a vote page
router.delete('/api/votepages/:userId/:votePageId/delete', async (req, res) => {
  const { userId, votePageId } = req.params;

  try {
    // Find the vote page by votePageId
    const votePage = await prisma.votePage.findUnique({
      where: { votePageId },
    });

    // Check if the vote page exists
    if (!votePage) {
      return res.status(404).json({ error: 'Vote page not found' });
    }

    // Check if the userId matches the creator's userId
    if (votePage.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this vote page' });
    }

    // Delete the vote page
    await prisma.votePage.delete({
      where: { votePageId },
    });

    res.status(200).json({ message: 'Vote page deleted successfully' });
  } catch (error) {
    console.error('Error deleting vote page:', error);
    res.status(400).json({ error: 'Failed to delete vote page' });
  }
});

// Delete a comment
router.delete('/api/comments/:commentId/delete', async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await prisma.comment.delete({
      where: { commentId },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(400).json({ error: 'Failed to delete comment' });
  }
});

// Delete a vote
router.delete('/api/votes/:voteId/delete', async (req, res) => {
  const { voteId } = req.params;

  try {
    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
    });

    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    await prisma.vote.delete({
      where: { id: voteId },
    });

    res.status(200).json({ message: 'Vote deleted successfully' });
  } catch (error) {
    console.error('Error deleting vote:', error);
    res.status(400).json({ error: 'Failed to delete vote' });
  }
});

module.exports = router;