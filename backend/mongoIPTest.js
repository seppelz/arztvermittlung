const { MongoClient } = require('mongodb');

// Direct connection string using IP addresses
const uri = "mongodb://sebastiansoecker:TiaclOBGm6AEIX5E@18.194.218.68:27017/medmatch?ssl=true&authSource=admin";

async function run() {
  try {
    console.log('Starting MongoDB connection test with direct IP address...');
    console.log('Connecting to MongoDB Atlas...');
    
    // Create a new MongoClient with minimal options
    const client = new MongoClient(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      ssl: true,
      tls: true,
      tlsInsecure: true // Only for testing
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