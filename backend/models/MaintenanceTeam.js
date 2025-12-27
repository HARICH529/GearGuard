const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { 
    type: String, 
    enum: ['Mechanics', 'Electricians', 'IT Support'], 
    required: true 
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  teamLead: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceTeam', teamSchema);