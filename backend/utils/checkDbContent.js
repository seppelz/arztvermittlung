const mongoose = require('mongoose');
const User = require('../models/user.model');
const Bulletin = require('../models/bulletin.model');
const Contact = require('../models/contact.model');
require('dotenv').config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tlsAllowInvalidCertificates: true
    });
    console.log('MongoDB connected for checking content...');
    
    // Check all collections
    const userCount = await User.countDocuments();
    console.log(`Users collection: ${userCount} documents`);
    
    const bulletinCount = await Bulletin.countDocuments();
    console.log(`Bulletin collection: ${bulletinCount} documents`);
    
    // List bulletin titles if any exist
    if (bulletinCount > 0) {
      const bulletins = await Bulletin.find().sort('-timestamp').limit(5);
      console.log('\nMost recent bulletin entries:');
      bulletins.forEach((b, i) => {
        console.log(`${i+1}. ${b.title} (${new Date(b.timestamp).toLocaleDateString()})`);
      });
    }
    
    const contactCount = await Contact.countDocuments();
    console.log(`\nContact collection: ${contactCount} documents`);
    
    // List contact requests if any exist
    if (contactCount > 0) {
      const contacts = await Contact.find().sort('-createdAt').limit(5);
      console.log('\nMost recent contact requests:');
      contacts.forEach((c, i) => {
        console.log(`${i+1}. From: ${c.name} - To: ${c.recipientName}`);
      });
    }
    
    // Check collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAll collections in database:');
    collections.forEach(coll => console.log(`- ${coll.name}`));
    
  } catch (err) {
    console.error('Error checking database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

checkDatabase(); 