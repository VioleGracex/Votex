// routes/getRoutes.js

const express = require('express');
const votePageRoutes = require('./votePageRoutes');
const postRoutes = require('./votePostRoutes');
const userRoutes = require('./userRoutes');
const rootRoutes = require('./rootRoutes');

const router = express.Router();

router.use(votePageRoutes);
router.use(postRoutes);
router.use(userRoutes);
router.use(rootRoutes);

module.exports = router;