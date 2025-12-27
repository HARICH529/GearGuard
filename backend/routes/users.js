const express = require('express');
const { getUsers } = require('../controllers/UserController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, getUsers);

module.exports = router;