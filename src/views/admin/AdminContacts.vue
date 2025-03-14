<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Kontaktanfragen</h1>
    </div>

    <!-- Filter-Optionen -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div class="flex flex-wrap gap-4 items-center">
        <h3 class="text-lg font-medium text-gray-700 mr-4">Filter:</h3>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="filterByStatus('all')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'all' ? 'bg-primary-100 text-primary-700 font-medium border border-primary-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Alle
          </button>
          <button 
            @click="filterByStatus('pending')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'pending' ? 'bg-yellow-100 text-yellow-700 font-medium border border-yellow-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Ausstehend
          </button>
          <button 
            @click="filterByStatus('viewed')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'viewed' ? 'bg-blue-100 text-blue-700 font-medium border border-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Gesehen
          </button>
          <button 
            @click="filterByStatus('responded')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'responded' ? 'bg-green-100 text-green-700 font-medium border border-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Beantwortet
          </button>
        </div>
        
        <div class="flex items-center ml-auto">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Suche..." 
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm shadow-sm"
          />
        </div>
      </div>
    </div>
    
    <!-- Tabelle -->
    <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Betreff / Eintrag
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Absender
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empfänger
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="contact in filteredContacts" :key="contact.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ contact.id }}
              </td>
              <td class="px-6 py-4">
                <div v-if="contact.relatedPost" class="text-sm font-medium text-gray-900">
                  {{ contact.relatedPost.title }}
                </div>
                <div v-else class="text-sm font-medium text-gray-900">
                  Direkte Anfrage
                </div>
                <div class="text-sm text-gray-500 mt-1 line-clamp-2">
                  {{ truncateMessage(contact.message) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ contact.name }}</div>
                <div class="text-sm text-gray-500">{{ contact.email }}</div>
              </td>
              <td class="px-6 py-4">
                <div v-if="contact.toUser" class="text-sm text-gray-900">
                  {{ contact.toUser.name }}
                </div>
                <div v-else class="text-sm text-gray-500">
                  Nicht zugeordnet
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(contact.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': contact.status === 'pending',
                    'bg-blue-100 text-blue-800': contact.status === 'viewed',
                    'bg-green-100 text-green-800': contact.status === 'responded'
                  }"
                >
                  {{ getStatusLabel(contact.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="text-primary-600 hover:text-primary-900 mx-1"
                  @click="viewContact(contact)"
                  title="Ansehen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  v-if="contact.status !== 'responded'"
                  class="text-indigo-600 hover:text-indigo-900 mx-1"
                  @click="markAsResponded(contact)"
                  title="Als beantwortet markieren"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button 
                  class="text-red-600 hover:text-red-900 mx-1"
                  @click="deleteContact(contact)"
                  title="Löschen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginierung -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Zeige
              <span class="font-medium">{{ filteredContacts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }}</span>
              bis
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredContacts.length) }}</span>
              von
              <span class="font-medium">{{ filteredContacts.length }}</span>
              Einträgen
            </p>
          </div>
          <div>
            <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
              >
                <span class="sr-only">Zurück</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                :class="page === currentPage ? 'bg-primary-50 text-primary-600 border-primary-500 z-10' : 'text-gray-500 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
              >
                <span class="sr-only">Weiter</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Kontaktdetails-Modal -->
    <div v-if="activeContact" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="activeContact = null"></div>
      
      <div class="relative bg-white rounded-lg max-w-3xl w-full mx-4 shadow-xl">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-900">Kontaktanfrage Details</h3>
            <button @click="activeContact = null" class="text-gray-400 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mr-2"
                  :class="{
                    'bg-yellow-100 text-yellow-800': activeContact.status === 'pending',
                    'bg-blue-100 text-blue-800': activeContact.status === 'viewed',
                    'bg-green-100 text-green-800': activeContact.status === 'responded'
                  }"
                >
                  {{ getStatusLabel(activeContact.status) }}
                </span>
                <span class="text-sm text-gray-500">ID: {{ activeContact.id }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ formatDate(activeContact.timestamp) }}</span>
            </div>
            
            <div v-if="activeContact.relatedPost" class="mb-4">
              <h4 class="text-base font-semibold text-gray-800 mb-1">Bezug auf Pinnwand-Eintrag:</h4>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div class="font-medium">{{ activeContact.relatedPost.title }}</div>
                <div class="text-sm text-gray-500">{{ activeContact.relatedPost.messageType }}</div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-1">Absender</h4>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div class="font-medium">{{ activeContact.name }}</div>
                <div class="text-sm text-gray-500">{{ activeContact.email }}</div>
                <div v-if="activeContact.fromUser" class="text-sm text-gray-500 mt-2">
                  Benutzer-ID: {{ activeContact.fromUser.id }}
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-1">Empfänger</h4>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div v-if="activeContact.toUser" class="font-medium">{{ activeContact.toUser.name }}</div>
                <div v-else class="text-sm text-gray-500">Nicht zugeordnet</div>
                <div v-if="activeContact.toUser" class="text-sm text-gray-500">
                  {{ activeContact.toUser.email }}
                  <div class="mt-2">Benutzer-ID: {{ activeContact.toUser.id }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-6">
            <h4 class="text-sm font-semibold text-gray-700 mb-1">Nachricht</h4>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
              {{ activeContact.message }}
            </div>
          </div>
          
          <div class="flex justify-between">
            <button 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
              @click="deleteContact(activeContact)"
            >
              Löschen
            </button>
            
            <div class="space-x-2">
              <button 
                v-if="activeContact.status !== 'responded'"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
                @click="markAsResponded(activeContact)"
              >
                Als beantwortet markieren
              </button>
              
              <button 
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
                @click="activeContact = null"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Zustandsvariablen
const contacts = ref([
  {
    id: '1001',
    name: 'Dr. Julia Weber',
    email: 'j.weber@arztpraxis.de',
    fromUser: {
      id: '2001',
      name: 'Dr. Julia Weber'
    },
    toUser: {
      id: '2002',
      name: 'Klinikum München',
      email: 'personal@klinikum-muenchen.de'
    },
    relatedPost: {
      title: 'Chirurgen für Sommereinsatz gesucht',
      messageType: 'Angebot'
    },
    message: 'Sehr geehrte Damen und Herren,\n\nIch interessiere mich für Ihre Stellenausschreibung als Chirurg für den Sommereinsatz. Ich habe bereits 5 Jahre Erfahrung in der Unfallchirurgie und bin flexibel einsetzbar.\n\nMit freundlichen Grüßen,\nDr. Julia Weber',
    timestamp: new Date('2025-05-15T14:30:00'),
    status: 'pending'
  },
  {
    id: '1002',
    name: 'Thomas Schmidt',
    email: 't.schmidt@mail.de',
    fromUser: {
      id: '2003',
      name: 'Dr. Thomas Schmidt'
    },
    toUser: {
      id: '2004',
      name: 'Universitätsklinikum Hamburg',
      email: 'karriere@uk-hamburg.de'
    },
    relatedPost: {
      title: 'Radiologie-Facharzt für Teilzeit gesucht',
      messageType: 'Gesuch'
    },
    message: 'Hallo,\n\nIch bin interessiert an der Teilzeitstelle in der Radiologie. Wann könnten wir telefonieren, um Details zu besprechen?\n\nBeste Grüße,\nThomas Schmidt',
    timestamp: new Date('2025-05-14T10:15:00'),
    status: 'viewed'
  },
  {
    id: '1003',
    name: 'Maria Müller',
    email: 'm.mueller@praxis.de',
    fromUser: null,
    toUser: {
      id: '2005',
      name: 'Rehaklinik Schwarzwald',
      email: 'personal@rehaklinik-schwarzwald.de'
    },
    relatedPost: {
      title: 'Internisten für Rehaklinik gesucht',
      messageType: 'Gesuch'
    },
    message: 'Sehr geehrtes Team,\n\nIch bin Fachärztin für Innere Medizin und suche eine neue Herausforderung. Ihre Stellenausschreibung für die Rehaklinik hat mein Interesse geweckt.\n\nGerne möchte ich mich vorstellen. Wann wäre ein guter Zeitpunkt für ein Gespräch?\n\nFreundliche Grüße,\nDr. Maria Müller',
    timestamp: new Date('2025-05-12T16:45:00'),
    status: 'responded'
  },
  {
    id: '1004',
    name: 'Andreas Klein',
    email: 'a.klein@klinik-rheinland.de',
    fromUser: {
      id: '2006',
      name: 'Klinik Rheinland'
    },
    toUser: {
      id: '2007',
      name: 'Dr. Markus Klein',
      email: 'm.klein@doktor.de'
    },
    relatedPost: {
      title: 'Erfahrener Chirurg bietet Vertretung an',
      messageType: 'Angebot'
    },
    message: 'Sehr geehrter Herr Dr. Klein,\n\nWir haben Ihr Angebot zur Vertretung als Chirurg mit großem Interesse gelesen. Unsere Klinik sucht aktuell für den Zeitraum August bis September eine Vertretung.\n\nKönnten Sie uns Ihre Verfügbarkeit in diesem Zeitraum mitteilen?\n\nMit freundlichen Grüßen,\nAndreas Klein\nPersonalabteilung Klinik Rheinland',
    timestamp: new Date('2025-05-11T09:30:00'),
    status: 'pending'
  },
  {
    id: '1005',
    name: 'Sarah Fischer',
    email: 's.fischer@mail.de',
    fromUser: null,
    toUser: null,
    relatedPost: null,
    message: 'Guten Tag,\n\nIch habe eine allgemeine Frage zur Plattform. Wie kann ich mich als Arzt registrieren? Ich finde die Anmeldeseite nicht.\n\nVielen Dank und freundliche Grüße,\nSarah Fischer',
    timestamp: new Date('2025-05-10T11:20:00'),
    status: 'pending'
  }
]);

const currentFilter = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const activeContact = ref(null);

// Gefilterte und sortierte Kontaktanfragen
const filteredContacts = computed(() => {
  let result = [...contacts.value];
  
  // Nach Status filtern, falls angegeben
  if (currentFilter.value !== 'all') {
    result = result.filter(contact => contact.status === currentFilter.value);
  }
  
  // Nach Suchbegriff filtern
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(contact => 
      (contact.name && contact.name.toLowerCase().includes(query)) || 
      (contact.email && contact.email.toLowerCase().includes(query)) ||
      (contact.message && contact.message.toLowerCase().includes(query)) ||
      (contact.relatedPost && contact.relatedPost.title && contact.relatedPost.title.toLowerCase().includes(query))
    );
  }
  
  // Nach Zeitstempel sortieren (neueste zuerst)
  result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return result;
});

