<template>
  <div>
    <section class="bg-dark text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Stellenbörse</h1>
        <p class="text-xl max-w-3xl">
          Hier finden Ärzte und Einrichtungen kurzfristige Einsätze (1 Woche bis 3 Monate). 
          Ärzte profitieren von übertariflichen Vergütungen, Kliniken lösen Personalengpässe schnell und unkompliziert.
        </p>
      </div>
    </section>

    <section class="py-12 bg-light">
      <div class="container mx-auto px-4">
        <!-- Nachrichtenliste -->
        <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-strong p-6 border border-gray-200 mb-10">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-heading border-b-2 border-primary pb-3">Stellenangebote und -gesuche</h2>
          
          <!-- Filter-Optionen -->
          <div class="flex flex-wrap gap-3 items-center mb-6">
            <h3 class="text-lg font-bold text-heading mr-4">Filter:</h3>
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
            
            <div class="ml-auto flex items-center">
              <span class="mr-2 text-gray-700">Sortieren:</span>
              <select v-model="sortOrder" @change="sortMessages" class="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm">
                <option value="newest">Neueste zuerst</option>
                <option value="oldest">Älteste zuerst</option>
              </select>
            </div>
          </div>
          
          <!-- Loading and Content States -->
          <div v-if="isLoading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p class="text-lg text-gray-600">Stellenangebote werden geladen...</p>
          </div>
          
          <div v-else-if="loadError" class="p-6 bg-red-50 border border-red-200 rounded-lg text-center mb-4">
            <p class="text-red-600 mb-2 font-medium">{{ loadError }}</p>
            <button 
              @click="retryFetch" 
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
            >
              Erneut versuchen
            </button>
          </div>
          
          <div v-else-if="filteredMessages.length === 0" class="p-8 text-center border border-gray-200 rounded-lg mb-4">
            <p class="text-lg text-gray-600 mb-2">Keine Stellenangebote/-gesuche gefunden.</p>
            <p class="text-gray-500">Erstellen Sie ein neues Angebot oder Gesuch mit dem Formular unten.</p>
          </div>
          
          <!-- Messages Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="message in filteredMessages" 
              :key="message.id" 
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-strong transition-shadow duration-300 flex flex-col border border-gray-200"
            >
              <div 
                class="h-2 w-full" 
                :class="{
                  'bg-success': message.messageType === 'Angebot',
                  'bg-primary': message.messageType === 'Gesuch'
                }"
              ></div>
              <div class="p-6 flex-grow">
                <div class="flex justify-between items-start mb-3">
                  <span 
                    class="inline-block px-3 py-1 text-xs font-bold rounded-full" 
                    :class="{
                      'bg-success bg-opacity-20 text-success border border-success': message.messageType === 'Angebot',
                      'bg-primary bg-opacity-20 text-primary border border-primary': message.messageType === 'Gesuch'
                    }"
                  >
                    {{ message.messageType }}
                  </span>
                  <span class="text-sm text-gray-500">{{ formatDate(message.timestamp) }}</span>
                </div>
                <h3 class="text-xl font-bold mb-2 text-heading">
                  <span v-if="message.userType === 'Arzt'">Arzt sucht ab {{ formatDate(message.startDate) }} <span v-if="message.specialty" v-html="'Fachrichtung ' + message.specialty"></span></span>
                  <span v-else-if="message.userType === 'Klinik'">Klinik sucht ab {{ formatDate(message.startDate) }} <span v-if="message.specialty" v-html="'Arzt der Fachrichtung ' + message.specialty"></span><span v-else>Arzt</span></span>
                  <span v-else>{{ message.title }}</span>
                </h3>
                <p class="text-gray-700 mb-4">{{ message.content }}</p>
                <div class="mt-auto pt-4 border-t border-gray-200">
                  <div class="flex justify-between">
                    <div>
                      <p class="text-sm text-gray-600">
                        <span v-if="message.userType === 'Arzt'">Ein Arzt <span v-if="message.specialty" v-html="'der Fachrichtung <strong>' + message.specialty + '</strong>'"></span> sucht ab <strong>{{ formatDate(message.startDate) }}</strong> eine Stelle.</span>
                        <span v-if="message.userType === 'Klinik'">Eine Klinik aus <strong>{{ message.federalState || 'unbekannt' }}</strong> sucht ab <strong>{{ formatDate(message.startDate) }}</strong> einen Arzt <span v-if="message.specialty" v-html="'der Fachrichtung <strong>' + message.specialty + '</strong>'"></span>.</span>
                      </p>
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
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center text-heading border-b-2 border-primary pb-3">Neues Angebot/Gesuch erstellen</h2>
          
          <form @submit.prevent="submitMessage" class="space-y-5">
            <!-- Zwei-Spalten-Layout für kompakteren Look -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label for="name" class="block text-text-dark font-semibold mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="newMessage.name" 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="Ihr Name oder Einrichtung (optional)"
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
                <label for="userType" class="block text-text-dark font-semibold mb-1">Sie sind*</label>
                <select 
                  id="userType" 
                  v-model="newMessage.userType" 
                  required 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm appearance-none"
                  @change="determineMessageType"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Arzt">Arzt</option>
                  <option value="Klinik">Klinik/Einrichtung</option>
                </select>
                <p v-if="newMessage.userType" class="text-sm mt-1 text-gray-600">
                  <span v-if="newMessage.userType === 'Arzt'">Sie erstellen ein <strong class="text-primary">Gesuch</strong>.</span>
                  <span v-if="newMessage.userType === 'Klinik'">Sie erstellen ein <strong class="text-success">Angebot</strong>.</span>
                </p>
              </div>
              
              <div>
                <label for="startDate" class="block text-text-dark font-semibold mb-1">Verfügbar/Benötigt ab*</label>
                <input 
                  type="date" 
                  id="startDate" 
                  v-model="newMessage.startDate" 
                  required 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                />
              </div>

              <div>
                <label for="specialty" class="block text-text-dark font-semibold mb-1">Fachrichtung</label>
                <input 
                  type="text" 
                  id="specialty" 
                  v-model="newMessage.specialty" 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="Ihre Fachrichtung (optional)"
                />
              </div>
              
              <div v-if="newMessage.userType === 'Klinik'">
                <label for="federalState" class="block text-text-dark font-semibold mb-1">Bundesland*</label>
                <select 
                  id="federalState" 
                  v-model="newMessage.federalState" 
                  :required="newMessage.userType === 'Klinik'" 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm appearance-none"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Baden-Württemberg">Baden-Württemberg</option>
                  <option value="Bayern">Bayern</option>
                  <option value="Berlin">Berlin</option>
                  <option value="Brandenburg">Brandenburg</option>
                  <option value="Bremen">Bremen</option>
                  <option value="Hamburg">Hamburg</option>
                  <option value="Hessen">Hessen</option>
                  <option value="Mecklenburg-Vorpommern">Mecklenburg-Vorpommern</option>
                  <option value="Niedersachsen">Niedersachsen</option>
                  <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
                  <option value="Rheinland-Pfalz">Rheinland-Pfalz</option>
                  <option value="Saarland">Saarland</option>
                  <option value="Sachsen">Sachsen</option>
                  <option value="Sachsen-Anhalt">Sachsen-Anhalt</option>
                  <option value="Schleswig-Holstein">Schleswig-Holstein</option>
                  <option value="Thüringen">Thüringen</option>
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
                placeholder="Ihr Angebot/Gesuch hier..."
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
                {{ isSubmitting ? 'Wird gesendet...' : newMessage.userType === 'Arzt' ? 'Gesuch veröffentlichen' : newMessage.userType === 'Klinik' ? 'Angebot veröffentlichen' : 'Veröffentlichen' }}
              </button>
            </div>
          </form>
          
          <div v-if="messageSent" class="mt-6 p-4 bg-success bg-opacity-10 text-success rounded-lg border-2 border-success">
            <p class="font-semibold">Vielen Dank für Ihre Nachricht!</p>
            <p>Ihre Nachricht wurde zur Freigabe weitergeleitet.</p>
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

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import bulletinProxyService from '@/services/bulletinProxyService'
import { Bulletin } from '@/types'

