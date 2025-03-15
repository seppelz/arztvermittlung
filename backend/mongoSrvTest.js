const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

// Connection string from environment variables
const uri = process.env.MONGODB_URI;

// Set Node.js options for TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Only for testing - not recommended for production

async function run() {
  try {
    console.log('Starting MongoDB connection test with NODE_TLS_REJECT_UNAUTHORIZED=0...');
    console.log('Connecting to MongoDB Atlas...');
    
    // Create a new MongoClient with minimal options
    const client = new MongoClient(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas!');
    
    // List databases
    const databasesList = await client.db().admin().listDatabases();
    console.log('Databases:');
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run(); 