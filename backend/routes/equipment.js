const express = require('express');
const { 
  getEquipment, 
  createEquipment, 
  updateEquipment, 
  getEquipmentRequests,
  deleteEquipment,
  getEquipmentByDepartment,
  getEquipmentByEmployee
} = require('../controllers/EquipmentController');
const { authMiddleware, roleCheck } = require('../middleware/auth');
const { validateOrigin } = require('../middleware/csrf');
const router = express.Router();

router.get('/', authMiddleware, getEquipment);
router.post('/', validateOrigin, authMiddleware, roleCheck(['Admin']), createEquipment);
router.put('/:id', validateOrigin, authMiddleware, roleCheck(['Manager', 'Admin']), updateEquipment);
router.delete('/:id', validateOrigin, authMiddleware, roleCheck(['Admin']), deleteEquipment);
router.get('/:id/requests', authMiddleware, getEquipmentRequests);
router.get('/department/:department', authMiddleware, getEquipmentByDepartment);
router.get('/employee/:employeeId', authMiddleware, getEquipmentByEmployee);

module.exports = router;