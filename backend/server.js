const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const equipmentRoutes = require('./routes/equipment');
const teamRoutes = require('./routes/teams');
const requestRoutes = require('./routes/requests');
const errorHandler = require('./middleware/errorHandler');
const createAdminUser = require('./utils/createAdmin');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gearguard')
  .then(async () => {
    console.log('✅ MongoDB connected');
    try {
      await createAdminUser();
    } catch (error) {
      console.error('❌ Admin user creation failed:', error.message);
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/requests', requestRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 GearGuard API running on port ${PORT}`);
});