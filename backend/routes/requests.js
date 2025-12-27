const express = require('express');
const { 
  createRequest, 
  updateStatus, 
  getKanbanData, 
  assignTechnician,
  getCalendarData,
  getReports
} = require('../controllers/RequestController');
const { authMiddleware, roleCheck } = require('../middleware/auth');
const { validateOrigin } = require('../middleware/csrf');
const router = express.Router();

router.post('/', validateOrigin, authMiddleware, createRequest);
router.put('/:id/status', validateOrigin, authMiddleware, roleCheck(['Technician', 'Manager', 'Admin']), updateStatus);
router.get('/kanban', authMiddleware, getKanbanData);
router.put('/:id/assign', validateOrigin, authMiddleware, roleCheck(['Manager', 'Admin']), assignTechnician);
router.get('/calendar', authMiddleware, getCalendarData);
router.get('/reports', authMiddleware, roleCheck(['Manager', 'Admin']), getReports);

module.exports = router;