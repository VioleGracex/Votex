const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Удалить пост
router.delete('/api/posts/:postId/delete', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    await prisma.post.delete({
      where: { postId },
    });

    res.status(200).json({ message: 'Пост успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении поста:', error);
    res.status(400).json({ error: 'Не удалось удалить пост' });
  }
});

// Удалить страницу голосования
router.delete('/api/votepages/:userId/:votePageId/delete', async (req, res) => {
  const { userId, votePageId } = req.params;

  try {
    // Найти страницу голосования по votePageId
    const votePage = await prisma.votePage.findUnique({
      where: { votePageId },
    });

    // Проверить, существует ли страница голосования
    if (!votePage) {
      return res.status(404).json({ error: 'Страница голосования не найдена' });
    }

    // Проверить, совпадает ли userId с userId создателя
    if (votePage.userId !== userId) {
      return res.status(403).json({ error: 'У вас нет прав для удаления этой страницы голосования' });
    }

    // Удалить страницу голосования
    await prisma.votePage.delete({
      where: { votePageId },
    });

    res.status(200).json({ message: 'Страница голосования успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении страницы голосования:', error);
    res.status(400).json({ error: 'Не удалось удалить страницу голосования' });
  }
});

// Удалить комментарий
router.delete('/api/comments/:commentId/delete', async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    await prisma.comment.delete({
      where: { commentId },
    });

    res.status(200).json({ message: 'Комментарий успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении комментария:', error);
    res.status(400).json({ error: 'Не удалось удалить комментарий' });
  }
});

// Удалить голос
router.delete('/api/votes/:voteId/delete', async (req, res) => {
  const { voteId } = req.params; // Получить voteId из параметров URL

  try {
    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
    });

    if (!vote) {
      return res.status(404).json({ error: 'Голос не найден' });
    }

    await prisma.vote.delete({
      where: { id: voteId },
    });

    res.status(200).json({ message: 'Голос успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении голоса:', error);
    res.status(500).json({ error: 'Не удалось удалить голос' });
  }
});

module.exports = router;