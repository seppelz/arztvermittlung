<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Systemeinstellungen</h1>
      
      <button 
        class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm"
        @click="saveAllSettings"
      >
        Alle Änderungen speichern
      </button>
    </div>

    <div class="space-y-8">
      <!-- Allgemeine Einstellungen -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Allgemeine Einstellungen</h2>
        
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label for="siteName" class="block text-sm font-medium text-gray-700 mb-1">
              Plattformname
            </label>
            <input 
              type="text" 
              id="siteName" 
              v-model="settings.general.siteName"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label for="siteDescription" class="block text-sm font-medium text-gray-700 mb-1">
              Beschreibung
            </label>
            <textarea 
              id="siteDescription" 
              v-model="settings.general.siteDescription"
              rows="3"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            ></textarea>
          </div>
          
          <div>
            <label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-1">
              Kontakt-E-Mail
            </label>
            <input 
              type="email" 
              id="contactEmail" 
              v-model="settings.general.contactEmail"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="maintenanceMode" 
              v-model="settings.general.maintenanceMode"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="maintenanceMode" class="ml-2 block text-sm text-gray-900">
              Wartungsmodus aktivieren
            </label>
          </div>
        </div>
      </div>
      
      <!-- E-Mail-Konfiguration -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">E-Mail-Konfiguration</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="smtpHost" class="block text-sm font-medium text-gray-700 mb-1">
              SMTP-Host
            </label>
            <input 
              type="text" 
              id="smtpHost" 
              v-model="settings.email.smtpHost"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label for="smtpPort" class="block text-sm font-medium text-gray-700 mb-1">
              SMTP-Port
            </label>
            <input 
              type="number" 
              id="smtpPort" 
              v-model="settings.email.smtpPort"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label for="smtpUser" class="block text-sm font-medium text-gray-700 mb-1">
              SMTP-Benutzername
            </label>
            <input 
              type="text" 
              id="smtpUser" 
              v-model="settings.email.smtpUser"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label for="smtpPassword" class="block text-sm font-medium text-gray-700 mb-1">
              SMTP-Passwort
            </label>
            <input 
              type="password" 
              id="smtpPassword" 
              v-model="settings.email.smtpPassword"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label for="fromEmail" class="block text-sm font-medium text-gray-700 mb-1">
              Absender-E-Mail
            </label>
            <input 
              type="email" 
              id="fromEmail" 
              v-model="settings.email.fromEmail"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label for="fromName" class="block text-sm font-medium text-gray-700 mb-1">
              Absendername
            </label>
            <input 
              type="text" 
              id="fromName" 
              v-model="settings.email.fromName"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div class="md:col-span-2">
            <label for="emailFooter" class="block text-sm font-medium text-gray-700 mb-1">
              E-Mail-Fußzeile
            </label>
            <textarea 
              id="emailFooter" 
              v-model="settings.email.emailFooter"
              rows="3"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            ></textarea>
          </div>
          
          <div class="md:col-span-2">
            <button 
              class="bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm"
              @click="testEmailSettings"
            >
              E-Mail-Einstellungen testen
            </button>
          </div>
        </div>
      </div>
      
      <!-- Pinnwand-Einstellungen -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Pinnwand-Einstellungen</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="moderationRequired" class="block text-sm font-medium text-gray-700 mb-1">
              Freigabe neuer Einträge
            </label>
            <select 
              id="moderationRequired" 
              v-model="settings.bulletin.moderationRequired"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">Alle Einträge müssen freigegeben werden</option>
              <option value="guest">Nur Einträge von Gästen (nicht angemeldet)</option>
              <option value="none">Keine Freigabe erforderlich</option>
            </select>
          </div>
          
          <div>
            <label for="entriesPerPage" class="block text-sm font-medium text-gray-700 mb-1">
              Einträge pro Seite
            </label>
            <select 
              id="entriesPerPage" 
              v-model="settings.bulletin.entriesPerPage"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="5">5 Einträge</option>
              <option value="10">10 Einträge</option>
              <option value="15">15 Einträge</option>
              <option value="20">20 Einträge</option>
              <option value="25">25 Einträge</option>
            </select>
          </div>
          
          <div>
            <label for="defaultSorting" class="block text-sm font-medium text-gray-700 mb-1">
              Standard-Sortierung
            </label>
            <select 
              id="defaultSorting" 
              v-model="settings.bulletin.defaultSorting"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="featured">Hervorgehobene zuerst</option>
            </select>
          </div>
          
          <div>
            <label for="maxMessageLength" class="block text-sm font-medium text-gray-700 mb-1">
              Maximale Nachrichtenlänge
            </label>
            <input 
              type="number" 
              id="maxMessageLength" 
              v-model="settings.bulletin.maxMessageLength"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div class="md:col-span-2">
            <label for="allowedCategories" class="block text-sm font-medium text-gray-700 mb-1">
              Erlaubte Kategorien (durch Komma getrennt)
            </label>
            <input 
              type="text" 
              id="allowedCategories" 
              v-model="settings.bulletin.allowedCategories"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
      
      <!-- Benutzereinstellungen -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Benutzereinstellungen</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="allowRegistration" class="block text-sm font-medium text-gray-700 mb-1">
              Registrierung
            </label>
            <select 
              id="allowRegistration" 
              v-model="settings.user.allowRegistration"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">Alle Benutzertypen erlaubt</option>
              <option value="doctors">Nur Ärzte</option>
              <option value="clinics">Nur Kliniken</option>
              <option value="none">Keine neuen Registrierungen</option>
            </select>
          </div>
          
          <div>
            <label for="requireEmailVerification" class="block text-sm font-medium text-gray-700 mb-1">
              E-Mail-Verifizierung
            </label>
            <select 
              id="requireEmailVerification" 
              v-model="settings.user.requireEmailVerification"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="before">Vor dem ersten Login erforderlich</option>
              <option value="after">Nach dem ersten Login erforderlich (innerhalb von 7 Tagen)</option>
              <option value="none">Keine Verifizierung erforderlich</option>
            </select>
          </div>
          
          <div>
            <label for="autoApprove" class="block text-sm font-medium text-gray-700 mb-1">
              Benutzerfreigabe
            </label>
            <select 
              id="autoApprove" 
              v-model="settings.user.autoApprove"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">Alle Benutzer automatisch freigeben</option>
              <option value="doctors">Nur Ärzte automatisch freigeben</option>
              <option value="clinics">Nur Kliniken automatisch freigeben</option>
              <option value="none">Keine automatische Freigabe</option>
            </select>
          </div>
          
          <div>
            <label for="passwordMinLength" class="block text-sm font-medium text-gray-700 mb-1">
              Mindestlänge für Passwörter
            </label>
            <input 
              type="number" 
              id="passwordMinLength" 
              v-model="settings.user.passwordMinLength"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div class="md:col-span-2">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="requireStrongPassword" 
                v-model="settings.user.requireStrongPassword"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="requireStrongPassword" class="ml-2 block text-sm text-gray-900">
                Starke Passwörter erzwingen (Groß-/Kleinbuchstaben, Zahlen, Sonderzeichen)
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- API-Einstellungen -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">API-Einstellungen</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="jwtExpiresIn" class="block text-sm font-medium text-gray-700 mb-1">
              JWT-Ablaufzeit (in Tagen)
            </label>
            <input 
              type="number" 
              id="jwtExpiresIn" 
              v-model="settings.api.jwtExpiresIn"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label for="rateLimitRequests" class="block text-sm font-medium text-gray-700 mb-1">
              Rate Limit (Anfragen)
            </label>
            <input 
              type="number" 
              id="rateLimitRequests" 
              v-model="settings.api.rateLimitRequests"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label for="rateLimitWindow" class="block text-sm font-medium text-gray-700 mb-1">
              Rate Limit (Zeitfenster in Minuten)
            </label>
            <input 
              type="number" 
              id="rateLimitWindow" 
              v-model="settings.api.rateLimitWindow"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div class="md:col-span-2">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="enableLogging" 
                v-model="settings.api.enableLogging"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="enableLogging" class="ml-2 block text-sm text-gray-900">
                API-Logging aktivieren
              </label>
            </div>
          </div>
          
          <div class="md:col-span-2">
            <button 
              class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
              @click="resetApiSettings"
            >
              API-Einstellungen zurücksetzen
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Aktions-Footer -->
    <div class="mt-8 flex justify-end space-x-4">
      <button 
        class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50"
        @click="resetAllSettings"
      >
        Alle zurücksetzen
      </button>
      <button 
        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm"
        @click="saveAllSettings"
      >
        Alle Änderungen speichern
      </button>
    </div>
    
    <!-- Erfolgsmeldung -->
    <div 
      v-if="showSuccessMessage" 
      class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md flex items-center"
    >
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      <span>Einstellungen wurden erfolgreich gespeichert!</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Zustandsvariablen
const settings = ref({
  general: {
    siteName: 'MedMatch',
    siteDescription: 'Die Plattform für die Vermittlung von Ärzten und Kliniken',
    contactEmail: 'info@medmatch.de',
    maintenanceMode: false
  },
  email: {
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUser: 'noreply@medmatch.de',
    smtpPassword: 'password123',
    fromEmail: 'noreply@medmatch.de',
    fromName: 'MedMatch',
    emailFooter: 'MedMatch - Die Plattform für die Vermittlung von Ärzten und Kliniken\nImpressum: https://medmatch.de/imprint'
  },
  bulletin: {
    moderationRequired: 'guest',
    entriesPerPage: 10,
    defaultSorting: 'newest',
    maxMessageLength: 1000,
    allowedCategories: 'Angebot, Gesuch, Information'
  },
  user: {
    allowRegistration: 'all',
    requireEmailVerification: 'before',
    autoApprove: 'none',
    passwordMinLength: 8,
    requireStrongPassword: true
  },
  api: {
    jwtExpiresIn: 7,
    rateLimitRequests: 100,
    rateLimitWindow: 15,
    enableLogging: true
  }
});

