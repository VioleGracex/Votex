// routes/getRoutes/rootRoutes.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Root Endpoint to Check Database and Prisma Connection
router.get('/api', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.send('Database is connected and Prisma is working!');
  } catch (error) {
    res.status(500).send('Failed to connect to the database or Prisma.');
  }
});

module.exports = router;