// Extend the Bulletin type to include federalState
declare module '@/types' {
  interface Bulletin {
    federalState?: string;
  }
}

// Define interfaces
interface JobBulletin {
  _id: string;
  id?: string;
  title?: string;
  content: string;
  name: string;
  email: string;
  status: string;
  messageType: 'Angebot' | 'Gesuch';
  timestamp: string | Date;
  createdAt?: Date;
  updatedAt?: Date;
  startDate?: Date | string;
  specialty?: string;
  federalState?: string;
  userType?: string;
  privacyPolicyAccepted: boolean;
  [key: string]: any; // Allow indexing with strings
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface NewBulletin {
  name: string;
  email: string;
  userType: string;
  messageType: string;
  content: string;
  specialty: string;
  federalState: string;
  startDate: string;
  status: string;
  privacyPolicyAccepted: boolean;
  [key: string]: any; // Allow indexing with strings
}

// State variables
const messages = ref<JobBulletin[]>([]);
const currentFilter = ref<string>('all');
const sortOrder = ref<'newest' | 'oldest'>('newest');
const currentPage = ref<number>(1);
const itemsPerPage = 6;
const isSubmitting = ref<boolean>(false);
const messageSent = ref<boolean>(false);
const showContactModal = ref<boolean>(false);
const selectedMessage = ref<JobBulletin>({} as JobBulletin);
const isLoading = ref<boolean>(true);
const loadError = ref<string | null>(null);

// Forms
const newMessage = reactive<NewBulletin>({
  name: '',
  email: '',
  userType: '',
  messageType: '', // Will be set automatically based on userType
  content: '',
  specialty: '',
  federalState: '',
  startDate: new Date().toISOString().split('T')[0], // Today's date as default
  status: 'pending', // New entries are set to 'pending' by default
  privacyPolicyAccepted: false
});

const contactForm = reactive<ContactForm>({
  name: '',
  email: '',
  message: ''
});

// Computed properties
const filteredMessages = computed<JobBulletin[]>(() => {
  let result = [...messages.value];
  
  console.log('Filtering messages:', messages.value.length, 'total entries');
  console.log('Message types:', [...new Set(messages.value.map(m => m.messageType))]);
  console.log('Message statuses:', [...new Set(messages.value.map(m => m.status))]);
  
  // Show only Angebot and Gesuch messages
  result = result.filter(msg => msg.messageType === 'Angebot' || msg.messageType === 'Gesuch');
  console.log('After messageType filter:', result.length, 'entries');
  
  // Show only active entries and handle legacy entries without status
  result = result.filter(msg => msg.status === 'active' || msg.status === undefined);
  console.log('After status filter:', result.length, 'entries with status active/undefined');
  
  // Filter by message type
  if (currentFilter.value !== 'all') {
    result = result.filter(msg => msg.messageType === currentFilter.value);
    console.log('After currentFilter:', result.length, 'entries');
  }
  
  // Sort
  result.sort((a, b) => {
    if (sortOrder.value === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });
  
  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResult = result.slice(startIndex, endIndex);
  console.log('Final paginated result:', paginatedResult.length, 'entries');
  
  return paginatedResult;
});

const totalPages = computed<number>(() => {
  let filteredTotal = messages.value.filter(msg => msg.messageType === 'Angebot' || msg.messageType === 'Gesuch');
  if (currentFilter.value !== 'all') {
    filteredTotal = filteredTotal.filter(msg => msg.messageType === currentFilter.value);
  }
  return Math.ceil(filteredTotal.length / itemsPerPage);
});

// Methods
function determineMessageType(): void {
  if (newMessage.userType === 'Arzt') {
    newMessage.messageType = 'Gesuch';
  } else if (newMessage.userType === 'Klinik') {
    newMessage.messageType = 'Angebot';
  } else {
    newMessage.messageType = '';
  }
}

async function submitMessage(): Promise<void> {
  isSubmitting.value = true;
  
  // Set messageType based on userType
  determineMessageType();
  
  // Generate title based on userType and startDate
  let generatedTitle = '';
  if (newMessage.userType === 'Arzt') {
    generatedTitle = `Arzt sucht ab ${formatDate(newMessage.startDate)}${newMessage.specialty ? ' Fachrichtung ' + newMessage.specialty : ''}`;
  } else if (newMessage.userType === 'Klinik') {
    generatedTitle = `Klinik sucht ab ${formatDate(newMessage.startDate)}${newMessage.specialty ? ' Arzt der Fachrichtung ' + newMessage.specialty : ' Arzt'}`;
  }
  
  try {
    console.log('Submitting job listing to database');
    
    // Prepare data for API (convert date string to Date object)
    const bulletinData: Partial<Bulletin> = {
      title: generatedTitle,
      name: newMessage.name,
      email: newMessage.email,
      content: newMessage.content,
      messageType: newMessage.messageType,
      status: 'pending',
      privacyPolicyAccepted: true,
      specialty: newMessage.specialty || undefined
    };
    
    // Add startDate as a Date object
    if (newMessage.startDate) {
      bulletinData.startDate = new Date(newMessage.startDate);
    }
    
    // Add federalState if it exists
    if (newMessage.federalState) {
      (bulletinData as any).federalState = newMessage.federalState;
    }
    
    const response = await bulletinProxyService.createBulletin(bulletinData);
    
    if (response && response.data) {
      // If successful, add the new listing to our local list
      const newEntry = response.data;
      
      // Convert to our JobBulletin format
      const formattedEntry: JobBulletin = {
        _id: newEntry._id,
        id: newEntry._id,
        title: newEntry.title,
        content: newEntry.content,
        name: newEntry.name,
        email: newEntry.email,
        status: newEntry.status,
        messageType: newEntry.messageType as 'Angebot' | 'Gesuch',
        timestamp: newEntry.createdAt || new Date(),
        createdAt: newEntry.createdAt,
        updatedAt: newEntry.updatedAt,
        startDate: newEntry.startDate,
        specialty: newEntry.specialty,
        federalState: newEntry.federalState,
        userType: newMessage.userType, // Copy from form
        privacyPolicyAccepted: true
      };
      
      messages.value.unshift(formattedEntry);
      
      // Reset form
      Object.keys(newMessage).forEach(key => {
        if (key === 'privacyPolicyAccepted') {
          newMessage.privacyPolicyAccepted = false;
        } else if (key === 'startDate') {
          newMessage.startDate = new Date().toISOString().split('T')[0]; // Reset to today's date
        } else {
          newMessage[key] = '';
        }
      });
      
      messageSent.value = true;
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        messageSent.value = false;
      }, 3000);
    }
  } catch (err: any) {
    console.error('Error submitting job listing:', err);
    alert('Fehler beim Speichern: ' + (err.message || 'Unbekannter Fehler'));
  } finally {
    isSubmitting.value = false;
  }
}

