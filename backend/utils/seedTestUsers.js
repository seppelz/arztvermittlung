const mongoose = require('mongoose');
const User = require('../models/user.model');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Trying to connect to MongoDB Atlas...');
    console.log(`Using connection string: ${process.env.MONGODB_URI}`);
    
    // Use the connection options that worked in our test
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: false // Disable SSL validation for testing
    });
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

// Create test users (including guest user)
const createTestUsers = async () => {
  try {
    console.log('Creating test users...');
    
    // Check if users already exist
    const existingGuest = await User.findOne({ email: 'guest@example.com' });
    const existingUser = await User.findOne({ email: 'user@example.com' });
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    const users = [];
    
    // Create guest user if it doesn't exist
    if (!existingGuest) {
      users.push({
        username: 'guest',
        name: 'Guest User',
        email: 'guest@example.com',
        password: 'guest123',
        role: 'user',
        userType: 'Arzt', // Using Arzt as it's a valid userType
        status: 'active'
      });
    }
    
    // Create test user if it doesn't exist
    if (!existingUser) {
      users.push({
        username: 'testuser',
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
        userType: 'Arzt',
        status: 'active'
      });
    }
    
    // Create admin user if it doesn't exist
    if (!existingAdmin) {
      users.push({
        username: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        userType: 'Administrator',
        status: 'active'
      });
    }
    
    // Insert users if there are any to insert
    if (users.length > 0) {
      const createdUsers = await User.create(users);
      console.log(`${createdUsers.length} test users created`);
    } else {
      console.log('All test users already exist, skipping creation');
    }
    
    // Log all test users
    const allTestUsers = await User.find({ 
      $or: [
        { email: 'guest@example.com' },
        { email: 'user@example.com' },
        { email: 'admin@example.com' }
      ]
    }).select('-password');
    
    console.log('Test users:', allTestUsers);
    
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
};

// Main function
const runSeed = async () => {
  const conn = await connectDB();
  await createTestUsers();
  
  // Close connection
  console.log('Disconnecting from MongoDB...');
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
  
  console.log('Seed completed successfully!');
  process.exit(0);
};

// Run the seed function
runSeed(); 