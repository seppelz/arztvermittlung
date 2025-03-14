const { MongoClient } = require('mongodb');

// Connection string from MongoDB Atlas dashboard
const uri = "mongodb+srv://sebastiansoecker:TiaclOBGm6AEIX5E@medmatchproduction.72mfz.mongodb.net/?retryWrites=true&w=majority&appName=MedmatchProduction";

// Create a client with explicit options
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false, // Try with SSL validation disabled for testing
  connectTimeoutMS: 30000, // Increase timeout
  socketTimeoutMS: 30000 // Increase timeout
});

async function run() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log(`Using connection string: ${uri}`);
    console.log('Using SSL validation disabled for testing');
    
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas!');
    
    // Get the list of databases
    const databasesList = await client.db().admin().listDatabases();
    console.log('Your databases:');
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    
  } catch (err) {
    console.error('Connection error:', err);
    if (err.name === 'MongoNetworkError') {
      console.error('This is a network error. Please check:');
      console.error('1. Your IP is whitelisted in MongoDB Atlas Network Access');
      console.error('2. No firewall is blocking the connection');
      console.error('3. The MongoDB Atlas cluster is running');
    }
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

run().catch(console.dir); 