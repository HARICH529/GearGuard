const User = require('../models/User');

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });
    
    if (!adminExists) {
      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'defaultPassword',
        role: 'Admin',
        department: 'IT'
      });
      console.log('✅ Admin user created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

module.exports = createAdminUser;