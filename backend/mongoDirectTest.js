const { MongoClient } = require('mongodb');

// Direct connection string to one of the replica set members
const uri = "mongodb://sebastiansoecker:TiaclOBGm6AEIX5E@medmatchproduction-shard-00-00.72mfz.mongodb.net:27017,medmatchproduction-shard-00-01.72mfz.mongodb.net:27017,medmatchproduction-shard-00-02.72mfz.mongodb.net:27017/medmatch?ssl=true&replicaSet=atlas-15zlrp-shard-0&authSource=admin";

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