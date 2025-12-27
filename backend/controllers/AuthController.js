const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).populate('teams');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        teams: user.teams
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Server-defined security constants
const SECURITY_CONFIG = {
  ADMIN_ROLE: 'Admin',
  ALLOWED_ROLES: ['Manager', 'Technician', 'Employee'],
  MANAGER_ROLE: 'Manager',
  ALLOWED_DEPARTMENTS: ['Mechanics', 'Electricians', 'IT Support'],
  MANAGEMENT_DEPARTMENT: 'Management'
};

const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role, department } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Prevent admin registration using server-side security config
    if (role === SECURITY_CONFIG.ADMIN_ROLE) {
      return res.status(403).json({ error: 'Admin registration not allowed' });
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Validate role against server-defined whitelist
    if (!SECURITY_CONFIG.ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role selected' });
    }

    // Set department based on role using server-side logic
    let userDepartment;
    if (role === SECURITY_CONFIG.MANAGER_ROLE) {
      userDepartment = SECURITY_CONFIG.MANAGEMENT_DEPARTMENT;
    } else {
      // For Technician and Employee, department is required
      if (!department) {
        return res.status(400).json({ error: 'Department is required for this role' });
      }
      if (!SECURITY_CONFIG.ALLOWED_DEPARTMENTS.includes(department)) {
        return res.status(400).json({ error: 'Invalid department selected' });
      }
      userDepartment = department;
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
      department: userDepartment
    });

    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(400).json({ error: error.message });
  }
};

module.exports = { login, register };