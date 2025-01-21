// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes/authRoutes');
const postRoutes = require('./routes/postRoutes/postRoutes');
const getRoutes = require('./routes/getRoutes/getRoutes');
const deleteRoutes = require('./routes/deleteRoutes/deleteRoutes');

const server = express();
server.use(cors());
server.use(bodyParser.json());

// Use the routes from different files
server.use(authRoutes);
server.use(postRoutes);
server.use(getRoutes);
server.use(deleteRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});