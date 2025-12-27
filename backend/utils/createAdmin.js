const User = require('../models/User');

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });
    
    if (!adminExists) {
      await User.create({
        username: 'Hari Krishna',
        email: 'harikrishnachunduri123@gmail.com',
        password: 'Hari@2609',
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