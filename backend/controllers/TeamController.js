const MaintenanceTeam = require('../models/MaintenanceTeam');

const getTeams = async (req, res) => {
  try {
    const teams = await MaintenanceTeam.find()
      .populate('members teamLead');
    res.json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.create(req.body);
    await team.populate('members teamLead');
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('members teamLead');
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getTeams,
  createTeam,
  updateTeam
};