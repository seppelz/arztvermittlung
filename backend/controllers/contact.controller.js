const Contact = require('../models/contact.model');
const { sendEmail } = require('../utils/email');

// Alle Kontaktanfragen abrufen
exports.getAllContacts = async (req, res) => {
  try {
    // Filterobjekt erstellen
    const filter = {};
    
    // Nach Status filtern, falls angegeben
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Sortierung
    const sort = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sort[field.substr(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      // Standardsortierung nach Zeitstempel (neueste zuerst)
      sort.timestamp = -1;
    }

    // Paginierung
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Abfrage ausführen
    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'relatedPostId',
        select: 'title messageType'
      });

    // Gesamtanzahl für Paginierung
    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: contacts.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Einzelne Kontaktanfrage abrufen
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate({
        path: 'relatedPostId',
        select: 'title messageType'
      });
    
    if (!contact) {
      return res.status(404).json({ message: 'Kontaktanfrage nicht gefunden' });
    }
    
    res.status(200).json({
      status: 'success',
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Neue Kontaktanfrage erstellen
exports.createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    
    // E-Mail-Benachrichtigung senden
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'info@med-match.de';
      
      await sendEmail({
        to: adminEmail,
        subject: `Neue Kontaktanfrage: ${req.body.subject || 'Keine Betreffzeile'}`,
        text: `
Neue Kontaktanfrage über das Formular erhalten:

Name: ${req.body.name}
E-Mail: ${req.body.email}
Betreff: ${req.body.subject || 'Keine Betreffzeile'}
Nachricht:
${req.body.message}

Diese Anfrage kann im Admin-Bereich unter "Kontaktanfragen" eingesehen werden.
`,
        html: `
<h2>Neue Kontaktanfrage über das Formular erhalten</h2>
<p><strong>Name:</strong> ${req.body.name}</p>
<p><strong>E-Mail:</strong> ${req.body.email}</p>
<p><strong>Betreff:</strong> ${req.body.subject || 'Keine Betreffzeile'}</p>
<p><strong>Nachricht:</strong></p>
<p style="white-space: pre-line;">${req.body.message}</p>
<p>Diese Anfrage kann im <a href="${process.env.FRONTEND_URL || 'https://www.med-match.de'}/admin/contacts">Admin-Bereich unter "Kontaktanfragen"</a> eingesehen werden.</p>
`
      });
      console.log('Email notification sent for new contact request');
    } catch (emailError) {
      // Logge den Fehler, aber lasse die Anfrage trotzdem erfolgreich sein
      console.error('Failed to send email notification for contact request:', emailError);
    }
    
    res.status(201).json({
      status: 'success',
      data: newContact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Status einer Kontaktanfrage ändern
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'viewed', 'responded'].includes(status)) {
      return res.status(400).json({ message: 'Ungültiger Status' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Kontaktanfrage nicht gefunden' });
    }
    
    res.status(200).json({
      status: 'success',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};

// Kontaktanfrage löschen
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Kontaktanfrage nicht gefunden' });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
  }
};