const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  purchaseDate: { type: Date, required: true },
  warranty: {
    startDate: Date,
    endDate: Date,
    provider: String
  },
  location: { type: String, required: true },
  assignedTeam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MaintenanceTeam', 
    required: true 
  },
  defaultTechnician: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Scrapped'], 
    default: 'Active' 
  },
  department: { type: String, required: true },
  assignedEmployee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);