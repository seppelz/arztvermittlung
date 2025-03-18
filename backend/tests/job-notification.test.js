/**
 * Job Notification Email Test Script
 * 
 * This script tests the job notification email functionality specifically.
 * Run with: node backend/tests/job-notification.test.js
 */

require('dotenv').config(); // Load environment variables
const { sendEmail } = require('../utils/email');
const nodemailer = require('nodemailer');

// Ensure EMAIL_SECURE is set correctly for port 587 (STARTTLS)
process.env.EMAIL_SECURE = 'false';
console.log('Setting EMAIL_SECURE to false for STARTTLS');

async function createTestAccount() {
  console.log('Creating test account with Ethereal...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Test account created successfully');
    
    // Set environment variables for the test
    process.env.EMAIL_HOST = 'smtp.ethereal.email';
    process.env.EMAIL_PORT = 587;
    process.env.EMAIL_USER = testAccount.user;
    process.env.EMAIL_PASSWORD = testAccount.pass;
    process.env.EMAIL_SECURE = 'false';
    
    return testAccount;
  } catch (error) {
    console.error('Error creating test account:', error);
    throw error;
  }
}

// Simulates the sendJobNotificationEmail function from bulletin.routes.js
async function sendJobNotificationEmail(bulletin) {
  try {
    // Check if it's a job bulletin (has userType)
    if (!bulletin || !bulletin.userType) {
      console.log('Not a job bulletin, skipping notification');
      return;
    }

    // Format for job offers/requests
    const isJobOffer = bulletin.userType === 'Klinik';
    const jobType = isJobOffer ? 'Stellenangebot' : 'Stellengesuch';
    const specialty = bulletin.specialty === 'Sonstige' && bulletin.specialtyOther 
      ? bulletin.specialtyOther 
      : bulletin.specialty || 'Nicht angegeben';
    
    let details = '';
    if (isJobOffer) {
      details = `
Bundesland: ${bulletin.federalState || 'Nicht angegeben'}
Fachrichtung: ${specialty}
Verfügbar ab: ${bulletin.startDate ? new Date(bulletin.startDate).toLocaleDateString('de-DE') : 'Nicht angegeben'}`;
    } else {
      details = `
Fachrichtung: ${specialty}
Verfügbar ab: ${bulletin.startDate ? new Date(bulletin.startDate).toLocaleDateString('de-DE') : 'Nicht angegeben'}`;
    }

    const emailText = `Ein neuer Eintrag in der Stellenbörse wurde erstellt und wartet auf Freigabe.

Typ: ${jobType}
Titel: ${bulletin.title}
Von: ${bulletin.name || 'Anonym'} (${bulletin.email})
Status: ${bulletin.status}
${details}

Inhalt:
${bulletin.content}

Bitte loggen Sie sich im Admin-Bereich ein, um den Eintrag zu prüfen und freizugeben:
https://med-match.de/admin/jobs
`;

    console.log('Sending job notification email with the following content:');
    console.log('-------------------------------------------');
    console.log(emailText);
    console.log('-------------------------------------------');

    const result = await sendEmail({
      to: process.env.NOTIFICATION_EMAIL || 'admin@example.com',
      subject: `Neuer ${jobType} auf Med-Match: ${bulletin.title}`,
      text: emailText
    });

    console.log(`Benachrichtigung für neuen ${jobType} gesendet`);
    return result;
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail-Benachrichtigung:', error);
    return null;
  }
}

async function runTest() {
  try {
    // Use Ethereal for testing
    await createTestAccount();
    
    // Create a test clinic job offer
    console.log('Testing job offer notification (clinic)...');
    const jobOffer = {
      userType: 'Klinik',
      messageType: 'Angebot',
      title: 'Facharzt für Kardiologie gesucht',
      name: 'Universitätsklinikum Berlin',
      email: 'jobs@ukb-example.de',
      specialty: 'Kardiologie',
      federalState: 'Berlin',
      startDate: new Date('2023-12-01'),
      status: 'pending',
      content: 'Wir suchen zur Verstärkung unseres Teams einen erfahrenen Facharzt für Kardiologie. Wir bieten eine übertarifliche Vergütung und flexible Arbeitszeiten.'
    };
    
    await sendJobNotificationEmail(jobOffer);
    
    // Create a test doctor job request
    console.log('\nTesting job request notification (doctor)...');
    const jobRequest = {
      userType: 'Arzt',
      messageType: 'Gesuch',
      title: 'Erfahrener Anästhesist sucht neue Herausforderung',
      name: 'Dr. Michael Müller',
      email: 'dr.mueller@example.com',
      specialty: 'Anästhesiologie',
      startDate: new Date('2023-11-15'),
      status: 'pending',
      content: 'Facharzt für Anästhesiologie mit 10 Jahren Berufserfahrung sucht neue Herausforderung in Norddeutschland. Flexibel und teamorientiert.'
    };
    
    await sendJobNotificationEmail(jobRequest);
    
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

// Run the test
runTest()
  .then(success => {
    console.log(success ? 'Job notification test completed successfully!' : 'Job notification test failed.');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 