<template>
  <div>
    <section class="bg-dark text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Kurzeinsätze & Vertretungen</h1>
        <p class="text-xl max-w-3xl">
          Hier finden Ärzte und Einrichtungen kurzfristige Einsätze (1 Woche bis 3 Monate). 
          Ärzte profitieren von übertariflichen Vergütungen, Kliniken lösen Personalengpässe schnell und unkompliziert.
        </p>
      </div>
    </section>

    <section class="py-12 bg-light">
      <div class="container mx-auto px-4">
        <!-- Filter-Optionen -->
        <div class="max-w-7xl mx-auto mb-8">
          <div class="bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-4 items-center border border-gray-200">
            <h3 class="text-lg font-bold text-heading mr-4">Filter:</h3>
            
            <div class="flex items-center space-x-2">
              <button 
                @click="filterMessages('all')" 
                class="px-4 py-2 rounded-lg transition-colors shadow-sm"
                :class="currentFilter === 'all' ? 'bg-primary text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
              >
                Alle
              </button>
              <button 
                @click="filterMessages('Angebot')" 
                class="px-4 py-2 rounded-lg transition-colors shadow-sm"
                :class="currentFilter === 'Angebot' ? 'bg-success text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
              >
                Angebote
              </button>
              <button 
                @click="filterMessages('Gesuch')" 
                class="px-4 py-2 rounded-lg transition-colors shadow-sm"
                :class="currentFilter === 'Gesuch' ? 'bg-primary text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
              >
                Gesuche
              </button>
              <button 
                @click="filterMessages('Information')" 
                class="px-4 py-2 rounded-lg transition-colors shadow-sm"
                :class="currentFilter === 'Information' ? 'bg-warning text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
              >
                Informationen
              </button>
            </div>
            
            <div class="ml-auto flex items-center">
              <label for="sortOrder" class="mr-2 text-gray-700 font-medium">Sortieren nach:</label>
              <select 
                id="sortOrder" 
                v-model="sortOrder" 
                class="px-4 py-2 border-2 border-gray-300 rounded-lg text-text-dark bg-white shadow-sm appearance-none"
                @change="sortMessages()"
              >
                <option value="newest">Neueste zuerst</option>
                <option value="oldest">Älteste zuerst</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Nachrichten-Grid -->
        <div class="max-w-7xl mx-auto mb-16">
          <div v-if="filteredMessages.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-lg">Keine Nachrichten gefunden. Erstellen Sie die erste!</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="message in filteredMessages" 
              :key="message.id" 
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-strong transition-shadow duration-300 flex flex-col border border-gray-200"
            >
              <div 
                class="h-2 w-full" 
                :class="{
                  'bg-success': message.messageType === 'Angebot',
                  'bg-primary': message.messageType === 'Gesuch',
                  'bg-warning': message.messageType === 'Information'
                }"
              ></div>
              <div class="p-6 flex-grow">
                <div class="flex justify-between items-start mb-3">
                  <span 
                    class="inline-block px-3 py-1 text-xs font-bold rounded-full" 
                    :class="{
                      'bg-success bg-opacity-20 text-success border border-success': message.messageType === 'Angebot',
                      'bg-primary bg-opacity-20 text-primary border border-primary': message.messageType === 'Gesuch',
                      'bg-warning bg-opacity-20 text-warning border border-warning': message.messageType === 'Information'
                    }"
                  >
                    {{ message.messageType }}
                  </span>
                  <span class="text-sm text-gray-500">{{ formatDate(message.timestamp) }}</span>
                </div>
                <h3 class="text-xl font-bold mb-2 text-heading">{{ message.title }}</h3>
                <p class="text-gray-700 mb-4">{{ message.content }}</p>
                <div class="mt-auto pt-4 border-t border-gray-200">
                  <div class="flex justify-between">
                    <div>
                      <p class="font-medium text-gray-700">{{ message.name }}</p>
                      <p class="text-sm text-gray-500">{{ message.userType }}</p>
                    </div>
                    <button 
                      @click="contactPoster(message)" 
                      class="text-white bg-primary hover:bg-primary-dark font-medium px-4 py-1 rounded-lg shadow-sm transform hover:scale-105 transition-all"
                      title="Kontakt aufnehmen"
                    >
                      Kontakt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Paginierung (bei vielen Nachrichten) -->
          <div v-if="messages.length > itemsPerPage" class="mt-8 flex justify-center">
            <nav class="inline-flex rounded-md shadow">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1" 
                class="px-4 py-2 rounded-l-md border-2 border-gray-300"
                :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
              >
                Zurück
              </button>
              <button 
                v-for="page in totalPages" 
                :key="page" 
                @click="goToPage(page)" 
                class="px-4 py-2 border-t-2 border-b-2 border-gray-300"
                :class="currentPage === page ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages" 
                class="px-4 py-2 rounded-r-md border-2 border-gray-300"
                :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
              >
                Weiter
              </button>
            </nav>
          </div>
        </div>
        
        <!-- Neue Nachricht erstellen - Breiteres, kompakteres Formular -->
        <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-strong p-6 mb-8 border border-gray-200">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center text-heading border-b-2 border-primary pb-3">Neue Nachricht erstellen</h2>
          
          <form @submit.prevent="submitMessage" class="space-y-5">
            <!-- Zwei-Spalten-Layout für kompakteren Look -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label for="name" class="block text-text-dark font-semibold mb-1">Name*</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="newMessage.name" 
                  required 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="Ihr Name oder Einrichtung"
                />
              </div>
              
              <div>
                <label for="email" class="block text-text-dark font-semibold mb-1">E-Mail*</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="newMessage.email" 
                  required 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="ihre-email@beispiel.de"
                />
              </div>
              
              <div>
                <label for="title" class="block text-text-dark font-semibold mb-1">Titel*</label>
                <input 
                  type="text" 
                  id="title" 
                  v-model="newMessage.title" 
                  required 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="Titel Ihrer Nachricht"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label for="userType" class="block text-text-dark font-semibold mb-1">Sie sind*</label>
                <select 
                  id="userType" 
                  v-model="newMessage.userType" 
                  required 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm appearance-none"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Arzt">Arzt</option>
                  <option value="Klinik">Klinik/Einrichtung</option>
                </select>
              </div>
              
              <div>
                <label for="messageType" class="block text-text-dark font-semibold mb-1">Typ der Nachricht*</label>
                <select 
                  id="messageType" 
                  v-model="newMessage.messageType" 
                  required 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm appearance-none"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Angebot">Angebot</option>
                  <option value="Gesuch">Gesuch</option>
                  <option value="Information">Information</option>
                </select>
              </div>
            </div>
            
            <div>
              <label for="content" class="block text-text-dark font-semibold mb-1">Nachricht*</label>
              <textarea 
                id="content" 
                v-model="newMessage.content" 
                required 
                rows="4" 
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                placeholder="Ihre Nachricht hier..."
              ></textarea>
            </div>
            
            <div class="flex items-start">
              <input type="checkbox" id="privacyPolicy" v-model="newMessage.privacyPolicyAccepted" required class="mt-1 mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" />
              <label for="privacyPolicy" class="text-sm text-gray-700">
                Ich habe die <router-link to="/privacy" class="text-primary hover:underline font-medium">Datenschutzerklärung</router-link> gelesen und akzeptiere diese.*
              </label>
            </div>
            
            <div class="text-center">
              <button 
                type="submit" 
                class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-8 rounded-lg shadow-strong transition-colors duration-300 text-lg transform hover:scale-105"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Wird gesendet...' : 'Nachricht veröffentlichen' }}
              </button>
            </div>
          </form>
          
          <div v-if="messageSent" class="mt-6 p-4 bg-success bg-opacity-10 text-success rounded-lg border-2 border-success">
            <p class="font-semibold">Vielen Dank für Ihre Nachricht!</p>
            <p>Ihre Nachricht wurde erfolgreich veröffentlicht.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Kontakt-Modal -->
    <div v-if="showContactModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full mx-4">
        <h3 class="text-2xl font-bold mb-4 text-heading border-b-2 border-primary pb-3">Kontakt aufnehmen</h3>
        <p class="mb-6">Sie möchten Kontakt mit <strong>{{ selectedMessage.name }}</strong> aufnehmen bezüglich der Nachricht: <strong>{{ selectedMessage.title }}</strong></p>
        
        <form @submit.prevent="sendContact" class="space-y-4">
          <div>
            <label for="contactName" class="block text-text-dark font-semibold mb-2">Ihr Name*</label>
            <input type="text" id="contactName" v-model="contactForm.name" required class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
          </div>
          
          <div>
            <label for="contactEmail" class="block text-text-dark font-semibold mb-2">Ihre E-Mail*</label>
            <input type="email" id="contactEmail" v-model="contactForm.email" required class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
          </div>
          
          <div>
            <label for="contactMessage" class="block text-text-dark font-semibold mb-2">Ihre Nachricht*</label>
            <textarea id="contactMessage" v-model="contactForm.message" required rows="4" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"></textarea>
          </div>
          
          <div class="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              @click="closeContactModal" 
              class="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-bold shadow-md transform hover:scale-105 transition-all"
            >
              Nachricht senden
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Beispieldaten für die Demonstration
const demoMessages = [
  {
    id: 1,
    name: 'Klinikum München',
    email: 'personal@klinikum-muenchen.de',
    userType: 'Klinik',
    messageType: 'Angebot',
    title: 'Vertretung Notfallmedizin (2 Wochen) - +30% Vergütung',
    content: 'Suchen dringend Vertretung für unsere Notfallstation vom 15.-29.06.2025. Erfahrung in Notfallmedizin erforderlich. +30% über regulärem Tarif, Unterkunft wird gestellt.',
    timestamp: new Date('2025-05-15T10:30:00'),
    privacyPolicyAccepted: true
  },
  {
    id: 2,
    name: 'Dr. Julia Weber',
    email: 'j.weber@arztpraxis.de',
    userType: 'Arzt',
    messageType: 'Gesuch',
    title: 'Anästhesist verfügbar für Kurzeinsätze bis 4 Wochen',
    content: 'Facharzt für Anästhesie mit 8 Jahren Erfahrung sucht Kurzeinsätze (1-4 Wochen) im Raum Köln ab sofort. Flexibel und kurzfristig verfügbar, auch Wochenenddienste möglich.',
    timestamp: new Date('2025-05-12T15:45:00'),
    privacyPolicyAccepted: true
  },
  {
    id: 3,
    name: 'Universitätsklinikum Hamburg',
    email: 'karriere@uk-hamburg.de',
    userType: 'Klinik',
    messageType: 'Angebot',
    title: 'Kardiologie - 3-Monats-Vertretung (übertariflich)',
    content: 'Suchen für den Zeitraum 01.07.-30.09.2025 Facharzt (m/w/d) für unsere kardiologische Abteilung. Vergütung 40% über TV-Ärzte, Dienstwohnung möglich, flexible Dienstplangestaltung.',
    timestamp: new Date('2025-05-10T09:15:00'),
    privacyPolicyAccepted: true
  },
  {
    id: 4,
    name: 'Dr. Thomas Schmidt',
    email: 't.schmidt@mail.de',
    userType: 'Arzt',
    messageType: 'Information',
    title: 'Fachärztliche Vertretungs-Pool Radiologie',
    content: 'Organisiere Vertretungs-Pool für kurzfristige Radiologie-Einsätze (max. 3 Monate). Über 20 Kolleginnen und Kollegen bereits dabei. Interessierte Radiologen und Kliniken können mich kontaktieren.',
    timestamp: new Date('2025-05-08T11:20:00'),
    privacyPolicyAccepted: true
  },
  {
    id: 5,
    name: 'Rehaklinik Schwarzwald',
    email: 'personal@rehaklinik-schwarzwald.de',
    userType: 'Klinik',
    messageType: 'Angebot',
    title: 'Honorarärzte für Wochenenddienste (bis zu 2.500€/WE)',
    content: 'Suchen regelmäßig Honorarärzte für Wochenenddienste (Fr-So). Attraktives Honorar von bis zu 2.500€ pro Wochenende, Unterkunft inklusive. Fachrichtung: Innere Medizin, Allgemeinmedizin.',
    timestamp: new Date('2025-05-05T14:10:00'),
    privacyPolicyAccepted: true
  },
  {
    id: 6,
    name: 'Dr. Sarah Müller',
    email: 's.mueller@gmail.com',
    userType: 'Arzt',
    messageType: 'Gesuch',
    title: 'Kinderärztin für 3-Monats-Einsätze verfügbar',
    content: 'Fachärztin für Pädiatrie mit 12 Jahren Berufserfahrung sucht Vertretungsstellen oder Projekteinsätze für 1-3 Monate im Raum Berlin/Brandenburg. Flexible Zeiteinteilung, auch kurzfristig verfügbar.',
    timestamp: new Date('2025-05-03T16:30:00'),
    privacyPolicyAccepted: true
  }
];

