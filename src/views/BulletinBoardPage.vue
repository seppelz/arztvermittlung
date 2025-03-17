<template>
  <div>
    <section class="bg-dark text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Pinnwand</h1>
        <p class="text-xl max-w-3xl">
          Hier finden Sie Informationen und Ankündigungen rund um medizinische Fortbildungen, Veranstaltungen und andere berufsrelevante Themen.
        </p>
      </div>
    </section>

    <section class="py-12 bg-light">
      <div class="container mx-auto px-4">
        <!-- Filter-Optionen -->
        <div class="max-w-7xl mx-auto mb-8">
          <div class="bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-4 items-center border border-gray-200">
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-bold text-heading mr-4">Informationen</h3>
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
            <p class="text-gray-500 text-lg">Keine Informationen gefunden. Erstellen Sie die erste!</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="message in filteredMessages" 
              :key="message.id" 
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-strong transition-shadow duration-300 flex flex-col border border-gray-200"
            >
              <div class="h-2 w-full bg-warning"></div>
              <div class="p-6 flex-grow">
                <div class="flex justify-between items-start mb-3">
                  <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-warning bg-opacity-20 text-warning border border-warning">
                    Information
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
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center text-heading border-b-2 border-primary pb-3">Neue Information erstellen</h2>
          
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
                  placeholder="Titel Ihrer Information"
                />
              </div>
            </div>
            
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
              <label for="content" class="block text-text-dark font-semibold mb-1">Nachricht*</label>
              <textarea 
                id="content" 
                v-model="newMessage.content" 
                required 
                rows="4" 
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                placeholder="Ihre Information hier..."
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
                {{ isSubmitting ? 'Wird gesendet...' : 'Information veröffentlichen' }}
              </button>
            </div>
          </form>
          
          <div v-if="messageSent" class="mt-6 p-4 bg-success bg-opacity-10 text-success rounded-lg border-2 border-success">
            <p class="font-semibold">Vielen Dank für Ihre Information!</p>
            <p>Ihre Information wurde erfolgreich veröffentlicht.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Kontakt-Modal -->
    <div v-if="showContactModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full mx-4">
        <h3 class="text-2xl font-bold mb-4 text-heading border-b-2 border-primary pb-3">Kontakt aufnehmen</h3>
        <p class="mb-6">Sie möchten Kontakt mit <strong>{{ selectedMessage.name }}</strong> aufnehmen bezüglich der Information: <strong>{{ selectedMessage.title }}</strong></p>
        
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
import BulletinService from '@/services/bulletin.service'

