const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Убедитесь, что модуль crypto импортирован правильно
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';

// Helper function to encode userId
// Вспомогательная функция для кодирования userId
const encodeUserId = (username) => {
  return crypto.createHash('sha256').update(username).digest('hex');
};

// Middleware to authenticate JWT token
// Middleware для аутентификации JWT токена
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
// Конечная точка регистрации
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const encodedUserId = encodeUserId(username); // Кодируем userId

  try {
    // Check if the username or email already exists
    // Проверяем, существует ли уже это имя пользователя или email
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

    // Create the new user
    // Создаем нового пользователя
    const user = await prisma.user.create({
      data: {
        userId: encodedUserId,
        username,
        email,
        password: hashedPassword,
      },
    });

    // Create a unique vote page ID by combining userId and votePageId
    // Создаем уникальный ID страницы голосования, объединяя userId и votePageId
    const uniqueVotePageId = `${encodedUserId}-tutorial`;

    // Create a vote page called "tutorial" for the user
    // Создаем страницу голосования с названием "tutorial" для пользователя
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
// Конечная точка входа в систему
app.post('/login', async (req, res) => {
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
// Конечная точка для получения страниц голосования для конкретного пользователя
app.get('/votepages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find vote pages where the specified user is included in the users relation
    // Найти страницы голосования, где указанный пользователь включен в отношения users
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
    console.error("Error fetching vote pages:", error); // Логируем ошибку
    res.status(500).json({ error: 'Failed to fetch vote pages' });
  }
});

// Endpoint to add a vote page to a specific user
// Конечная точка для добавления страницы голосования конкретному пользователю
app.post('/votepages/:userId', async (req, res) => {
  const { userId } = req.params;
  const { votePageId, name } = req.body;

  try {
    // Find the user by userId
    // Находим пользователя по userId
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a unique vote page ID by combining userId and votePageId
    // Создаем уникальный ID страницы голосования, объединяя userId и votePageId
    const uniqueVotePageId = `${userId}-${votePageId}`;

    // Create a new vote page for the user
    // Создаем новую страницу голосования для пользователя
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
    console.error("Error creating vote page:", error); // Логируем ошибку
    res.status(400).json({ error: 'Failed to create vote page' });
  }
});

// Get specific vote page by ID
// Получить конкретную страницу голосования по ID
app.get('/votepages/:votePageId', async (req, res) => {
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
// Получить данные пользователя
app.get('/users/:userId', async (req, res) => {
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
// Получить всех пользователей
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Root Endpoint to Check Database and Prisma Connection
// Конечная точка для проверки подключения к базе данных и Prisma
app.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.send('Database is connected and Prisma is working!');
  } catch (error) {
    res.status(500).send('Failed to connect to the database or Prisma.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});