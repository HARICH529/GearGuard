const express = require('express');
const { getTeams, createTeam, updateTeam } = require('../controllers/TeamController');
const { authMiddleware, roleCheck } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, getTeams);
router.post('/', authMiddleware, roleCheck(['Manager', 'Admin']), createTeam);
router.put('/:id', authMiddleware, roleCheck(['Manager', 'Admin']), updateTeam);

module.exports = router;