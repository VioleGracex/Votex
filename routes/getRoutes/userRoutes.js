const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Endpoint to check if a user exists
router.get('/api/check-user', async (req, res) => {
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(400).json({ exists: false, error: 'User ID is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({ exists: false });
    }

    res.json({ exists: true });
  } catch (error) {
    console.error('Error checking user in database:', error);
    res.status(500).json({ exists: false });
  }
});

// Fetch user suggestions based on a search query
router.get('/api/users/suggestions', async (req, res) => {
  const { query } = req.query;
  const currentUserId = req.headers['user-id'];

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                username: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
          {
            userId: {
              not: currentUserId,
            },
          },
        ],
      },
      select: {
        userId: true,
        username: true,
        email: true,
      },
      take: 10,
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch user suggestions' });
  }
});

// Fetch username based on user ID
router.get('/api/users/:userId/username', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { username: true },
    });

    if (user) {
      res.json({ username: user.username });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({ error: 'Failed to fetch username' });
  }
});

// Fetch avatar image based on user ID
router.get('/api/users/:userId/avatar', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        avatar: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'avatar not found' });
    }
  } catch (error) {
    console.error('Error fetching avatar:', error);
    res.status(500).json({ error: 'Failed to fetch avatar' });
  }
});

// Fetch user details based on user ID
router.get('/api/users/:userId/details', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true, // Add createdAt for displaying the creation date
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

module.exports = router;