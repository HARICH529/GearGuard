const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MaintenanceTeam.deleteMany({});
    await Equipment.deleteMany({});
    await MaintenanceRequest.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin user
    const adminPassword = await bcrypt.hash('Hari@2609', 10);
    const admin = await User.create({
      username: 'Hari Krishna',
      email: 'harikrishnachunduri123@gmail.com',
      password: adminPassword,
      role: 'Admin',
      department: 'Management'
    });

    // Create sample users
    const users = [];
    
    // Managers
    const manager1 = await User.create({
      username: 'John Manager',
      email: 'john.manager@company.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Manager',
      department: 'Management'
    });
    users.push(manager1);

    // Technicians
    const tech1 = await User.create({
      username: 'Mike Mechanic',
      email: 'mike.mechanic@company.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Technician',
      department: 'Mechanics'
    });
    
    const tech2 = await User.create({
      username: 'Sarah Electrician',
      email: 'sarah.electrician@company.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Technician',
      department: 'Electricians'
    });
    
    const tech3 = await User.create({
      username: 'David IT',
      email: 'david.it@company.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Technician',
      department: 'IT Support'
    });
    users.push(tech1, tech2, tech3);

    // Employees
    const emp1 = await User.create({
      username: 'Alice Production',
      email: 'alice.production@company.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Employee',
      department: 'Production'
    });
    
    const emp2 = await User.create({
      username: 'Bob Office',
      email: 'bob.office@company.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Employee',
      department: 'Administration'
    });
    users.push(emp1, emp2);

    console.log('Created users');

    // Create maintenance teams
    const mechanicsTeam = await MaintenanceTeam.create({
      name: 'Mechanics Team',
      specialization: 'Mechanics',
      members: [tech1._id],
      teamLead: tech1._id
    });

    const electriciansTeam = await MaintenanceTeam.create({
      name: 'Electrical Team',
      specialization: 'Electricians',
      members: [tech2._id],
      teamLead: tech2._id
    });

    const itTeam = await MaintenanceTeam.create({
      name: 'IT Support Team',
      specialization: 'IT Support',
      members: [tech3._id],
      teamLead: tech3._id
    });

    console.log('Created maintenance teams');

    // Create sample equipment
    const equipment = [];
    
    // Production equipment
    const cncMachine = await Equipment.create({
      name: 'CNC Machine 001',
      serialNumber: 'CNC-2023-001',
      purchaseDate: new Date('2023-01-15'),
      warranty: {
        startDate: new Date('2023-01-15'),
        endDate: new Date('2025-01-15'),
        provider: 'MachineWorks Inc'
      },
      location: 'Production Floor A',
      department: 'Production',
      assignedTeam: mechanicsTeam._id,
      defaultTechnician: tech1._id,
      assignedEmployee: emp1._id,
      status: 'Active'
    });

    const conveyor = await Equipment.create({
      name: 'Conveyor Belt System',
      serialNumber: 'CVB-2022-045',
      purchaseDate: new Date('2022-06-10'),
      location: 'Production Floor B',
      department: 'Production',
      assignedTeam: mechanicsTeam._id,
      defaultTechnician: tech1._id,
      assignedEmployee: emp1._id,
      status: 'Active'
    });

    // IT equipment
    const server = await Equipment.create({
      name: 'Main Server',
      serialNumber: 'SRV-2023-001',
      purchaseDate: new Date('2023-03-20'),
      warranty: {
        startDate: new Date('2023-03-20'),
        endDate: new Date('2026-03-20'),
        provider: 'TechCorp'
      },
      location: 'Server Room',
      department: 'IT',
      assignedTeam: itTeam._id,
      defaultTechnician: tech3._id,
      assignedEmployee: emp2._id,
      status: 'Active'
    });

    equipment.push(cncMachine, conveyor, server);
    console.log('Created equipment');

    // Create sample maintenance requests
    const request1 = await MaintenanceRequest.create({
      subject: 'CNC Machine Oil Leak',
      equipment: cncMachine._id,
      team: mechanicsTeam._id,
      category: 'Corrective',
      status: 'New',
      createdBy: emp1._id,
      assignedTechnician: tech1._id,
      description: 'Machine is leaking oil from the hydraulic system'
    });

    const request2 = await MaintenanceRequest.create({
      subject: 'Server Overheating',
      equipment: server._id,
      team: itTeam._id,
      category: 'Corrective',
      status: 'In Progress',
      createdBy: emp2._id,
      assignedTechnician: tech3._id,
      description: 'Server temperature is running high'
    });

    console.log('Created maintenance requests');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log('Users created: 6');
    console.log('Teams created: 3');
    console.log('Equipment created: 3');
    console.log('Maintenance requests created: 2');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: harikrishnachunduri123@gmail.com / Hari@2609');
    console.log('Manager: john.manager@company.com / password123');

    console.log('\nSeed data created successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();