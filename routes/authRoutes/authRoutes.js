const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

const router = express.Router();

// Helper function to encode userId IMPORTANT(Critical) do not change
const encodeUserId = (username) => {
  return crypto.createHash('sha256').update(username).digest('hex');
};

// Register Endpoint
router.post('/api/register', async (req, res) => {
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
        createdBy: encodedUserId,
        userId: encodedUserId,
        users: [encodedUserId],
      },
    });

    res.status(201).json({ user, votePage });
  } catch (error) {
    console.error('Error creating user or vote page:', error);
    res.status(400).json({ error: 'Failed to create user or default resources' });
  }
});

// Login Endpoint
router.post('/api/login', async (req, res) => {
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

module.exports = router;