const mongoose = require('mongoose');
const User = require('../models/user.model');
const Bulletin = require('../models/bulletin.model');
const Contact = require('../models/contact.model');
require('dotenv').config();

// Parse command line arguments
const args = process.argv.slice(2);
const FORCE_SEED = args.includes('--force');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tlsAllowInvalidCertificates: true
    });
    console.log('MongoDB connected for seeding...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const clearCollections = async () => {
  try {
    // Only clear the collections we're going to seed
    if (FORCE_SEED) {
      await Bulletin.deleteMany({});
      await Contact.deleteMany({});
      console.log('Collections cleared for forced seeding.');
    }
  } catch (err) {
    console.error('Error clearing collections:', err);
    process.exit(1);
  }
};

// Check the User schema to ensure we're using the correct fields
const inspectUserSchema = () => {
  const userSchema = User.schema.obj;
  console.log('User schema required fields:');
  Object.keys(userSchema).forEach(key => {
    const field = userSchema[key];
    if (field.required) {
      console.log(`- ${key}: ${field.type.name} (required)`);
    }
  });
};

// Inspect contact schema
const inspectContactSchema = () => {
  const contactSchema = Contact.schema.obj;
  console.log('Contact schema status enum values:');
  if (contactSchema.status && contactSchema.status.enum) {
    console.log('Status enum values:', contactSchema.status.enum);
  } else {
    console.log('Status field does not have enum values defined');
  }
};

