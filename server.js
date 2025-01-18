const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';

// Root Endpoint to Check Database and Prisma Connection
app.get('/', async (req, res) => {
    try {
        // Perform a simple query to check the database connection
        await prisma.$queryRaw`SELECT 1`;
        res.send('Database is connected and Prisma is working!');
    } catch (error) {
        res.status(500).send('Failed to connect to the database or Prisma.');
    }
});

// Register Endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'User already exists' });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid email or password' });
    }
});

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalid' });
        req.user = user;
        next();
    });
};

// Protected Route Example
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the dashboard!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});