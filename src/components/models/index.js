// src/components/models/index.js
const { Sequelize } = require('sequelize');
const User = require('./userModel');  // Import individual models
const Post = require('./postModel');

// Ensure you have the DATABASE_URL environment variable set
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // Adjust this depending on the database you're using (e.g., 'mysql', 'sqlite', etc.)
  logging: false, // You can set this to `true` if you want to see SQL queries in the console
});

const models = {
  User,
  Post,
  sequelize,  // Export the sequelize instance as well
};

module.exports = models;