// Zustandsvariablen
const messages = ref([...demoMessages]);
const currentFilter = ref('all');
const sortOrder = ref('newest');
const currentPage = ref(1);
const itemsPerPage = 6;
const isSubmitting = ref(false);
const messageSent = ref(false);
const showContactModal = ref(false);
const selectedMessage = ref({});

// Formulare
const newMessage = reactive({
  name: '',
  email: '',
  userType: '',
  messageType: '',
  title: '',
  content: '',
  privacyPolicyAccepted: false
});

const contactForm = reactive({
  name: '',
  email: '',
  message: ''
});

// Berechnete Eigenschaften
const filteredMessages = computed(() => {
  let result = [...messages.value];
  
  // Filtern nach Nachrichtentyp
  if (currentFilter.value !== 'all') {
    result = result.filter(msg => msg.messageType === currentFilter.value);
  }
  
  // Sortieren
  result.sort((a, b) => {
    if (sortOrder.value === 'newest') {
      return b.timestamp - a.timestamp;
    } else {
      return a.timestamp - b.timestamp;
    }
  });
  
  // Paginierung
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return result.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  let filteredTotal = messages.value;
  if (currentFilter.value !== 'all') {
    filteredTotal = filteredTotal.filter(msg => msg.messageType === currentFilter.value);
  }
  return Math.ceil(filteredTotal.length / itemsPerPage);
});

