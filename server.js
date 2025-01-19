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

// Helper function to encode userId
// Вспомогательная функция для кодирования userId
const encodeUserId = (username) => {
  return crypto.createHash('sha256').update(username).digest('hex');
};

// Middleware to authenticate JWT token
// Промежуточное ПО для аутентификации JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' }); // Токен отсутствует

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid or expired' }); // Токен недействителен или истек
    req.user = user;
    next();
  });
};

// Register Endpoint
// Конечная точка регистрации
server.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Хеширование пароля
  const encodedUserId = encodeUserId(username);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { userId: encodedUserId },
    });

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' }); // Имя пользователя уже существует
    }

    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' }); // Электронная почта уже существует
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
    console.error('Error creating user or vote page:', error); // Ошибка при создании пользователя или страницы голосования
    res.status(400).json({ error: 'Failed to create user or default resources' }); // Не удалось создать пользователя или ресурсы по умолчанию
  }
});

// Login Endpoint
// Конечная точка входа
server.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '1h' }); // Создание токена
    res.json({ token, user });
  } else {
    res.status(401).json({ error: 'Invalid email or password' }); // Неправильный email или пароль
  }
});

// Endpoint to get vote pages for a specific user
// Конечная точка для получения страниц голосования для конкретного пользователя
server.get('/api/votepages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const votePages = await prisma.votePage.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
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
    console.error('Error fetching vote pages:', error); // Ошибка при получении страниц голосования
    res.status(500).json({ error: 'Failed to fetch vote pages' }); // Не удалось получить страницы голосования
  }
});

// Endpoint to add a vote page to a specific user
// Конечная точка для добавления страницы голосования к конкретному пользователю
server.post('/api/votepages/:userId', async (req, res) => {
  const { userId } = req.params;
  const { votePageId, name } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // Пользователь не найден
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
    console.error('Error creating vote page:', error); // Ошибка при создании страницы голосования
    res.status(400).json({ error: 'Failed to create vote page' }); // Не удалось создать страницу голосования
  }
});

// Get specific vote page by ID
// Получить конкретную страницу голосования по ID
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
      return res.status(404).json({ error: 'Vote page not found' }); // Страница голосования не найдена
    }
    res.json(votePage);
  } catch (error) {
    console.error('Error fetching vote page:', error); // Ошибка при получении страницы голосования
    res.status(500).json({ error: 'Failed to fetch vote page' }); // Не удалось получить страницу голосования
  }
});

// Get posts for a specific vote page
// Получить сообщения для конкретной страницы голосования
server.get('/api/votepages/:votePageId/posts', async (req, res) => {
  const { votePageId } = req.params;

  try {
    // Fetch the vote page first
    // Сначала получить страницу голосования
    const votePage = await prisma.votePage.findUnique({
      where: { votePageId: votePageId },
      include: {
        posts: {
          include: {
            votes: true,
            creator: true,
            updatedByUser: true,
            category: true,
            status: true,
          },
        },
      },
    });

    // Check if the vote page exists
    // Проверить, существует ли страница голосования
    if (!votePage) {
      return res.status(404).json({ error: 'Vote page not found' }); // Страница голосования не найдена
    }

    // Extract posts from the vote page
    // Извлечь сообщения со страницы голосования
    const posts = votePage.posts;

    // Send the posts back in the response
    // Отправить сообщения обратно в ответе
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error); // Ошибка при получении сообщений
    res.status(500).json({ error: 'Failed to fetch posts' }); // Не удалось получить сообщения
  }
});

// Get user details
// Получить данные пользователя
server.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' }); // Пользователь не найден
  }
});

// Get all users
// Получить всех пользователей
server.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Root Endpoint to Check Database and Prisma Connection
// Корневая конечная точка для проверки подключения к базе данных и Prisma
server.get('/api', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.send('Database is connected and Prisma is working!'); // База данных подключена, и Prisma работает!
  } catch (error) {
    res.status(500).send('Failed to connect to the database or Prisma.'); // Не удалось подключиться к базе данных или Prisma.
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err); // Ошибка при запуске сервера
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`); // Сервер работает на порту ${PORT}
});