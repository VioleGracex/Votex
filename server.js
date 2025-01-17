const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
/* const { sequelize } = require('./src/components/models'); // Sequelize instance to connect to DB */
const dashboardRoutes = require('./src/components/routes/dashboardRoutes');
const groupRoutes = require('./src/components/routes/groupRoutes');
const postRoutes = require('./src/components/routes/postRoutes');
const voteRoutes = require('./src/components/routes/voteRoutes');
const commentRoutes = require('./src/components/routes/commentRoutes'); // Fixed the path
const authMiddleware = require('./src/components/middlewares/authMiddleware'); // Fixed the path
const { Sequelize } = require('sequelize');

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware for parsing JSON
app.use(express.json());
app.use(cors()); // CORS setup if you need cross-origin requests

// Apply routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/post', postRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/comment', commentRoutes);

// Example route for testing authentication
app.get('/api/protected', authMiddleware.authMiddleware, (req, res) => {
  res.status(200).json({ message: 'You have access to this route!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Sync database models (you can also set this in a separate db connection file)
sequelize.sync()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });

// Set the server to listen on a port (default: 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
