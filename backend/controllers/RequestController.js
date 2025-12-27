const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');

const createRequest = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.body.equipment)
      .populate('assignedTeam defaultTechnician');
    
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const requestData = {
      ...req.body,
      team: equipment.assignedTeam._id,
      category: req.body.scheduledDate ? 'Preventive' : 'Corrective',
      createdBy: req.user._id,
      assignedTechnician: equipment.defaultTechnician?._id
    };

    const request = await MaintenanceRequest.create(requestData);
    await request.populate('equipment team assignedTechnician createdBy');

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, durationHours } = req.body;
    const request = await MaintenanceRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const validTransitions = {
      'New': ['In Progress'],
      'In Progress': ['Repaired', 'Scrap'],
      'Repaired': [],
      'Scrap': []
    };

    if (!validTransitions[request.status].includes(status)) {
      return res.status(400).json({ 
        error: `Invalid transition from ${request.status} to ${status}` 
      });
    }

    request.status = status;
    if (status === 'Repaired' && durationHours) {
      request.durationHours = durationHours;
      request.completionDate = new Date();
    }

    if (status === 'Scrap') {
      await Equipment.findByIdAndUpdate(request.equipment, { status: 'Scrapped' });
    }

    await request.save();
    await request.populate('equipment team assignedTechnician');

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getKanbanData = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate('equipment team assignedTechnician createdBy')
      .sort({ createdAt: -1 });

    const kanbanData = {
      'New': requests.filter(r => r.status === 'New'),
      'In Progress': requests.filter(r => r.status === 'In Progress'),
      'Repaired': requests.filter(r => r.status === 'Repaired'),
      'Scrap': requests.filter(r => r.status === 'Scrap')
    };

    res.json({ success: true, data: kanbanData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCalendarData = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({
      category: 'Preventive',
      scheduledDate: { $exists: true }
    })
    .populate('equipment team assignedTechnician')
    .sort({ scheduledDate: 1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const requestsByTeam = await MaintenanceRequest.aggregate([
      {
        $lookup: {
          from: 'maintenanceteams',
          localField: 'team',
          foreignField: '_id',
          as: 'teamInfo'
        }
      },
      {
        $unwind: '$teamInfo'
      },
      {
        $group: {
          _id: '$teamInfo.name',
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Repaired'] }, 1, 0] }
          }
        }
      }
    ]);

    const requestsByEquipment = await MaintenanceRequest.aggregate([
      {
        $lookup: {
          from: 'equipment',
          localField: 'equipment',
          foreignField: '_id',
          as: 'equipmentInfo'
        }
      },
      {
        $unwind: '$equipmentInfo'
      },
      {
        $group: {
          _id: '$equipmentInfo.department',
          count: { $sum: 1 },
          avgDuration: { $avg: '$durationHours' }
        }
      }
    ]);

    res.json({ 
      success: true, 
      data: { 
        requestsByTeam, 
        requestsByEquipment 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignTechnician = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { assignedTechnician: req.body.technicianId },
      { new: true }
    ).populate('equipment team assignedTechnician');

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRequest,
  updateStatus,
  getKanbanData,
  assignTechnician,
  getCalendarData,
  getReports
};