const nodemailer = require('nodemailer');

// Erstelle einen E-Mail-Transporter basierend auf den Umgebungsvariablen
const createTransporter = () => {
  // Default-Konfiguration für den Entwicklungsmodus
  const devConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // Port 587 verwendet STARTTLS
    auth: {
      user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.EMAIL_PASSWORD || 'ethereal_password'
    }
  };

  // Produktionskonfiguration aus Umgebungsvariablen
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  
  // Automatisch secure basierend auf dem Port setzen, falls nicht explizit angegeben
  let secure = process.env.EMAIL_SECURE === 'true';
  
  // Für Port 587 muss secure=false sein (STARTTLS), für Port 465 muss secure=true sein (SSL/TLS)
  if (port === 587 && secure === true) {
    console.warn('Warning: Port 587 verwendet STARTTLS. EMAIL_SECURE wird auf "false" gesetzt.');
    secure = false;
  } else if (port === 465 && secure === false) {
    console.warn('Warning: Port 465 verwendet SSL/TLS. EMAIL_SECURE wird auf "true" gesetzt.');
    secure = true;
  }
  
  const prodConfig = {
    host: process.env.EMAIL_HOST,
    port: port,
    secure: secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  };

  // Verwende Produktionskonfiguration, wenn alle erforderlichen Variablen vorhanden sind
  const config = (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
    ? prodConfig
    : devConfig;

  return nodemailer.createTransport(config);
};

/**
 * Sendet eine E-Mail
 * @param {Object} options - E-Mail-Optionen
 * @param {string} options.to - Empfänger-E-Mail-Adresse
 * @param {string} options.subject - Betreff der E-Mail
 * @param {string} options.text - Text-Version des E-Mail-Inhalts
 * @param {string} options.html - HTML-Version des E-Mail-Inhalts (optional)
 * @returns {Promise} - Promise, das nach dem Senden aufgelöst wird
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'MedMatch <info@med-match.de>',
      to: options.to,
      subject: options.subject,
      text: options.text,
    };

    if (options.html) {
      mailOptions.html = options.html;
    }

    const info = await transporter.sendMail(mailOptions);
    
    console.log('E-Mail erfolgreich gesendet:');
    console.log('  Nachrichten-ID:', info.messageId);
    
    // Wenn wir in der Entwicklungsumgebung sind und Ethereal verwenden, geben wir die Vorschau-URL aus
    if (process.env.NODE_ENV !== 'production' && info.previewUrl) {
      console.log('  Vorschau-URL:', info.previewUrl);
    }
    
    return info;
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
}; 