const seedDummyUsers = async () => {
  try {
    // Inspect schema to understand required fields
    inspectUserSchema();
    
    // Check if we already have users
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0 && !FORCE_SEED) {
      console.log(`${existingUsers} users already exist. Skipping user seeding.`);
      return;
    }

    // Get actual status values from schema to avoid enum errors
    const statusValues = User.schema.path('isVerified') ? [true, false] : [];

    const users = [
      {
        name: 'Gastbenutzer',
        email: 'gast@med-match.de',
        password: '$2a$10$QlwUJNvBSxiV4GnE4PxM1u2qZkxUB22d7aY9G9j2jjFwHGD1bF3Oq', // "password" hashed
        userType: 'Gast',
        isVerified: true,
        username: 'gast' // Add username field which appears to be required
      },
      {
        name: 'Dr. Andreas Müller',
        email: 'dr.mueller@med-match.de',
        password: '$2a$10$QlwUJNvBSxiV4GnE4PxM1u2qZkxUB22d7aY9G9j2jjFwHGD1bF3Oq', // "password" hashed
        userType: 'Arzt',
        isVerified: true,
        username: 'dr.mueller'
      },
      {
        name: 'Universitätsklinikum Dresden',
        email: 'personal@uniklinikum-dresden.de',
        password: '$2a$10$QlwUJNvBSxiV4GnE4PxM1u2qZkxUB22d7aY9G9j2jjFwHGD1bF3Oq', // "password" hashed
        userType: 'Klinik',
        isVerified: true,
        username: 'uniklinikum'
      }
    ];

    // If forcing, only insert if not already present (by email)
    if (FORCE_SEED) {
      for (const user of users) {
        const exists = await User.findOne({ email: user.email });
        if (!exists) {
          try {
            await User.create(user);
            console.log(`Created user: ${user.name}`);
          } catch (err) {
            console.error(`Error creating user ${user.email}:`, err.message);
          }
        } else {
          console.log(`User ${user.email} already exists, skipping.`);
        }
      }
    } else {
      try {
        await User.insertMany(users);
      } catch (err) {
        console.error('Error inserting users:', err.message);
      }
    }
    
    console.log(`User seeding completed.`);
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

const seedBulletinEntries = async () => {
  try {
    // Check if we already have bulletin entries
    const existingEntries = await Bulletin.countDocuments();
    if (existingEntries > 0 && !FORCE_SEED) {
      console.log(`${existingEntries} bulletin entries already exist. Skipping bulletin seeding.`);
      return;
    }

    // Create some realistic bulletin entries
    const bulletinEntries = [
      {
        name: 'Ärztekammer Berlin',
        email: 'fortbildung@aerztekammer-berlin.de',
        userType: 'Klinik',
        messageType: 'Information',
        title: 'Fortbildung: Aktuelle Entwicklungen in der Notfallmedizin',
        content: 'Die Ärztekammer Berlin bietet am 15.-16.06.2025 eine zertifizierte Fortbildung zu aktuellen Entwicklungen in der Notfallmedizin an. 16 CME-Punkte. Begrenzte Teilnehmerzahl, frühzeitige Anmeldung empfohlen. Für weitere Informationen besuchen Sie bitte unsere Website oder kontaktieren Sie uns direkt.',
        timestamp: new Date('2025-03-01T10:00:00'),
        privacyPolicyAccepted: true
      },
      {
        name: 'Dr. Thomas Schmidt',
        email: 't.schmidt@facharzt.de',
        userType: 'Arzt',
        messageType: 'Information',
        title: 'Fachärztlicher Vertretungs-Pool Radiologie',
        content: 'Ich organisiere einen Vertretungs-Pool für kurzfristige Radiologie-Einsätze (max. 3 Monate). Über 20 Kolleginnen und Kollegen sind bereits dabei. Interessierte Radiologen und Kliniken können mich gerne kontaktieren. Wir bieten flexible Einsatzzeiten und faire Konditionen für alle Beteiligten.',
        timestamp: new Date('2025-03-08T11:20:00'),
        privacyPolicyAccepted: true
      },
      {
        name: 'Medizinische Hochschule Hannover',
        email: 'kongress@mh-hannover.de',
        userType: 'Klinik',
        messageType: 'Information',
        title: 'Internationaler Kongress für Innere Medizin',
        content: 'Vom 10.-12.07.2025 findet an der MH Hannover der 35. Internationale Kongress für Innere Medizin statt. Themenschwerpunkte: Kardiologie, Gastroenterologie, Endokrinologie. Anmeldung ab sofort möglich. Frühbucherrabatt bis zum 15.05.2025. Wir freuen uns auf Ihre Teilnahme an diesem wichtigen Fachkongress.',
        timestamp: new Date('2025-02-28T14:30:00'),
        privacyPolicyAccepted: true
      },
      {
        name: 'Universitätsklinikum Dresden',
        email: 'personal@uniklinikum-dresden.de',
        userType: 'Klinik',
        messageType: 'Angebot',
        title: 'Oberarzt (m/w/d) für Neurologie',
        content: 'Das Universitätsklinikum Dresden sucht einen Oberarzt (m/w/d) für die Abteilung Neurologie. Wir bieten eine übertarifliche Vergütung, flexible Arbeitszeiten und exzellente Forschungsmöglichkeiten. Bewerber sollten über eine Facharztausbildung Neurologie und mehrjährige klinische Erfahrung verfügen. Wir freuen uns auf Ihre Bewerbung!',
        timestamp: new Date('2025-03-10T09:15:00'),
        privacyPolicyAccepted: true
      },
      {
        name: 'Dr. Laura Meyer',
        email: 'l.meyer@arztpraxis.de',
        userType: 'Arzt',
        messageType: 'Gesuch',
        title: 'Facharzt für Allgemeinmedizin sucht Praxisvertretung',
        content: 'Als Facharzt für Allgemeinmedizin mit 8 Jahren Berufserfahrung suche ich eine Praxisvertretung im Raum München für 3-6 Monate ab September 2025. Flexible Arbeitszeiten möglich, gerne auch Teilzeit. Ich bringe umfangreiche Erfahrung in der ambulanten Versorgung mit und bin an einer kollegialen Zusammenarbeit interessiert.',
        timestamp: new Date('2025-03-05T16:45:00'),
        privacyPolicyAccepted: true
      }
    ];

    try {
      await Bulletin.insertMany(bulletinEntries);
      console.log(`${bulletinEntries.length} bulletin entries seeded.`);
    } catch (err) {
      console.error('Error inserting bulletin entries:', err.message);
    }
  } catch (err) {
    console.error('Error seeding bulletin entries:', err);
  }
};

const seedContactRequests = async () => {
  try {
    // Inspect contact schema to understand requirements
    inspectContactSchema();
    
    // Check if we already have contact requests
    const existingContacts = await Contact.countDocuments();
    if (existingContacts > 0 && !FORCE_SEED) {
      console.log(`${existingContacts} contact requests already exist. Skipping contact seeding.`);
      return;
    }

    // Create some sample contact requests with correct enum values
    const contactRequests = [
      {
        name: 'Dr. Maria Schneider',
        email: 'maria.schneider@arzt.de',
        message: 'Ich interessiere mich für die Fortbildung zur Notfallmedizin. Ist eine Teilnahme auch online möglich?',
        recipientName: 'Ärztekammer Berlin',
        recipientEmail: 'fortbildung@aerztekammer-berlin.de',
        messageTitle: 'Fortbildung: Aktuelle Entwicklungen in der Notfallmedizin',
        status: 'pending', // Using the actual enum value from schema
        createdAt: new Date('2025-03-12T14:22:00')
      },
      {
        name: 'Klinikum Nürnberg',
        email: 'radiologie@klinikum-nuernberg.de',
        message: 'Wir suchen dringend eine Vertretung für unsere Radiologie-Abteilung für 6 Wochen ab Mai. Ist das über Ihren Pool möglich?',
        recipientName: 'Dr. Thomas Schmidt',
        recipientEmail: 't.schmidt@facharzt.de',
        messageTitle: 'Fachärztlicher Vertretungs-Pool Radiologie',
        status: 'responded', // Using the actual enum value from schema
        createdAt: new Date('2025-03-10T09:45:00')
      }
    ];

    try {
      await Contact.insertMany(contactRequests);
      console.log(`${contactRequests.length} contact requests seeded.`);
    } catch (err) {
      console.error('Error inserting contact requests:', err.message);
    }
  } catch (err) {
    console.error('Error seeding contact requests:', err);
  }
};

const seedDatabase = async () => {
  await connectDB();
  
  // Always call clearCollections which will only clear if FORCE_SEED is true
  await clearCollections();
  
  await seedDummyUsers();
  await seedBulletinEntries();
  await seedContactRequests();
  
  console.log('Database seeding completed!');
  process.exit(0);
};

// Run the seeding
seedDatabase(); 