# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [Unreleased]

### Hinzugefügt
- Admin-Komponente für die Benutzerverwaltung mit Filter-, Such- und Paginierungsfunktionen
- Admin-Komponente für die Verwaltung von Schwarzbrett-Einträgen mit CRUD-Funktionalität
- Admin-Komponente für die Verwaltung von Kontaktanfragen mit Statusverwaltung
- Admin-Komponente für Systemeinstellungen mit verschiedenen Konfigurationsbereichen
- Admin-Bereich mit Konfiguration der Zugriffsberechtigungen
- Admin-Dashboard mit Übersichtsstatistiken und Schnellzugriff
- Backend-Setup mit MongoDB-Datenbank und Express.js
- API-Endpunkte für Benutzer, Schwarzbrett-Einträge und Kontaktanfragen
- JWT-basierte Authentifizierung für geschützte API-Routen
- Registrierungs- und Login-Funktionalität für Administratoren
- Frontend-Services für API-Zugriff (auth, user, bulletin, contact)
- Verbindung zwischen Frontend und Backend für Admin-Komponenten
- Benutzerregistrierung mit Formularvalidierung und Benutzertyp-Auswahl (Arzt/Klinik)
- Login-Seite mit Formularvalidierung und Erinnerungsfunktion
- Profilseite für Benutzer mit Anzeige der Kontoinformationen
- Toast-Benachrichtigungssystem für Benutzer-Feedback
- Pinia-Store für zentralisierte Zustandsverwaltung
- Authentifizierungsservice mit JWT-Token-Management
- Benutzerservice für Profilmanagement
- Responsive navigation with mobile menu support
- Navigation login/register buttons for better accessibility
- Guest access option for demonstration purposes
- Verbesserte Vercel-Deployment-Konfiguration für Frontend und Backend
- Testskript für Deployment-Überprüfung vor Produktivschaltung
- Umgebungsvariablen-Template für einfache Konfiguration
- Seed-Skript für die Erstellung von Testbenutzern in der Produktionsdatenbank
- MongoDB Atlas Integration für Produktionsdatenbank

### Verbessert
- Implementierung von responsiven Datenfiltern für alle Admin-Ansichten
- Optimierte Tabellen-Layouts für bessere Datenübersicht
- Modale Detailansichten für Kontaktanfragen
- Intuitive Statusverwaltung mit farblicher Kennzeichnung
- Lokale MongoDB-Installation für Entwicklungsumgebung
- CORS-Konfiguration für sichere API-Zugriffe
- Routing mit rollenbasierter Zugriffskontrolle
- Authentifizierungs-Workflow mit JWT-Token-Management
- Verbesserte Benutzeroberfläche mit Ladezuständen und Fehlerbehandlung
- Optimierte Formularvalidierung mit Echtzeit-Feedback
- Erweiterte Backend-Authentifizierung für verschiedene Benutzertypen
- Login options updated to use guest access instead of admin credentials
- Benutzertyp-Schema im Mongoose-Modell um 'Gast' für Demo-Zugang erweitert
- Deployment-Prozess für einfachere Inbetriebnahme

### Behoben
- Fehlende Registrierungsfunktion im Backend hinzugefügt
- Validierungsprobleme bei der Benutzerregistrierung behoben
- MongoDB-Verbindungsprobleme durch lokale Installation gelöst
- Fehler bei der Benutzeranmeldung für Nicht-Admin-Benutzer behoben
- Probleme mit fehlenden Routen für Login und Registrierung behoben
- Added proper error handling for API requests
- Navigation menu accessibility on mobile devices
- Security improvements for authentication system
- Usertype validation error bei der Erstellung von Gast-Benutzern behoben

## [0.1.0] - 2025-03-13

