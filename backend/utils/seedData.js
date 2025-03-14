const mongoose = require('mongoose');
const User = require('../models/user.model');
const Bulletin = require('../models/bulletin.model');
const Contact = require('../models/contact.model');
require('dotenv').config();

// MongoDB-Verbindung
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Mit MongoDB verbunden'))
.catch(err => {
  console.error('MongoDB-Verbindungsfehler:', err);
  process.exit(1);
});

// Admin-Benutzer erstellen
const createAdmins = async () => {
  try {
    // Bestehende Admin-Benutzer löschen
    await User.deleteMany({ role: 'admin' });
    
    // Neue Admin-Benutzer erstellen
    const admins = [
      {
        username: 'siggi',
        email: 'siggi@medmatch.de',
        password: 'Medmatch2023!',
        name: 'Siggi Admin',
        role: 'admin',
        userType: 'Administrator',
        status: 'active'
      },
      {
        username: 'sebas',
        email: 'sebas@medmatch.de',
        password: 'Medmatch2023!',
        name: 'Sebas Admin',
        role: 'admin',
        userType: 'Administrator',
        status: 'active'
      }
    ];
    
    const createdAdmins = await User.create(admins);
    console.log(`${createdAdmins.length} Admin-Benutzer erstellt`);
    
    return createdAdmins;
  } catch (error) {
    console.error('Fehler beim Erstellen der Admin-Benutzer:', error);
    process.exit(1);
  }
};

