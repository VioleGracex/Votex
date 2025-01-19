const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY ||'your_secret_key';

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(bodyParser.json());

  // Helper function to encode userId
  const encodeUserId = (username) => {
    return crypto.createHash('sha256').update(username).digest('hex');
  };

  // Middleware to authenticate JWT token
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token invalid or expired' });
      req.user = user;
      next();
    });
  };

  // Register Endpoint
  server.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
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
          users: {
            connect: { id: user.id },
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

  // Endpoint to get vote pages for a specific user
  server.get('/api/votepages/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      const votePages = await prisma.votePage.findMany({
        where: {
          users: {
            some: {
              userId: userId
            }
          }
        },
        include: {
          users: true,
          posts: true,
          votes: true
        },
      });

      const votePagesWithCounts = votePages.map(votePage => ({
        ...votePage,
        postsCount: votePage.posts.length,
        votesCount: votePage.votes.length,
      }));

      res.json(votePagesWithCounts);
    } catch (error) {
      console.error("Error fetching vote pages:", error);
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
          users: {
            connect: { id: user.id },
          },
        },
      });

      res.status(201).json(votePage);
    } catch (error) {
      console.error("Error creating vote page:", error);
      res.status(400).json({ error: 'Failed to create vote page' });
    }
  });

  // Get specific vote page by ID
  server.get('/api/votepages/:votePageId', async (req, res) => {
    const { votePageId } = req.params;
    try {
      const votePage = await prisma.votePage.findUnique({
        where: { votePageId },
        include: {
          users: true,
          posts: {
            include: {
              votes: true,
              creator: true,
              updatedByUser: true,
              category: true,
              status: true,
            },
          },
          votes: {
            include: {
              user: true,
              post: true,
            },
          },
        },
      });
      if (!votePage) {
        return res.status(404).json({ error: 'Vote page not found' });
      }
      res.json(votePage);
    } catch (error) {
      console.error('Error fetching vote page:', error);
      res.status(500).json({ error: 'Failed to fetch vote page' });
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

  // Get all users
  server.get('/api/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
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

  // Serve Next.js pages
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, (err) => {
    if (err) {
      console.error('Error starting server:', err);
      process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
  });
});