const originalSettings = ref(null);
const showSuccessMessage = ref(false);

// Alle Einstellungen speichern
const saveAllSettings = () => {
  // Hier würde normalerweise ein API-Aufruf erfolgen
  console.log('Einstellungen speichern:', settings.value);
  
  // Erfolgsmeldung anzeigen
  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
  
  // Aktuelle Einstellungen als Original speichern
  originalSettings.value = JSON.parse(JSON.stringify(settings.value));
};

// Alle Einstellungen zurücksetzen
const resetAllSettings = () => {
  if (confirm('Möchten Sie wirklich alle Einstellungen zurücksetzen? Alle ungespeicherten Änderungen gehen verloren.')) {
    if (originalSettings.value) {
      settings.value = JSON.parse(JSON.stringify(originalSettings.value));
    }
  }
};

// API-Einstellungen zurücksetzen
const resetApiSettings = () => {
  if (confirm('Möchten Sie wirklich alle API-Einstellungen zurücksetzen?')) {
    settings.value.api = {
      jwtExpiresIn: 7,
      rateLimitRequests: 100,
      rateLimitWindow: 15,
      enableLogging: true
    };
  }
};

// E-Mail-Einstellungen testen
const testEmailSettings = () => {
  // Hier würde normalerweise ein API-Aufruf erfolgen
  console.log('E-Mail-Einstellungen testen:', settings.value.email);
  
  // Simulierte Antwort
  setTimeout(() => {
    alert('E-Mail-Test erfolgreich! Eine Test-E-Mail wurde an ' + settings.value.general.contactEmail + ' gesendet.');
  }, 1000);
};

// Initialisierung
onMounted(() => {
  // Hier würden normalerweise API-Aufrufe erfolgen, um die Daten zu laden
  console.log('AdminSettings initialisiert');
  
  // Aktuelle Einstellungen als Original speichern
  originalSettings.value = JSON.parse(JSON.stringify(settings.value));
});
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style> 