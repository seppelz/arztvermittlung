# MedMatch Knowledge Base

## Farbpalette und Designsystem

### Optimierte Farbpalette für medizinische Plattformen

1. **Primärfarben für medizinische Webplattformen**:
   - Nutzung von hellen, klaren Blautönen (`#0CA5E9`) als Hauptfarbe vermittelt Vertrauen und Professionalität
   - Komplementäre Warm-Grün Töne (`#16B378`) für Sekundärelemente schaffen Assoziationen mit Gesundheit und Wohlbefinden
   - Akzent-Violett (`#AD55FF`) für gezielte Hervorhebungen, die Aufmerksamkeit lenken ohne zu überwältigen

2. **Farbharmonie und Kontraste**:
   - Kombination aus kühlen und warmen Farbtönen erzeugt dynamische, einladende Benutzeroberflächen
   - Sorgfältig ausgewählte Kontrastverhältnisse (mindestens 4.5:1) für Textlesbarkeit nach WCAG-Standards
   - Nutzung von Farbverläufen erzeugt Tiefe und modernes Erscheinungsbild ohne 3D-Effekte zu überstrapazieren

3. **Semantische Farbzuweisung**:
   - Statusfarben (Erfolg, Warnung, Fehler, Info) mit jeweils hellen und dunklen Varianten für flexible Anwendung
   - Spezialisierte Textfarben für Überschriften (`#102A43`) und Fließtext (`#334E68`) zur Verbesserung der Leseführung
   - Hintergrundabstufungen von weiß bis leichtes Neutralgrau für hierarchische Seiten-Layouts

### Moderne Designprinzipien für Medizinplattformen

1. **Karten-basierte Interfaces für medizinische Inhalte**:
   - Strukturierung von Informationen in abgegrenzten, visuell klaren Einheiten verbessert Wahrnehmung komplexer medizinischer Daten
   - Einsatz von subtilen Schatten (`shadow-card`, `shadow-strong`) mit standardisierten Werten schafft konsistente Tiefenwirkung
   - Mikro-Interaktionen (Hover-Effekte, leichte Translations-Bewegungen) erhöhen Engagement ohne Professionalität zu beeinträchtigen

2. **Gradientennutzung für medizinische Designs**:
   - Hauptgradient (`bg-gradient-primary`) nutzt Blautöne für Banner, CTAs und Primärelemente
   - Sekundärgradient für abwechslungsreiche Akzente bei Nebeninformationen
   - Banner-Gradient mit dunklerem Verlauf für visuelle Anker in Kopfbereichen und Navigationskomponenten

3. **Typografie-Hierarchie für medizinische Kommunikation**:
   - Größenabstufungen (4xl für H1, 3xl für H2, etc.) mit konsequenten Proportionen für klare Informationshierarchie
   - Schriftgewichte zwischen Medium (500) und Extra-Bold (800) für verschiedene Hierarchie-Ebenen
   - Zeilen- und Buchstabenabstände angepasst für optimale Lesbarkeit medizinischer Fachbegriffe 

### Technische Implementierung

1. **Tailwind-Konfiguration für erweiterte Design-Token**:
   - Strukturierte Erweiterung des Theme-Objekts mit konsistenten Benennungsmustern
   - Nutzung von Farbabstufungen in 100er-Schritten für vorhersehbare Farbvariationen
   - Einbindung komplexer Schatten- und Gradienten-Definitionen als globale Design-Token

2. **CSS-Variablen für globale Designkonstanten**:
   - Nutzung von `:root`-Variablen für Layout-Konstanten (Content-Breite, Navbar-Höhe, etc.)
   - Responsiv anpassbare Variablen für Mobile-First-Entwicklung

3. **Komponenten-basierte CSS-Klassen für Wiederverwendbarkeit**:
   - Aufbau eines "Utility-First"-Ansatzes mit @layer components für häufig verwendete Kombinationen
   - Feature-Cards, Buttons, Badges und Alerts als wiederverwendbare Klassengruppen
   - Standardisierte Margin- und Padding-Werte für konsistentes Spacing über alle Komponenten

