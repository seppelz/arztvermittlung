const express = require('express');
const bulletinController = require('../controllers/bulletin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const sessionMiddleware = require('../middlewares/session.middleware');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// E-Mail-Benachrichtigung für neue Stellenangebote/-gesuche senden
const sendJobNotificationEmail = async (bulletin) => {
  try {
    // Prüfen, ob es sich um einen Stellenbörse-Eintrag handelt (userType vorhanden)
    if (!bulletin || !bulletin.userType) {
      return;
    }

    // Format für Stellenangebote/-gesuche
    const isJobOffer = bulletin.userType === 'clinic';
    const jobType = isJobOffer ? 'Stellenangebot' : 'Stellengesuch';
    const specialty = bulletin.specialty === 'other' && bulletin.specialtyOther 
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
Von: ${bulletin.name} (${bulletin.email})
Status: ${bulletin.status}
${details}

Inhalt:
${bulletin.content}

Bitte loggen Sie sich im Admin-Bereich ein, um den Eintrag zu prüfen und freizugeben:
https://med-match.de/admin/jobs
`;

    await sendEmail({
      to: process.env.NOTIFICATION_EMAIL || 'info@med-match.de',
      subject: `Neuer ${jobType} auf Med-Match: ${bulletin.title}`,
      text: emailText
    });

    console.log(`Benachrichtigung für neuen ${jobType} gesendet`);
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail-Benachrichtigung:', error);
    // Wir lassen den Prozess weiterlaufen, auch wenn die E-Mail fehlschlägt
  }
};

// Middleware für das Erstellen eines Bulletins mit Benachrichtigung
const createWithNotification = async (req, res) => {
  try {
    // Rufe den ursprünglichen Controller auf und erhalte das erstellte Bulletin zurück
    const newBulletin = await bulletinController.createBulletin(req, res);
    
    // Wenn ein Bulletin erfolgreich erstellt wurde und den Status "pending" hat, sende eine Benachrichtigung
    if (newBulletin && newBulletin.status === 'pending') {
      await sendJobNotificationEmail(newBulletin);
    }
  } catch (error) {
    console.error('Fehler in createWithNotification Middleware:', error);
    // Wir müssen hier nichts tun, da der Controller bereits eine Antwort gesendet hat
  }
};

// Public routes (no auth required)
router.get('/', bulletinController.getAllBulletins);
router.get('/search', bulletinController.searchBulletins);
router.get('/:id', bulletinController.getBulletin);

// Guest routes (require session)
router.post('/', sessionMiddleware.validateSession, bulletinController.createBulletin);
router.post('/:bulletinId/replies', sessionMiddleware.validateSession, bulletinController.addReply);

// Protected routes (require auth)
router.use(authMiddleware.protect);

// User-specific routes
router.get('/user/bulletins', bulletinController.getUserBulletins);

// Bulletin management routes
router.patch('/:id', bulletinController.updateBulletin);
router.delete('/:id', bulletinController.deleteBulletin);
router.patch('/:bulletinId/replies/:replyId', bulletinController.updateReply);
router.delete('/:bulletinId/replies/:replyId', bulletinController.deleteReply);

// Admin routes
router.use(authMiddleware.restrictToAdmin);
router.patch('/:id/status', bulletinController.updateBulletinStatus);

module.exports = router; 