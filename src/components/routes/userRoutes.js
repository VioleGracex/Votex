const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes for users
router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);

module.exports = router;
