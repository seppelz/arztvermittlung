import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { trackPageView, initOutboundLinkTracking } from './services/analyticsService'

// Global error handler mit verbessertem Stack-Logging
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  // Stack Trace strukturiert als Array aufteilen für bessere Lesbarkeit
  if (event.error && event.error.stack) {
    const stackLines = event.error.stack.split('\n');
    console.error('Error stack:', stackLines);
  }
});

// Unhandled promise rejections mit verbessertem Stack-Logging
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
  if (event.reason && event.reason.stack) {
    const stackLines = event.reason.stack.split('\n');
    console.error('Promise rejection stack:', stackLines);
  }
});

// Timeout-Schutz für Initialisierung, um Deadlocks zu vermeiden
const initTimeout = setTimeout(() => {
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Initialisierungsfehler</h1>
      <p>Die Anwendung konnte nicht innerhalb der erwarteten Zeit gestartet werden.</p>
      <p>Bitte aktualisieren Sie die Seite oder löschen Sie den Browser-Cache.</p>
    </div>
  `;
  console.error('Application initialization timeout - possible deadlock detected');
}, 10000);

// Create app with enhanced error handler
const app = createApp(App)
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error Handler:', err);
  console.error('Error Info:', info);
  
  // Zusätzliches Logging für spezifische Fehlertypen
  if (err && err.name === 'NavigationFailure') {
    console.error('Navigation Failure Details:', {
      from: err.from && err.from.fullPath,
      to: err.to && err.to.fullPath,
      type: err.type
    });
  }
  
  // Stack-Analyse für Erkennung von zirkulären Abhängigkeiten
  if (err && err.stack) {
    const stackLines = err.stack.split('\n');
    
    // Suche nach häufig wiederholten Funktionsnamen als Indikator für Rekursion
    const functionCalls = stackLines
      .filter(line => line.includes('at '))
      .map(line => line.trim());
    
    const duplicates = functionCalls.filter((call, index, arr) => 
      arr.indexOf(call) !== index
    );
    
    if (duplicates.length > 5) {
      console.error('Possible circular dependency detected!', {
        repeatedCalls: [...new Set(duplicates)].slice(0, 5),
        totalDuplicates: duplicates.length
      });
    }
  }
};

// App-Objekt exportieren für explizite Importierung in anderen Modulen
// Dies verhindert implizite zirkuläre Abhängigkeiten
export { app };

// Optimierte Initialisierungssequenz
const initializeApp = async () => {
  try {
    console.log('Starting application initialization...');
    
    // 1. Pinia vor allem anderen initialisieren
    const pinia = createPinia();
    app.use(pinia);
    console.log('Pinia initialized');
    
    // 2. Versuchen, den Router zu importieren
    console.log('Loading router...');
    const routerModule = await import('./router');
    const router = routerModule.default;
    
    // Setup analytics page tracking with router
    router.afterEach((to) => {
      // Track page view on route change
      trackPageView(window.location.origin + to.fullPath);
    });
    
    // 3. Router an die App anhängen
    app.use(router);
    console.log('Router initialized');
    
    // 4. Auth-Status initialisieren (benutzt jetzt lokalen Cache)
    console.log('Initializing auth state...');
    
    // Initialize outbound link tracking
    initOutboundLinkTracking();
    
    // 5. App mounten
    app.mount('#app');
    console.log('Application successfully initialized');
    
    // Initialisierungs-Timeout löschen
    clearTimeout(initTimeout);
  } catch (error) {
    console.error('Fatal error during app initialization:', error);
    
    // Detaillierte Fehlerinformationen für den Nutzer anzeigen
    let errorDetails = error.message || 'Unknown error';
    if (error.stack) {
      const stackLines = error.stack.split('\n').slice(0, 3);
      errorDetails += `\n\nStack: ${stackLines.join('\n')}`;
    }
    
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Anwendungsfehler</h1>
        <p>Bei der Initialisierung der Anwendung ist ein Fehler aufgetreten.</p>
        <p>Bitte aktualisieren Sie die Seite oder löschen Sie den Browser-Cache.</p>
        <details style="margin-top: 20px; text-align: left;">
          <summary>Technische Details</summary>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; margin-top: 10px;">${errorDetails}</pre>
        </details>
      </div>
    `;
    
    // Initialisierungs-Timeout löschen
    clearTimeout(initTimeout);
  }
};

// Kurze Verzögerung, um sicherzustellen, dass das DOM bereit ist
setTimeout(initializeApp, 0);