## Maßnahmen für Barrierefreiheit und Benutzerfreundlichkeit

1. **Kontrast und Lesbarkeit**:
   - Implementierung eines Kontrastverhältnisses von mindestens 4.5:1 für normalen Text und 3:1 für große Überschriften
   - Vermeidung von Text auf komplexen Hintergründen durch Overlay-Techniken oder Textschatten

2. **Tastaturnavigation und Fokusindikatoren**:
   - Verbesserte Fokus-Styles für Schaltflächen und interaktive Elemente
   - Konsistente Outline und Ring-Effekte für Tastaturnavigation

3. **Responsive Design-Optimierungen**:
   - Mobile-first Ansatz mit skalierenden Typografie-Größen und Layout-Anpassungen
   - Container-Fluidität mit `max-w-7xl` und responsive Paddings

4. **Visuelle Rückmeldung**:
   - Hover- und Aktiv-Zustände für alle interaktiven Elemente
   - Übergänge und Animationen zur Verbesserung des Nutzererlebnisses ohne Ablenkung

## Best Practices für Performance-Optimierung

1. **CSS-Optimierung mit Tailwind**:
   - Nutzung des JIT-Compilers für minimales CSS-Gewicht
   - Vermeidung von überflüssigen Utility-Klassen durch Komponenten-Extraktion

2. **Gradient-Implementierungen**:
   - Vorberechnete Gradienten als Tailwind-Klassen statt rechenintensiver CSS-Variablen
   - Optimierter Einsatz von Backdrop-Filter-Effekten für moderne Browser

3. **Schattentechniken**:
   - Standardisierte Schatten-Definitionen für bessere Cache-Nutzung
   - Limitierung von Box-Shadow-Layern für Rendering-Performance

## Project Structure
- Vue.js 3 with Composition API provides a clean and maintainable structure for component development
- Tailwind CSS enables rapid UI development with utility classes
- Vue Router handles navigation with lazy-loaded components for better performance

## Design Patterns
- Using reactive forms with validation for user input
- Implementing responsive design with mobile-first approach
- Component composition for reusable UI elements
- Conditional rendering for form submission feedback

## German Market Specifics
- Medical specialties terminology in German context
- German hospital classification system (Universitätsklinikum, Krankenhaus der Maximalversorgung, etc.)
- German regions (Bundesländer) for geographic targeting
- GDPR compliance considerations for medical data
- German legal requirements for websites ("Impressum" page is mandatory)
- Detailed privacy policies required under German law and GDPR

## Team Page Structure
- Leadership team presentation with detailed backgrounds contextualizes expertise 
- Displaying team member credentials builds trust, especially important in medical field
- Career section on team page helps with recruitment and company growth
- Using placeholder SVGs with consistent styling maintains professionalism even without actual photos 

## CSS and Styling
- Tailwind CSS 3.3 is more stable than the newer version 4.0 for Vue.js projects
- ES Module syntax (export default) must be used in config files when package.json has "type": "module"
- SVG icons may need explicit styling constraints to ensure proper sizing
- For Tailwind CSS, always keep the configuration simple with separate tailwind.config.js file
- In Vue.js projects, proper order of tailwind directives (@tailwind base, components, utilities) is crucial
- For better compatibility and debugging, use standard Tailwind installation procedures
- When upgrading Tailwind, consider the impact on existing styles and custom theme configuration
- Tailwind's container class by default has max-width constraints; customize it in tailwind.config.js for full-width layouts
- Always add explicit width utilities (w-full) to parent containers to ensure proper width inheritance
- Use flex-grow with w-full for expandable containers that take available space
- Set explicit responsive image sizes with classes like max-w-full and h-auto to prevent distortion
- CSS @import statements must come before Tailwind directives to avoid PostCSS warnings
- Strong visual hierarchy requires distinct heading styles with sufficient color contrast
- Creating dedicated heading colors in the theme enhances brand consistency across components
- Border elements like border-b-2 with accent colors help create visual separation for sections
- Using increased font weights (extrabold, bold) makes headings stand out more effectively
- Heading colors should lean toward the darker end of the brand palette for optimal readability
- Using the same color as your 'dark' theme color for headings creates strong visual anchors