// Demo-Benutzer erstellen
const createUsers = async () => {
  try {
    // Bestehende normale Benutzer löschen
    await User.deleteMany({ role: 'user' });
    
    // Neue Benutzer erstellen
    const users = [
      // Ärzte
      {
        username: 'drmueller',
        email: 'dr.mueller@beispiel.de',
        password: 'Password123!',
        name: 'Dr. Thomas Müller',
        phone: '0170-1234567',
        role: 'user',
        userType: 'Arzt',
        specialization: 'Innere Medizin',
        profileCompleted: true,
        status: 'active',
        availability: [
          {
            from: new Date('2025-06-01'),
            to: new Date('2025-08-31'),
            location: 'Deutschlandweit'
          }
        ]
      },
      {
        username: 'drweber',
        email: 'dr.weber@beispiel.de',
        password: 'Password123!',
        name: 'Dr. Julia Weber',
        phone: '0171-2345678',
        role: 'user',
        userType: 'Arzt',
        specialization: 'Anästhesie',
        profileCompleted: true,
        status: 'active',
        availability: [
          {
            from: new Date('2025-07-01'),
            to: new Date('2025-07-31'),
            location: 'Köln und Umgebung'
          }
        ]
      },
      
      // Kliniken
      {
        username: 'klinikmuenchen',
        email: 'personal@klinikum-muenchen.de',
        password: 'Password123!',
        name: 'Klinikum München',
        phone: '089-12345678',
        role: 'user',
        userType: 'Klinik',
        location: 'München',
        hospitalSize: 'Groß',
        profileCompleted: true,
        status: 'active'
      },
      {
        username: 'uniklinikfrankfurt',
        email: 'personal@uniklinik-frankfurt.de',
        password: 'Password123!',
        name: 'Universitätsklinikum Frankfurt',
        phone: '069-12345678',
        role: 'user',
        userType: 'Klinik',
        location: 'Frankfurt',
        hospitalSize: 'Groß',
        profileCompleted: true,
        status: 'active'
      }
    ];
    
    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} Benutzer erstellt`);
    
    return createdUsers;
  } catch (error) {
    console.error('Fehler beim Erstellen der Benutzer:', error);
    process.exit(1);
  }
};

// Demo-Pinnwand-Einträge erstellen
const createBulletins = async (users) => {
  try {
    // Bestehende Pinnwand-Einträge löschen
    await Bulletin.deleteMany({});
    
    // Ärzte und Kliniken filtern
    const doctors = users.filter(user => user.userType === 'Arzt');
    const hospitals = users.filter(user => user.userType === 'Klinik');
    
    // Neue Pinnwand-Einträge erstellen
    const bulletins = [
      // Angebote von Kliniken
      {
        title: 'Vertretung Notfallmedizin (2 Wochen) - +30% Vergütung',
        content: 'Suchen dringend Vertretung für unsere Notfallstation vom 15.-29.06.2025. Erfahrung in Notfallmedizin erforderlich. +30% über regulärem Tarif, Unterkunft wird gestellt.',
        name: hospitals[0].name,
        email: hospitals[0].email,
        userId: hospitals[0]._id,
        userType: 'Klinik',
        messageType: 'Angebot',
        timestamp: new Date('2025-05-15T10:30:00'),
        status: 'active'
      },
      {
        title: 'Kardiologie - 3-Monats-Vertretung (übertariflich)',
        content: 'Suchen für den Zeitraum 01.07.-30.09.2025 Facharzt (m/w/d) für unsere kardiologische Abteilung. Vergütung 40% über TV-Ärzte, Dienstwohnung möglich, flexible Dienstplangestaltung.',
        name: hospitals[1].name,
        email: hospitals[1].email,
        userId: hospitals[1]._id,
        userType: 'Klinik',
        messageType: 'Angebot',
        timestamp: new Date('2025-05-10T09:15:00'),
        status: 'active'
      },
      
      // Gesuche von Ärzten
      {
        title: 'Anästhesist verfügbar für Kurzeinsätze bis 4 Wochen',
        content: 'Facharzt für Anästhesie mit 8 Jahren Erfahrung sucht Kurzeinsätze (1-4 Wochen) im Raum Köln ab sofort. Flexibel und kurzfristig verfügbar, auch Wochenenddienste möglich.',
        name: doctors[1].name,
        email: doctors[1].email,
        userId: doctors[1]._id,
        userType: 'Arzt',
        messageType: 'Gesuch',
        timestamp: new Date('2025-05-12T15:45:00'),
        status: 'active'
      },
      {
        title: 'Internist für Kurzeinsätze bis 3 Monate',
        content: 'Facharzt für Innere Medizin mit 12 Jahren Berufserfahrung sucht Vertretungsstellen oder Projekteinsätze für 1-3 Monate. Flexible Zeiteinteilung, auch kurzfristig verfügbar.',
        name: doctors[0].name,
        email: doctors[0].email,
        userId: doctors[0]._id,
        userType: 'Arzt',
        messageType: 'Gesuch',
        timestamp: new Date('2025-05-08T11:20:00'),
        status: 'active'
      }
    ];
    
    const createdBulletins = await Bulletin.create(bulletins);
    console.log(`${createdBulletins.length} Pinnwand-Einträge erstellt`);
    
    return createdBulletins;
  } catch (error) {
    console.error('Fehler beim Erstellen der Pinnwand-Einträge:', error);
    process.exit(1);
  }
};

// Demo-Kontaktanfragen erstellen
const createContacts = async (users, bulletins) => {
  try {
    // Bestehende Kontaktanfragen löschen
    await Contact.deleteMany({});
    
    // Neue Kontaktanfragen erstellen
    const contacts = [
      {
        name: users[2].name,
        email: users[2].email,
        fromUserId: users[2]._id,
        toUserId: users[0]._id,
        relatedPostId: bulletins[3]._id,
        message: 'Sehr geehrter Dr. Müller, wir suchen dringend eine Vertretung für unsere internistische Abteilung im Juli 2025. Wären Sie in diesem Zeitraum verfügbar?',
        timestamp: new Date('2025-05-20T09:30:00'),
        status: 'pending'
      },
      {
        name: users[3].name,
        email: users[3].email,
        fromUserId: users[3]._id,
        toUserId: users[1]._id,
        relatedPostId: bulletins[2]._id,
        message: 'Guten Tag Dr. Weber, wir haben in unserem OP dringenden Bedarf für einen Anästhesisten vom 15.06.-15.07.2025. Hätten Sie Interesse an dieser Position?',
        timestamp: new Date('2025-05-18T14:15:00'),
        status: 'viewed'
      }
    ];
    
    const createdContacts = await Contact.create(contacts);
    console.log(`${createdContacts.length} Kontaktanfragen erstellt`);
    
    return createdContacts;
  } catch (error) {
    console.error('Fehler beim Erstellen der Kontaktanfragen:', error);
    process.exit(1);
  }
};

// Alle Seed-Funktionen ausführen
const seedAll = async () => {
  try {
    const admins = await createAdmins();
    const users = await createUsers();
    const bulletins = await createBulletins([...users]);
    const contacts = await createContacts([...users], [...bulletins]);
    
    console.log('Seed-Daten erfolgreich erstellt');
    process.exit(0);
  } catch (error) {
    console.error('Fehler beim Erstellen der Seed-Daten:', error);
    process.exit(1);
  }
};

// Seed-Funktionen ausführen
seedAll(); 