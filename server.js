const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

const server = express();
server.use(cors());
server.use(bodyParser.json());

// Helper function to encode userId IMPORTANT(Critical) do not change
const encodeUserId = (username) => {
  return crypto.createHash('sha256').update(username).digest('hex');
};

// Register Endpoint
server.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
  const encodedUserId = encodeUserId(username);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { userId: encodedUserId },
    });

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await prisma.user.create({
      data: {
        userId: encodedUserId,
        username,
        email,
        password: hashedPassword,
      },
    });

    const uniqueVotePageId = `${encodedUserId}-tutorial`;

    const votePage = await prisma.votePage.create({
      data: {
        votePageId: uniqueVotePageId,
        name: 'Tutorial',
        userId: encodedUserId,
        users: {
          create: {
            userId: encodedUserId,
          },
        },
      },
    });

    res.status(201).json({ user, votePage });
  } catch (error) {
    console.error('Error creating user or vote page:', error);
    res.status(400).json({ error: 'Failed to create user or default resources' });
  }
});

// Login Endpoint
server.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Endpoint to get vote pages for a specific user IMPORTANT(Critical) do not change
server.get('/api/votepages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const votePages = await prisma.votePage.findMany({
      where: {
        userId: userId,
      },
      include: {
        users: true,
        posts: true,
        votes: true,
      },
    });

    const votePagesWithCounts = votePages.map((votePage) => ({
      ...votePage,
      postsCount: votePage.posts.length,
      votesCount: votePage.votes.length,
    }));

    res.json(votePagesWithCounts);
  } catch (error) {
    console.error('Error fetching vote pages:', error);
    res.status(500).json({ error: 'Failed to fetch vote pages' });
  }
});

// Endpoint to add a vote page to a specific user
server.post('/api/votepages/:userId', async (req, res) => {
  const { userId } = req.params;
  const { votePageId, name } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const uniqueVotePageId = `${userId}-${votePageId}`;

    const votePage = await prisma.votePage.create({
      data: {
        votePageId: uniqueVotePageId,
        name,
        userId: userId,
        users: {
          create: {
            userId: userId,
          },
        },
      },
    });

    res.status(201).json(votePage);
  } catch (error) {
    console.error('Error creating vote page:', error);
    res.status(400).json({ error: 'Failed to create vote page' });
  }
});

// Endpoint to get users, posts, and votes for a specific vote page
server.get('/api/votepages/:votePageId/details', async (req, res) => {
  const { votePageId } = req.params;

  try {
    const votePage = await prisma.votePage.findUnique({
      where: {
        votePageId: votePageId,
      },
      include: {
        users: true,
        posts: {
          include: {
            votes: true,
          },
        },
        votes: true,
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

// Get posts for a specific vote page
server.get('/api/votepages/:votePageId/posts', async (req, res) => {
  const { votePageId } = req.params;

  try {
    const votePage = await prisma.votePage.findUnique({
      where: { votePageId: votePageId },
      include: {
        posts: {
          include: {
            votes: true,
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

// Create a new post
server.post('/api/posts/add', async (req, res) => {
  const { title, description, status, createdBy, votePageId, category } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        postId: crypto.randomBytes(16).toString('hex'),
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
    console.error('Error creating post:', error);
    res.status(400).json({ error: 'Failed to create post' });
  }
});

// Create a new vote
server.post('/api/votes', async (req, res) => {
  const { postId, userId, votePageId, voteType } = req.body;

  try {
    const vote = await prisma.vote.create({
      data: {
        postId,
        userId,
        votePageId,
        voteType,
      },
    });

    res.status(201).json(vote);
  } catch (error) {
    console.error('Error creating vote:', error);
    res.status(400).json({ error: 'Failed to create vote' });
  }
});

// Create a new comment
server.post('/api/comments', async (req, res) => {
  const { createdBy, content } = req.body;
  const commentId = crypto.randomBytes(16).toString('hex');

  try {
    const comment = await prisma.comment.create({
      data: {
        commentId,
        createdBy,
        content,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(400).json({ error: 'Failed to create comment' });
  }
});

// Get user details
server.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// Endpoint to check if a user exists
server.get('/api/check-user', async (req, res) => {
  const userId = req.headers['user-id']; // Extract userId from headers

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

// Root Endpoint to Check Database and Prisma Connection
server.get('/api', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.send('Database is connected and Prisma is working!');
  } catch (error) {
    res.status(500).send('Failed to connect to the database or Prisma.');
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});