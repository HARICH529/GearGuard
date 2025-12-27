const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  equipment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Equipment', 
    required: true 
  },
  team: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MaintenanceTeam', 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Corrective', 'Preventive'], 
    required: true 
  },
  scheduledDate: Date,
  durationHours: { type: Number, default: 0 },
  assignedTechnician: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: { 
    type: String, 
    enum: ['New', 'In Progress', 'Repaired', 'Scrap'], 
    default: 'New' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  completionDate: Date,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequest', requestSchema);