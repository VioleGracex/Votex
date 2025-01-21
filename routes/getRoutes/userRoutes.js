const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Endpoint to check if a user exists
router.get('/api/check-user', async (req, res) => {
  const userId = req.headers['user-id']; // Extract userId from headers

  if (!userId) {
    return res.status(400).json({ exists: false, error: 'User ID is required' });
  }

  try {
    console.log('Checking if user exists with ID:', userId); // Debugging statement
    const user = await prisma.user.findUnique({
      where: { userId },
    });
    console.log('User found:', user); // Debugging statement

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
  const currentUserId = req.headers['user-id']; // Assuming the user ID is passed in the headers

  try {
    //console.log('Searching for users with query:', query); // Debugging statement
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
              not: currentUserId, // Exclude the current user
            },
          },
        ],
      },
      select: {
        userId: true,
        username: true,
        email: true,
      },
      take: 10, // Limit the number of suggestions
    });
    console.log('Users found:', users); // Debugging statement
    
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

module.exports = router;