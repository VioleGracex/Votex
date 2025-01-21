const express = require('express');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = new PrismaClient();

const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads/avatars';
    // Ensure the upload directory exists
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir); // Директория для сохранения аватаров
  },
  filename: function (req, file, cb) {
    cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname)); // Уникальное имя файла
  },
});

const upload = multer({ storage: storage });

// Создание или обновление поста
router.post('/api/posts/add', async (req, res) => {
  const { postId, title, description, status, createdBy, votePageId, category } = req.body;

  try {
    let post;
    if (postId) {
      post = await prisma.post.findUnique({
        where: { postId },
      });

      if (post) {
        post = await prisma.post.update({
          where: { postId },
          data: {
            title,
            description,
            status,
            category,
          },
        });
        return res.status(200).json(post);
      }
    }

    post = await prisma.post.create({
      data: {
        postId: postId || crypto.randomBytes(16).toString('hex'),
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
    console.error('Ошибка при создании или обновлении поста:', error);
    res.status(400).json({ error: 'Не удалось создать или обновить пост' });
  }
});

// Создание или обновление страницы голосования для конкретного пользователя
router.post('/api/votepages/:userId/add', async (req, res) => {
  const { userId } = req.params;
  const { votePageId, name, users = [] } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Требуется идентификатор пользователя' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    let votePage = await prisma.votePage.findUnique({
      where: { votePageId },
    });

    if (votePage) {
      votePage = await prisma.votePage.update({
        where: { votePageId },
        data: { name, users: { set: users } },
      });
    } else {
      votePage = await prisma.votePage.create({
        data: {
          votePageId,
          name,
          createdBy: userId,
          userId: userId,
          users: {
            set: users,
          },
        },
      });
    }

    res.status(201).json(votePage);
  } catch (error) {
    console.error('Ошибка при создании или обновлении страницы голосования:', error);
    res.status(400).json({ error: 'Не удалось создать или обновить страницу голосования' });
  }
});

// Создание или обновление комментария
router.post('/api/comments/add', async (req, res) => {
  const { commentId, createdBy, content } = req.body;

  try {
    let comment;
    if (commentId) {
      comment = await prisma.comment.findUnique({
        where: { commentId },
      });

      if (comment) {
        comment = await prisma.comment.update({
          where: { commentId },
          data: { content },
        });
        return res.status(200).json(comment);
      }
    }

    comment = await prisma.comment.create({
      data: {
        commentId: commentId || crypto.randomBytes(16).toString('hex'),
        createdBy,
        content,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Ошибка при создании или обновлении комментария:', error);
    res.status(400).json({ error: 'Не удалось создать или обновить комментарий' });
  }
});

// Голосование или обновление голоса (положительный или отрицательный)
router.post('/api/votes/cast', async (req, res) => {
  const { postId, userId, votePageId, voteType } = req.body;

  try {
    const post = await prisma.post.findUnique({
      where: { postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingVote) {
      const updatedVote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { voteType },
      });
      return res.status(200).json(updatedVote);
    } else {
      const vote = await prisma.vote.create({
        data: {
          postId,
          userId,
          votePageId,
          voteType,
        },
      });
      return res.status(201).json(vote);
    }
  } catch (error) {
    console.error('Ошибка при голосовании или обновлении голоса:', error);
    res.status(400).json({ error: 'Не удалось проголосовать или обновить голос' });
  }
});

// Сохранение или обновление изображения аватара
router.post('/api/users/:userId/avatar/add', upload.single('avatar'), async (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'Файл не загружен' });
  }

  const avatarPath = req.file.path;

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { avatar: avatarPath },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Ошибка при сохранении или обновлении аватара:', error);
    res.status(500).json({ error: 'Не удалось сохранить или обновить аватар' });
  }
});

module.exports = router;