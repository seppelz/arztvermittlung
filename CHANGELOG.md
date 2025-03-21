# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Improved
- Enhanced header branding with white MedMatch text for better contrast and visibility
- Increased spacing between navigation items in header menu for improved readability
- Added more separation between MedMatch logo/text and navigation menu for better visual hierarchy
- Stellenbörse: Nachrichten werden anonymisiert angezeigt, um die Vermittlung über die Plattform zu fördern
- Stellenformular erweitert mit Feldern für Fachrichtung, Bundesland und Verfügbarkeitsdatum
- Neuer Moderationsprozess für Stellenangebote und -gesuche (Admin-Freigabe erforderlich)
- Stellenbörse (vormals Arztbörse): Name ist nun optional und wird nicht mehr angezeigt
- Überarbeitetes Kontaktformular für vereinfachte Benutzerinteraktion
- Angepasste Formulartexte für bessere Benutzerführung bei der Erstellung von Angeboten und Gesuchen
- Überarbeitete Seitentexte für klarere Kommunikation und bessere Benutzererfahrung
- Enhanced hero section with modern animations and interactive elements for better user engagement
- Replaced smiley doctor illustration with professional medical silhouette for more professional appearance
- Added medical network visualization with connecting elements to emphasize the platform's networking aspect
- Implemented professional medical icons and symbols to reinforce the medical focus
- Replaced statistics counters with network highlight features to better represent the platform's purpose
- Improved header menu spacing for better readability and professional appearance
- Implemented custom CSS animations for a more polished and professional appearance
- Improved call-to-action buttons with hover effects and directional indicators
- Simplified hero section to focus on core platform functionality (bulletin board and minimal registration)
- Added preview of bulletin board entries in hero section to showcase the platform's main feature
- Adjusted messaging to accurately reflect current platform capabilities without overpromising
- Improved information architecture with clearer user path to bulletin board functionality
- Fixed heading text colors throughout the site for better readability and contrast
- Replaced generic 'text-heading' class with specific color classes for consistent typography
- Enhanced text contrast in hero section by ensuring white text on dark backgrounds
- Improved footer text visibility by changing text colors from neutral-200/300 to white for better contrast
- Enhanced footer section borders with increased opacity for better visual separation
- Improved social media icons in footer with higher contrast background colors
- Updated site logo in header to new Med-MATCH.png for improved brand identity
- Increased logo size in header and footer for better visibility and brand recognition
- Streamlined navigation by removing Team menu item for more focused user experience
- Removed specific percentage claims about doctor earnings to avoid potential legal issues
- Updated MongoDB connection configuration to follow current best practices by removing deprecated options
- Improved MongoDB Atlas connection security by removing unnecessary SSL/TLS options
- Enhanced API URL handling for custom domain with robust fallback system
- Updated demo data with real medical congress information for more accurate content
- Updated demo data with real medical congress information for more accurate content
- Enhanced hero section with better spacing and readability
- Improved MongoDB connection configuration for better reliability
- Better handling of API URL configuration across components
- Enhanced email utility with automatic port-based TLS configuration
- Improved error handling for email sending with detailed logging
- Added safety mechanism to ensure proper STARTTLS/SSL configuration for different SMTP ports
- Optimierte Formulare für Ärzte, Kliniken und Pinnwand mit vereinfachter Feldstruktur für bessere Benutzererfahrung
- Reduzierte Pflichtfelder in allen Formularen zur Senkung der Einstiegshürden
- Umwandlung von Dropdown-Auswahlen zu Freitextfeldern für mehr Flexibilität bei Fachrichtungen
- Fachrichtung-Feld zur Pinnwand hinzugefügt für verbesserte Kategorisierung von Informationen
- Stellenbörse: Fachrichtung-Feld in ein optionales Textfeld umgewandelt für mehr Flexibilität
- Titel-Feld aus dem Stellenformular entfernt und durch automatische Titel-Generierung ersetzt
- Verbesserte Darstellung von Stellenanzeigen mit klaren Informationen wie Fachrichtung, Bundesland und Startdatum
- Seed-Daten aktualisiert mit Bundesland- und Fachrichtungs-Informationen für relevantere Beispieleinträge
- Stellenbörse-Formular vereinfacht und fokussiert auf die wichtigsten Informationen
- Verbesserte Admin-Oberfläche für Pinnwand-Einträge mit vollständiger Unterstützung aller Datenbankfelder
- Enhanced Admin UI with comprehensive bulletin edit form aligned with database model
- Updated default API URL to point to production server for reliable data retrieval in the admin panel
- Replaced dummy data in Admin Dashboard with real-time activity data from the database

### Security
- Changed MongoDB Atlas password to improve database security
- Removed hardcoded MongoDB credentials from test files and replaced with environment variables
- Created .env.example template file to demonstrate proper credential management
- Updated MongoDB connection test files to use environment variables for secure credential handling

