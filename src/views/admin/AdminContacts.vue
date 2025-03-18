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
    
    <!-- Loading-Indikator -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <!-- Fehlermeldung -->
    <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200 text-center">
      <div class="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-gray-700 mb-4">{{ error }}</p>
      <button @click="fetchContacts" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
        Erneut versuchen
      </button>
    </div>
    
    <!-- Keine Kontaktanfragen -->
    <div v-else-if="contacts.length === 0" class="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200 text-center">
      <div class="text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <p class="text-gray-700">Keine Kontaktanfragen gefunden</p>
    </div>
    
    <!-- Tabelle -->
    <div v-else class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
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
            <tr v-for="contact in filteredContacts" :key="contact._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ contact._id }}
              </td>
              <td class="px-6 py-4">
                <div v-if="contact.relatedPostId" class="text-sm font-medium text-gray-900">
                  {{ contact.relatedPostId.title || 'Kein Titel' }}
                </div>
                <div v-else class="text-sm font-medium text-gray-900">
                  {{ contact.subject || 'Direkte Anfrage' }}
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
              <span class="font-medium">{{ totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0 }}</span>
              bis
              <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span>
              von
              <span class="font-medium">{{ totalItems }}</span>
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
                <span class="text-sm text-gray-500">ID: {{ activeContact._id }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ formatDate(activeContact.timestamp) }}</span>
            </div>
            
            <div v-if="activeContact.relatedPostId" class="mb-4">
              <h4 class="text-base font-semibold text-gray-800 mb-1">Bezug auf Pinnwand-Eintrag:</h4>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div class="font-medium text-gray-800">{{ activeContact.relatedPostId.title || 'Kein Titel' }}</div>
                <div class="flex items-center mt-1 text-gray-600 text-sm">
                  <span class="mr-2">Typ:</span>
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100">
                    {{ activeContact.relatedPostId.messageType || 'Unbekannt' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-else-if="activeContact.subject" class="mb-4">
              <h4 class="text-base font-semibold text-gray-800 mb-1">Betreff:</h4>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div class="font-medium text-gray-800">{{ activeContact.subject }}</div>
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
import contactService from '@/services/contact.service';

// Zustandsvariablen
const contacts = ref([]);
const loading = ref(false);
const error = ref(null);
const currentFilter = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const totalItems = ref(0);
const activeContact = ref(null);

// Kontaktanfragen laden
const fetchContacts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Filter vorbereiten
    const params = {};
    if (currentFilter.value !== 'all') {
      params.status = currentFilter.value;
    }
    
    // Paginierung
    params.page = currentPage.value;
    params.limit = pageSize.value;
    
    // Sortierung (neueste zuerst)
    params.sort = '-timestamp';
    
    console.log('Fetching contacts with params:', params);
    const response = await contactService.getAllContacts(params);
    console.log('Contacts response:', response);
    
    if (response && response.data) {
      contacts.value = response.data;
      totalItems.value = response.results || 0;
      totalPages.value = response.totalPages || 1;
      
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value;
        await fetchContacts(); // Erneut laden mit korrigierter Seite
        return;
      }
    } else {
      contacts.value = [];
      totalItems.value = 0;
      totalPages.value = 1;
    }
  } catch (err) {
    console.error('Error fetching contacts:', err);
    error.value = 'Fehler beim Laden der Kontaktanfragen. Bitte versuchen Sie es später erneut.';
    contacts.value = [];
  } finally {
    loading.value = false;
  }
};

// Gefilterte Kontaktanfragen
const filteredContacts = computed(() => {
  // Bei API-basierter Filterung direkt die contacts zurückgeben
  return contacts.value;
});

// Nach Status filtern
const filterByStatus = (status) => {
  currentFilter.value = status;
  currentPage.value = 1;
  fetchContacts();
};

// Zur Seite wechseln
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchContacts();
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
const viewContact = async (contact) => {
  // Wenn der Status "pending" ist, auf "viewed" setzen
  if (contact.status === 'pending') {
    try {
      await contactService.updateContact(contact._id, { status: 'viewed' });
      contact.status = 'viewed';
    } catch (err) {
      console.error('Error updating contact status:', err);
    }
  }
  
  // Kontaktdetails anzeigen
  activeContact.value = contact;
};

// Kontaktanfrage als beantwortet markieren
const markAsResponded = async (contact) => {
  if (confirm(`Möchten Sie die Kontaktanfrage von "${contact.name}" als beantwortet markieren?`)) {
    try {
      console.log('Markiere Kontaktanfrage als beantwortet:', contact);
      await contactService.updateContact(contact._id, { status: 'responded' });
      contact.status = 'responded';
      
      // Wenn das Modal geöffnet ist, muss der aktive Kontakt aktualisiert werden
      if (activeContact.value && activeContact.value._id === contact._id) {
        activeContact.value.status = 'responded';
      }
    } catch (err) {
      console.error('Error marking contact as responded:', err);
      alert('Fehler beim Markieren als beantwortet. Bitte versuchen Sie es später erneut.');
    }
  }
};

// Kontaktanfrage löschen
const deleteContact = async (contact) => {
  if (confirm(`Möchten Sie die Kontaktanfrage von "${contact.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
    try {
      console.log('Lösche Kontaktanfrage:', contact);
      await contactService.deleteContact(contact._id);
      
      // Aus der lokalen Liste entfernen
      contacts.value = contacts.value.filter(item => item._id !== contact._id);
      
      // Wenn das Modal geöffnet ist, schließen
      if (activeContact.value && activeContact.value._id === contact._id) {
        activeContact.value = null;
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Fehler beim Löschen der Kontaktanfrage. Bitte versuchen Sie es später erneut.');
    }
  }
};

// Initialisierung
onMounted(() => {
  console.log('AdminContacts initialisiert');
  fetchContacts();
});
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style>