## Interactive Component Design
- Card-based interfaces work well for displaying multiple similar items
- Color-coded elements (like badges or indicators) help users quickly identify content types
- Filtering interfaces should be visually distinct but not distract from main content
- Modal dialogs should be clearly layered above the main interface with proper background overlay
- Form validation should provide immediate feedback while being unobtrusive
- Success messages benefit from subtle color-coding that aligns with the brand palette
- Using v-if/v-else for toggling UI elements creates cleaner state management
- Combining Tailwind's utility classes allows for responsive designs without custom CSS
- Pagination components should clearly indicate current state and disabled actions
- Filter buttons with active states improve usability for sorting and filtering interfaces

## Bulletin Board Implementation
- Computed properties in Vue.js are ideal for filtering and sorting dynamic lists
- Using reactive refs for filter state management simplifies code maintenance
- Message categorization (offers, requests, information) helps users navigate content
- Time-based sorting options (newest/oldest) are essential for chronological content
- Data pagination reduces load times and improves performance for long lists
- Contact mechanisms should protect user privacy while enabling communication
- Demo data helps visualize the final product during development
- Modals for contact forms provide focused interaction without page navigation
- Color-coding different message types improves scanning and information hierarchy
- Dynamic badge styling with v-bind and conditional classes creates consistent visual language
- Positionierung von Inhalt vor Eingabeformen folgt dem "Content-First"-Prinzip für verbesserte Benutzerführung
- Die Umkehrung der Reihenfolge von Formular und Inhalt reduziert kognitive Belastung und verbessert die Konversionsrate

## Visual Design Principles
- Headings should have at least 4.5:1 contrast ratio with background for accessibility
- Consistent visual hierarchy makes interfaces more intuitive and easier to navigate
- Section headings are more effective with decorative elements like bottom borders
- Font weight plays a crucial role in establishing importance of different text elements
- Buttons should have hover states that provide clear visual feedback
- Visual feedback for form submission improves user experience and confidence
- Shadow styles can be customized to match the overall brand aesthetic

## Form Design Optimization
- Breitere, kompaktere Formulare nutzen Bildschirmplatz effektiver als schmale, lange Formulare
- Grid-Layout mit 3-Spalten-Design für Formulare ermöglicht eine bessere visuelle Gruppierung verwandter Felder
- Reduzierung der Zeilenhöhe und Padding in Formularelementen erhöht die Informationsdichte ohne Überwältigung
- Verkleinerte Abstände zwischen Labels und Eingabefeldern (mb-1 statt mb-2) reduzieren visuellen Raum ohne Einbußen bei der Benutzbarkeit
- Positionierung von häufig zusammengehörigen Feldern (wie Benutzertyp und Nachrichtentyp) nebeneinander fördert logische Gruppierung
- Größere Container (max-w-7xl statt max-w-2xl) für Formulare in datenintensiven Anwendungen verbessern den Überblick
- Subtle Borders (border-gray-200) helfen, Formularcontainer vom Hintergrund abzuheben ohne visuelle Schwere

## Deployment and Version Control
- Vercel simplifies deployment of Vue.js applications with zero configuration
- Creating a vercel.json file provides additional control over deployment settings
- SPA routing requires configuration to handle client-side routes on deployment platforms
- Proper .gitignore settings are crucial to avoid committing node_modules, dist directories, and environment files
- Documentation (README.md, CHANGELOG.md) should be regularly updated before deployment for transparency
- For Vue.js projects on Vercel, setting the framework to "vite" optimizes the build process
- When deploying SPAs to Vercel, static assets require specific route handling to prevent MIME type errors
- Route configuration in vercel.json should differentiate between static assets (JS, CSS, SVG, etc.) and application routes
- For Vite projects, explicitly setting base: '/' in vite.config.js ensures proper asset path resolution
- Adding sourcemap generation in production can help debug deployment issues
- Optimizing chunk strategy in vite.config.js can improve initial load performance in production
- MIME type errors often indicate improper route handling where static assets are being served as HTML 