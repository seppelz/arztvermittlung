const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

// Extract credentials from environment variables
const credentials = process.env.MONGODB_URI.match(/mongodb\+srv:\/\/(.*):(.*)@/);
const username = credentials ? credentials[1] : '';
const password = credentials ? credentials[2] : '';

// Construct direct connection string using extracted credentials
// Note: Using the same replica set name as in the mongoIPTest.js file
const uri = `mongodb://${username}:${password}@medmatchproduction-shard-00-00.72mfz.mongodb.net:27017,medmatchproduction-shard-00-01.72mfz.mongodb.net:27017,medmatchproduction-shard-00-02.72mfz.mongodb.net:27017/medmatch?ssl=true&replicaSet=atlas-72mfz-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Set Node.js options for TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Only for testing - not recommended for production

async function run() {
  try {
    console.log('Starting MongoDB connection test with direct connection...');
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