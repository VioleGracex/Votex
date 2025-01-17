// src/config/database.js
require('dotenv').config(); // Load environment variables from a .env file

const { Sequelize } = require('sequelize');

// Configure the database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // Specify the dialect (postgres, mysql, etc.)
  logging: false, // Set to true if you want to see SQL queries in the console
  // Optional configurations (can be added as needed)
  dialectOptions: {
    ssl: {
      require: true, // Use SSL connection
      rejectUnauthorized: false, // Don't reject unauthorized SSL certificates
    },
  },
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