// Beispieldaten für die Demonstration - nur Informationen
const demoMessages = [
  {
    id: 4,
    name: 'Dr. Thomas Schmidt',
    email: 't.schmidt@mail.de',
    userType: 'Arzt',
    messageType: 'Information',
    title: 'Fachärztliche Vertretungs-Pool Radiologie',
    content: 'Organisiere Vertretungs-Pool für kurzfristige Radiologie-Einsätze (max. 3 Monate). Über 20 Kolleginnen und Kollegen bereits dabei. Interessierte Radiologen und Kliniken können mich kontaktieren.',
    timestamp: new Date('2025-02-08T11:20:00'),
    privacyPolicyAccepted: true
  },
  {
    id: 7,
    name: 'Ärztekammer Berlin',
    email: 'fortbildung@aerztekammer-berlin.de',
    userType: 'Klinik',
    messageType: 'Information',
    title: 'Fortbildung: Aktuelle Entwicklungen in der Notfallmedizin',
    content: 'Die Ärztekammer Berlin bietet am 15.-16.07.2025 eine zertifizierte Fortbildung zu aktuellen Entwicklungen in der Notfallmedizin an. 16 CME-Punkte. Begrenzte Teilnehmerzahl, frühzeitige Anmeldung empfohlen.',
    timestamp: new Date('2025-01-15T10:00:00'),
    privacyPolicyAccepted: true
  },
  {
    id: 8,
    name: 'Medizinische Hochschule Hannover',
    email: 'kongress@mh-hannover.de',
    userType: 'Klinik',
    messageType: 'Information',
    title: 'Internationaler Kongress für Innere Medizin',
    content: 'Vom 10.-12.09.2025 findet an der MH Hannover der 35. Internationale Kongress für Innere Medizin statt. Themenschwerpunkte: Kardiologie, Gastroenterologie, Endokrinologie. Anmeldung ab sofort möglich.',
    timestamp: new Date('2025-01-05T14:30:00'),
    privacyPolicyAccepted: true
  },
  {
    id: 9,
    name: 'Deutsche Gesellschaft für Neurologie',
    email: 'info@dgn.org',
    userType: 'Klinik',
    messageType: 'Information',
    title: 'DGN-Kongress 2025: Call for Abstracts',
    content: 'Der DGN-Kongress 2025 findet vom 12.-15.11.2025 in Berlin statt. Wir laden herzlich zum Einreichen von Abstracts ein. Einreichungsfrist: 30.04.2025. Themenschwerpunkte: Neuroinflammation, Bewegungsstörungen, Schlaganfall.',
    timestamp: new Date('2024-12-20T09:15:00'),
    privacyPolicyAccepted: true
  },
  {
    id: 10,
    name: 'Charité Universitätsmedizin Berlin',
    email: 'weiterbildung@charite.de',
    userType: 'Klinik',
    messageType: 'Information',
    title: 'Ultraschallkurs Abdomen und Schilddrüse',
    content: 'Die Charité bietet vom 25.-27.04.2025 einen Ultraschallkurs für Abdomen und Schilddrüse an. Der Kurs eignet sich für Ärzte aller Fachrichtungen. 24 CME-Punkte. Begrenzte Teilnehmerzahl, frühzeitige Anmeldung empfohlen.',
    timestamp: new Date('2025-02-10T11:45:00'),
    privacyPolicyAccepted: true
  }
];

// Zustandsvariablen
const messages = ref([...demoMessages]);
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
  messageType: 'Information', // Always set to Information
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
  
  // Only show Information messages
  result = result.filter(msg => msg.messageType === 'Information');
  
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
  let filteredTotal = messages.value.filter(msg => msg.messageType === 'Information');
  return Math.ceil(filteredTotal.length / itemsPerPage);
});

// Methoden
async function submitMessage() {
  isSubmitting.value = true;
  
  // Always set messageType to Information
  newMessage.messageType = 'Information';
  
  try {
    // API-Aufruf zur Speicherung in der Datenbank
    const response = await BulletinService.createBulletin({
      ...newMessage,
      timestamp: new Date()
    });
    
    // Lokale Anzeige aktualisieren
    const message = {
      ...newMessage,
      id: response.data ? response.data._id : Date.now(),
      timestamp: new Date(),
      privacyPolicyAccepted: true
    };
    
    messages.value.unshift(message);
    
    // Formular zurücksetzen
    Object.keys(newMessage).forEach(key => {
      if (typeof newMessage[key] === 'boolean') {
        newMessage[key] = false;
      } else if (key === 'messageType') {
        newMessage[key] = 'Information';
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
  } catch (error) {
    console.error('Fehler beim Speichern des Eintrags:', error);
    alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
    isSubmitting.value = false;
  }
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
onMounted(async () => {
  try {
    // Versuche, Daten von der API zu laden
    const response = await BulletinService.getAllBulletins({
      messageType: 'Information',
      status: 'active',
      limit: 100
    });
    
    if (response && response.data && response.data.length > 0) {
      // Verwende Daten aus der Datenbank
      messages.value = response.data;
    } else {
      // Fallback auf Demo-Daten, wenn keine Einträge in der Datenbank
      messages.value = [...demoMessages];
    }
  } catch (error) {
    console.error('Fehler beim Laden der Pinnwand-Einträge:', error);
    // Bei Fehler verwende Demo-Daten
    messages.value = [...demoMessages];
  }
});
</script> 