// Berechnung der Gesamtseitenzahl
const totalPages = computed(() => {
  return Math.ceil(filteredContacts.value.length / pageSize.value) || 1;
});

// Nach Status filtern
const filterByStatus = (status) => {
  currentFilter.value = status;
  currentPage.value = 1;
};

// Zur Seite wechseln
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Datum formatieren
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Status-Label abrufen
const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Ausstehend';
    case 'viewed':
      return 'Gesehen';
    case 'responded':
      return 'Beantwortet';
    default:
      return status;
  }
};

// Nachricht kürzen, wenn sie zu lang ist
const truncateMessage = (message) => {
  if (!message) return '';
  return message.length > 60 ? message.substring(0, 60) + '...' : message;
};

// Kontaktanfrage ansehen
const viewContact = (contact) => {
  // Wenn der Status "pending" ist, auf "viewed" setzen
  if (contact.status === 'pending') {
    contact.status = 'viewed';
  }
  
  // Kontaktdetails anzeigen
  activeContact.value = contact;
};

// Kontaktanfrage als beantwortet markieren
const markAsResponded = (contact) => {
  if (confirm(`Möchten Sie die Kontaktanfrage von "${contact.name}" als beantwortet markieren?`)) {
    console.log('Kontaktanfrage als beantwortet markieren:', contact);
    contact.status = 'responded';
    
    // Wenn das Modal geöffnet ist, muss der aktive Kontakt aktualisiert werden
    if (activeContact.value && activeContact.value.id === contact.id) {
      activeContact.value.status = 'responded';
    }
  }
};

// Kontaktanfrage löschen
const deleteContact = (contact) => {
  if (confirm(`Möchten Sie die Kontaktanfrage von "${contact.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
    console.log('Kontaktanfrage löschen:', contact);
    contacts.value = contacts.value.filter(item => item.id !== contact.id);
    
    // Wenn das Modal geöffnet ist, schließen
    if (activeContact.value && activeContact.value.id === contact.id) {
      activeContact.value = null;
    }
  }
};

// Initialisierung
onMounted(() => {
  // Hier würden normalerweise API-Aufrufe erfolgen, um die Daten zu laden
  console.log('AdminContacts initialisiert');
});
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style>