const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Trying to connect to MongoDB Atlas...');
    console.log(`Using connection string: ${process.env.MONGODB_URI}`);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

// Main function
const main = async () => {
  console.log('Starting MongoDB connection test...');
  const conn = await connectDB();
  
  console.log('Disconnecting from MongoDB...');
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
  
  console.log('Test completed successfully!');
  process.exit(0);
};

// Run the main function
main(); 