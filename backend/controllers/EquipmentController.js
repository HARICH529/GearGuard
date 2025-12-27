const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate('assignedTeam assignedEmployee defaultTechnician');
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    await equipment.populate('assignedTeam assignedEmployee defaultTechnician');
    res.status(201).json({ success: true, data: equipment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('assignedTeam assignedEmployee defaultTechnician');
    
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getEquipmentRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ equipment: req.params.id })
      .populate('assignedTechnician team createdBy')
      .sort({ createdAt: -1 });
    
    const openCount = requests.filter(r => 
      ['New', 'In Progress'].includes(r.status)
    ).length;
    
    res.json({ success: true, data: { requests, openCount } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    // Check for associated maintenance requests before deletion
    const associatedRequests = await MaintenanceRequest.findOne({ equipment: req.params.id });
    if (associatedRequests) {
      return res.status(400).json({ 
        error: 'Cannot delete equipment with existing maintenance requests' 
      });
    }

    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEquipmentByDepartment = async (req, res) => {
  try {
    const equipment = await Equipment.find({ department: req.params.department })
      .populate('assignedTeam assignedEmployee defaultTechnician');
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEquipmentByEmployee = async (req, res) => {
  try {
    const equipment = await Equipment.find({ assignedEmployee: req.params.employeeId })
      .populate('assignedTeam assignedEmployee defaultTechnician');
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEquipment,
  createEquipment,
  updateEquipment,
  getEquipmentRequests,
  deleteEquipment,
  getEquipmentByDepartment,
  getEquipmentByEmployee
};