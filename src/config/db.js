const { Pool } = require('pg');

// PostgreSQL connection setup
const pool = new Pool({
  user: 'your_user', // replace with your postgres user
  host: 'localhost',
  database: 'your_database', // replace with your database name
  password: 'your_password', // replace with your password
  port: 5432,
});

module.exports = pool;