### Added
- Pinnwand (Bulletin Board) zum direkten Austausch zwischen Ärzten und Kliniken
- Nachrichtenfilter- und Sortiersystem für die Pinnwand
- Kontaktsystem für Pinnwand-Nachrichten
- Verbesserte Farbpalette mit medizinischen Themenfarben und besseren Kontrasten
- Neue Typografie mit verbesserten Lesbarkeits- und Hierarchiestandards
- Gradienten für visuelles Interesse und moderne Ästhetik
- Umfangreiche Komponentenbibliothek mit konsistenten Stilen (Karten, Schaltflächen, Abzeichen, Warnungen)
- Modulare Layout-Komponenten für konsistente Seitenstrukturen
- Optimierte Formularkomponenten mit verbesserten visuellen Hinweisen
- Mobile Optimierungen für alle Komponenten und Seiten

### Changed
- Vollständig überarbeitetes Farbschema mit besserer Zugänglichkeit und Hierarchie
- Header- und Footer-Redesign für bessere Benutzerführung
- Verbesserte visuelle Hierarchie von Überschriften und Textelementen
- Optimierte Seitenstruktur mit verbesserten Abständen und Layout
- Modernisiertes Design mit Schattierungs- und Tiefeneffekten
- Verbesserte Form- und Interaktionsdesigns
- Konsistente Anwendung von Design-Token im gesamten Projekt
- Optimiertes Layout der Pinnwand-Seite mit Nachrichten vor dem Eingabeformular für verbesserte UX
- Kompakteres, breiteres Formular-Design auf der Pinnwand-Seite für effizientere Platznutzung
- Verbesserte Eingabefelder mit optimierten Abständen und responsivem Grid-Layout

### Fixed
- CSS-Konfigurationsprobleme bei der Tailwind-Integration
- Inkonsistente Farben und Kontraste zwischen verschiedenen Seitenelementen
- Probleme mit der Sichtbarkeit von Formularelementen
- Symbolgrößenprobleme und Ausrichtung in der Benutzeroberfläche
- Layout-Probleme auf mobilen Geräten
- Designinkonsistenzen zwischen Komponenten
- Unzugängliche Farbkontraste für Benutzer mit Sehbehinderungen

## [0.0.1] - 2025-02-15

### Added
- Initialer Projektaufbau
- Grundlegende Vue.js-App-Struktur mit Vue Router
- Tailwind CSS Integration
- Basisseiten (Home, ForDoctors, ForHospitals, About, Contact)
- Grundlegende Komponenten (Header, Footer, Forms)

### Changed
- Initial project setup with Vue.js and Tailwind CSS
- Responsive layout with header and footer components
- Home page with hero section, features, and benefits
- Doctor registration form with comprehensive fields
- Hospital registration form with detailed information collection
- About page with mission statement and company information
- Contact page with form and company details
- 404 Not Found page
- Basic routing setup with Vue Router
- Custom color scheme and branding elements
- SVG assets for logo and hero image
- Privacy Policy page with GDPR compliant information
- Terms and Conditions page with comprehensive legal details
- Imprint page (Impressum) for German legal compliance
- Team page showcasing leadership and team members
- Navigation links in header and footer for all pages 
- Project configuration for Vercel deployment
- Comprehensive documentation in README.md
- Enhanced Vercel configuration for proper static asset handling
- Optimized Vite build configuration for production
- Improved color palette with stronger heading colors
- Enhanced typography with better font weights
- Bulletin board page for direct communication between doctors and hospitals
- Message filtering and sorting system for bulletin board
- Contact system for bulletin board messages

### Fixed
- CSS configuration for Tailwind CSS integration
- Icon sizing issues in HomePage component
- CSS import order in main.css 
- Downgraded from Tailwind CSS 4.0 to stable Tailwind CSS 3.3 version
- Simplified CSS structure for better compatibility
- Optimized container width configuration for full-width layout
- Improved responsive image handling
- Fixed layout issues in App and HomePage components 
- Resolved PostCSS import warning by moving base.css import before Tailwind directives
- Fixed MIME type errors in Vercel deployment by improving routes configuration
- Resolved asset loading issues in production environment
- Improved contrast of headings for better readability
- Enhanced visual hierarchy with stronger heading styles 
- Strengthened h2 heading colors for better visibility and hierarchy 