const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

// Connection string from environment variables
const uri = process.env.MONGODB_URI;

// Create a new MongoClient with minimal options
const client = new MongoClient(uri, {
  ssl: true,
  tls: true,
  tlsInsecure: true, // Try with insecure TLS for testing
  directConnection: false
});

async function run() {
  try {
    console.log('Starting MongoDB connection test with minimal options...');
    console.log('Connecting to MongoDB Atlas...');
    
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas!');
    
    // Ping to confirm connection
    await client.db('admin').command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('MongoDB connection closed');
  }
}

run(); 