// Methoden
function submitMessage() {
  isSubmitting.value = true;
  
  // Simuliere API-Aufruf
  setTimeout(() => {
    const newId = messages.value.length > 0 ? Math.max(...messages.value.map(m => m.id)) + 1 : 1;
    
    const message = {
      ...newMessage,
      id: newId,
      timestamp: new Date(),
      privacyPolicyAccepted: true
    };
    
    messages.value.unshift(message);
    
    // Formular zurücksetzen
    Object.keys(newMessage).forEach(key => {
      if (typeof newMessage[key] === 'boolean') {
        newMessage[key] = false;
      } else {
        newMessage[key] = '';
      }
    });
    
    isSubmitting.value = false;
    messageSent.value = true;
    
    // Erfolgsmeldung nach 3 Sekunden ausblenden
    setTimeout(() => {
      messageSent.value = false;
    }, 3000);
  }, 1000);
}

function filterMessages(filter) {
  currentFilter.value = filter;
  currentPage.value = 1; // Zurück zur ersten Seite
}

function sortMessages() {
  // Sortierung wird in der computed property angewendet
  currentPage.value = 1; // Zurück zur ersten Seite
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(page) {
  currentPage.value = page;
}

function contactPoster(message) {
  selectedMessage.value = message;
  showContactModal.value = true;
}

function closeContactModal() {
  showContactModal.value = false;
  // Formular zurücksetzen
  contactForm.name = '';
  contactForm.email = '';
  contactForm.message = '';
}

function sendContact() {
  // Hier würden wir normalerweise eine API-Anfrage senden
  console.log('Kontaktanfrage gesendet:', {
    to: selectedMessage.value.email,
    from: contactForm
  });
  
  // Schließe das Modal und zeige eine Erfolgsmeldung
  alert('Ihre Nachricht wurde gesendet!');
  closeContactModal();
}

// Initialisierung
onMounted(() => {
  // Hier könnten Nachrichten von einer API geladen werden
  // Für die Demo verwenden wir die vordefinierten Daten
});
</script> 