### Fixed
- Fixed issue with job listings in Stellenbörse not being saved to the database by connecting the form to the bulletin API
- Fixed grid layout in Stellenbörse to display job listings in cards next to each other (3 columns on large screens)
- Removed demo data from Stellenbörse and Admin components to ensure only real database entries are displayed
- Enhanced logging in AdminBulletin and AdminJobs components for better troubleshooting of data loading issues
- Fixed MongoDB Atlas connection issues by disabling SSL validation
- Added test users to MongoDB Atlas database for guest login functionality
- Fixed CORS issues with Vercel deployment by updating API URL configuration
- Updated CORS configuration to allow requests from Vercel domain
- Fixed admin login issue by correctly checking the user role in the response structure
- Fixed seeding script to properly reset and populate empty collections
- Fixed inconsistency between what the seeding script detected as "existing" entries
- Fixed API URL construction in frontend components to handle both development and production environments
- Fixed custom domain API URL configuration with global runtime configuration approach
- Fixed API URL configuration in BulletinBoardPage.vue to use the global config before falling back to environment variables
- Fixed CORS issue when adding new bulletin entries
- Fehlerhafte div-Struktur im Kontaktformular korrigiert
- Fixed axios import in bulletin.service.js to use the configured api instance with proper base URL and interceptors
- Enhanced MongoDB connection options to fix SSL-related issues in production
- Improved error handling and diagnostics in server.js for better troubleshooting
- Added detailed logging in bulletin controller and auth controller for better error diagnostics
- Fixed import path in bulletin.routes.js to correctly reference auth.middleware from middlewares directory
- Fixed admin dashboard bulletin display by updating API URL configuration to point to production server
- Enhanced bulletin service to handle different API response formats
- Fixed bulletin service API endpoints to correctly use '/bulletin' instead of '/bulletins' to match backend routes
- Fixed Vue Router SyntaxError by updating API URL to use www subdomain (https://www.med-match.de/api)
- Added robust error handling to router configuration to prevent cryptic parsing errors
- Enhanced app initialization with proper error catching to provide better diagnostic information
- Fixed dynamic import issues by adding fallback routes when component loading fails
- Fixed date display in Stellenbörse job listings to correctly use the selected startDate instead of the publication date
- Fixed Admin Dashboard to display real activity data from database instead of dummy entries
- Fixed rendering of HTML tags in specialty fields of job listings by using v-html directive
- Fixed "TypeError: s.filter is not a function" in AdminDashboard by adding proper type checks before using array methods
- Fixed "ReferenceError: api is not defined" in AdminBulletin by removing unnecessary api reference
- Fixed issue with Kontaktanfragen (contact requests) in the admin area to use real contact data from the database instead of dummy data
- Implemented proper contact form submission functionality with backend integration
- Added email notification for new contact requests
- Enhanced contact model with subject and privacy policy fields
- Added loading states and error handling to contact management UI
- Fixed Vue Router error by enhancing error handling and preventing circular dependencies
- Added comprehensive error logging for navigation failures and dynamic import errors
- Enhanced error resilience in auth service to handle edge cases
- Resolved circular dependency issue between router and auth service using dynamic imports
- Improved app initialization sequence to prevent race conditions in component loading
- Enhanced error fallbacks with better user feedback for navigation issues
- Added missing email field to "Für Kliniken" form to ensure proper contact information collection
- Fixed "Für Kliniken" form submissions not being saved to the database by connecting the form to the bulletin API
- Fixed validation error in "Für Kliniken" form by ensuring all required fields are properly formatted
- Implemented bulletin database integration for the "Für Ärzte" form, enabling doctors to submit job requests
- Integrated the "Für Kliniken" and "Für Ärzte" forms with the Stellenbörse, ensuring submissions appear in the job listings
- Weitere Verbesserung der Vue Router Fehlerbehandlung, um rekursive Fehler bei der Navigation zu vermeiden
- Optimierung der Authentifizierungs-Überprüfung mit Cache-Implementierung für bessere Performance
- Umbau des Auth-Service, um direkte zirkuläre Abhängigkeiten zum Router und Pinia zu vermeiden
- Verbessertes Fehlerlogging mit tiefgreifender Analyse von Stacktraces zur Erkennung zirkulärer Abhängigkeiten

### Added
- Created test scripts for MongoDB Atlas connection testing
- Added seed script for creating test users in MongoDB Atlas
- Added production environment configuration for Vercel deployment
- Split bulletin board functionality into two separate pages: "Pinnwand" for information messages and "Arztbörse" for job offers and requests
- Created dedicated "Arztbörse" page to handle job offers from clinics and job requests from doctors
- New menu item "Arztbörse" in main navigation for direct access to the job marketplace
- Automatic message type determination based on user type in Arztbörse (Clinic → Angebot, Doctor → Gesuch)
- Simplified post creation process with clearer user guidance based on user type
- Database seeding mechanism with `--force` option to reset and populate collections
- Database content inspection script for debugging database state
- Backend README with documentation for seeding and API endpoints
- Improved error handling for API requests in frontend components
- Added NewKnowledgeBase.md to document lessons learned and best practices
- Email-Benachrichtigungssystem für neue Stellenangebote/-gesuche
- Verbesserte Bearbeitung von Stellenangeboten/-gesuchen im Admin-Bereich
- E-Mail-Utility für das Versenden von Benachrichtigungen mit Nodemailer
- Test-Skripte für die Überprüfung der E-Mail-Funktionalität im Entwicklungsmodus
- Unterstützung für Ethereal Test-Accounts zum E-Mail-Testing ohne echten SMTP-Server
- Automatische Titel-Generierung für Stellenangebote/-gesuche basierend auf Benutzertyp, Datum und Fachrichtung
- Added phone field to bulletin model for better contact information
- Added privacyPolicyAccepted field as required in bulletin model for GDPR compliance
- Enhanced validation in bulletin controller for more robust form submissions
- Added conditional validation for job listings requiring start date and federal state fields
- Added dashboard.service.js to fetch and aggregate real-time activity data for Admin Dashboard
- Added real-time activity tracking in Admin Dashboard showing latest user registrations and bulletin entries
- Echte Benutzerdaten in AdminUsers-Komponente implementiert
- API-Integration für das Benutzerverzeichnis hinzugefügt
- Filter- und Paginierungsfunktionen für Benutzer
- Bearbeitungsdialog für Benutzerdetails
- Detailansicht für Benutzer
- Verbesserte Fehlerbehandlung in UserService

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
- Verbesserte Position des Logos im Menü für bessere Sichtbarkeit
- Überarbeitung der Hero-Sektion auf der Homepage mit modernerem, strukturierterem Design
- Verbesserte Leserlichkeit durch Anpassung der Header-Farben
- Verbesserte Call-to-Action Buttons mit eindeutigeren Handlungsaufforderungen
- Footer mit verbesserter Sichtbarkeit und klarer strukturierter Information
- Verbesserte Anzeige von Zeitstempeln bei Bulletin-Board Einträgen
- Verbesserte Backend-Connection zu MongoDB Atlas durch Aktualisierung der SSL/TLS-Konfiguration
- Integration der Pinnwand-Einträge auf der Homepage mit Live-Daten vom API mit Fallback zu Demo-Daten
- Erweiterte Server-Logs für bessere Diagnose von Produktions- und Entwicklungsumgebungen

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
- MIME-Typ-Fehler in Vercel-Deployment für statische Assets (CSS, JS, SVG) behoben
- Fehler bei MongoDB-Verbindung behoben (SSL-Zertifikate)
- CORS Konfiguration angepasst um alle lokalen Entwicklungsports zu unterstützen
- Problem mit mehreren parallel laufenden Vite-Servern behoben
- Fehler bei der API-URL Konstruktion behoben, der zu doppelten `/api/` Pfaden führte
- Fehlender API-Aufruf beim Speichern von Pinnwand-Einträgen implementiert, Daten werden nun korrekt in MongoDB gespeichert
- CORS-Konfiguration für Produktionsumgebung verbessert, um Cross-Origin-Anfragen von der Vercel-Bereitstellung zu ermöglichen
- Dummy-Daten im Admin-Dashboard durch echte Echtzeit-Aktivitätsdaten aus der Datenbank ersetzt

### Added
- Implemented Plausible Analytics for privacy-focused user tracking without cookies
- Created analytics service for standardized event tracking across the application
- Added composable for Vue component-specific analytics integration
- Integrated automated page view tracking with Vue Router

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

### Added
- Neuer Seitentitel "Med-Match: Direkte Arzt-Klinik Vermittlung" für bessere SEO
- Meta-Tags für verbesserte Suchmaschinen-Optimierung
- Verwendung des Med-MATCH Logos als Favicon
- Dedizierte Seite für Stellenangebote
- Dedizierte Seite für Stellengesuche
- Darstellung von Stellenanzeigen auf der Startseite
- Funktionalität zum Senden von Kontaktanfragen zu Pinnwand-Einträgen
- Status-API-Endpunkt für einfache Server- und Umgebungsüberprüfung
- Darstellung von Stellenanzeigen auf der Startseite
- Funktionalität zum Senden von Kontaktanfragen zu Pinnwand-Einträgen
- Status-API-Endpunkt für einfache Server- und Umgebungsüberprüfung

### Added
- Backend endpoint for updating bulletin entries
- Tests for bulletin controller
- Backend environment example file

### Fixed
- MongoDB Atlas connection issues
- Bulletin board display and functionality
- Updated demo entries in bulletin board

### Changed
- Updated content on multiple pages (Home, For Doctors, For Hospitals, About, Imprint, Privacy, Terms)
- Improved footer design
- Updated dependencies in package.json

### Added
- Implementierung eines datenschutzkonformen Cookie-Banners zur Einholung der Einwilligung der Nutzer gemäß DSGVO