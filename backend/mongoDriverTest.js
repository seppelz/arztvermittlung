const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connection URI
const uri = process.env.MONGODB_URI;

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Explicitly set TLS options
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  // Set server API version
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
});

async function run() {
  try {
    console.log('Starting MongoDB connection test...');
    console.log(`Using connection string: ${uri}`);
    
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas!');
    
    // Get the database list
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    console.log('Databases:');
    dbs.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Ping to confirm connection
    await client.db('admin').command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('MongoDB connection closed');
  }
}

run().catch(console.dir); 