function filterMessages(filter: string): void {
  currentFilter.value = filter;
  currentPage.value = 1; // Back to first page
}

function sortMessages(): void {
  // Sorting is applied in the computed property
  currentPage.value = 1; // Back to first page
}

function formatDate(date: string | Date | undefined): string {
  // Add safety check to handle missing dates
  if (!date) {
    return 'Unbekannt';
  }
  
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function prevPage(): void {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage(): void {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(page: number): void {
  currentPage.value = page;
}

function contactPoster(message: JobBulletin): void {
  selectedMessage.value = message;
  showContactModal.value = true;
}

function closeContactModal(): void {
  showContactModal.value = false;
  // Reset form
  contactForm.name = '';
  contactForm.email = '';
  contactForm.message = '';
}

function sendContact(): void {
  // Here we would normally send an API request
  console.log('Contact request sent:', {
    to: selectedMessage.value.email,
    from: contactForm
  });
  
  // Close the modal and show a success message
  alert('Ihre Nachricht wurde gesendet!');
  closeContactModal();
}

function retryFetch(): void {
  window.location.reload();
}

// Fetch job listings on component mount
onMounted(async () => {
  try {
    console.log('Fetching job listings');
    isLoading.value = true;
    loadError.value = null;
    
    // Fetch from the bulletinProxyService
    const response = await bulletinProxyService.getAllBulletins({
      messageType: currentFilter.value === 'all' ? '' : currentFilter.value,
      sort: sortOrder.value === 'newest' ? '-timestamp' : 'timestamp'
    });
    
    if (response && response.data) {
      console.log(`Loaded ${response.data.length} job listings`);
      
      // Process data and convert _id to id if needed
      messages.value = response.data.map((item: any) => ({
        ...item,
        id: item._id, // Add id field based on _id
        timestamp: item.createdAt || item.timestamp || new Date(),
        status: item.status || 'active', // Default to active if status is missing
        messageType: item.messageType as 'Angebot' | 'Gesuch'
      }));
    } else {
      console.warn('No job listings found or empty response');
      messages.value = [];
    }
  } catch (err: any) {
    console.error('Error fetching job listings:', err);
    loadError.value = `Fehler beim Laden der Daten: ${err.message || 'Unbekannter Fehler'}`;
  } finally {
    isLoading.value = false;
  }
});
</script> 