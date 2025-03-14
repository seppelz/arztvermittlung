<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Pinnwand-Einträge</h1>
      
      <div class="flex">
        <button 
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Neuer Eintrag
        </button>
      </div>
    </div>
    
    <!-- Filter-Optionen -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div class="flex flex-wrap gap-4 items-center">
        <h3 class="text-lg font-medium text-gray-700 mr-4">Filter:</h3>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="filterByType('all')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'all' ? 'bg-primary-100 text-primary-700 font-medium border border-primary-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Alle
          </button>
          <button 
            @click="filterByType('Angebot')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'Angebot' ? 'bg-success-100 text-success-700 font-medium border border-success-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Angebote
          </button>
          <button 
            @click="filterByType('Gesuch')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'Gesuch' ? 'bg-primary-100 text-primary-700 font-medium border border-primary-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Gesuche
          </button>
          <button 
            @click="filterByType('Information')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'Information' ? 'bg-warning-100 text-warning-700 font-medium border border-warning-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Informationen
          </button>
        </div>
        
        <div class="flex items-center ml-auto">
          <label for="statusFilter" class="mr-2 text-gray-700 text-sm font-medium">Status:</label>
          <select 
            id="statusFilter" 
            v-model="statusFilter" 
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm appearance-none text-sm"
          >
            <option value="all">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="pending">Ausstehend</option>
            <option value="archived">Archiviert</option>
          </select>
        </div>
        
        <div class="flex items-center">
          <label for="sortOrder" class="mr-2 text-gray-700 text-sm font-medium">Sortieren:</label>
          <select 
            id="sortOrder" 
            v-model="sortOrder" 
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm appearance-none text-sm"
          >
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
          </select>
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
                Typ
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titel
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ersteller
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
            <tr v-for="bulletin in filteredBulletins" :key="bulletin.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-success-100 text-success-800': bulletin.messageType === 'Angebot',
                    'bg-primary-100 text-primary-800': bulletin.messageType === 'Gesuch',
                    'bg-warning-100 text-warning-800': bulletin.messageType === 'Information'
                  }"
                >
                  {{ bulletin.messageType }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 truncate max-w-md">
                  {{ bulletin.title }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ bulletin.name }}</div>
                <div class="text-sm text-gray-500">{{ bulletin.userType }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(bulletin.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': bulletin.status === 'active',
                    'bg-yellow-100 text-yellow-800': bulletin.status === 'pending',
                    'bg-gray-100 text-gray-800': bulletin.status === 'archived'
                  }"
                >
                  {{ getStatusLabel(bulletin.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="text-primary-600 hover:text-primary-900 mx-1"
                  @click="viewBulletin(bulletin)"
                  title="Ansehen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  class="text-indigo-600 hover:text-indigo-900 mx-1"
                  @click="editBulletin(bulletin)"
                  title="Bearbeiten"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  class="text-red-600 hover:text-red-900 mx-1"
                  @click="deleteBulletin(bulletin.id)"
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
              <span class="font-medium">{{ filteredBulletins.length > 0 ? 1 : 0 }}</span>
              bis
              <span class="font-medium">{{ Math.min(pageSize, filteredBulletins.length) }}</span>
              von
              <span class="font-medium">{{ filteredBulletins.length }}</span>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import bulletinService from '@/services/bulletin.service';

// Zustandsvariablen
const bulletins = ref([]);
const isLoading = ref(true);
const error = ref(null);

const currentFilter = ref('all');
const statusFilter = ref('all');
const sortOrder = ref('newest');
const currentPage = ref(1);
const pageSize = ref(10);

// Holen der Bulletin-Einträge vom Server
const fetchBulletins = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await bulletinService.getAllBulletins();
    bulletins.value = response.data.map(item => ({
      ...item,
      id: item._id, // MongoDB verwendet _id, wir verwenden id für Konsistenz in der UI
      timestamp: new Date(item.timestamp)
    }));
  } catch (err) {
    console.error('Error fetching bulletins:', err);
    error.value = 'Fehler beim Laden der Pinnwand-Einträge. Bitte versuchen Sie es später erneut.';
  } finally {
    isLoading.value = false;
  }
};

// Gefilterte und sortierte Einträge
const filteredBulletins = computed(() => {
  let result = [...bulletins.value];
  
  // Nach Typ filtern
  if (currentFilter.value !== 'all') {
    result = result.filter(item => item.messageType === currentFilter.value);
  }
  
  // Nach Status filtern
  if (statusFilter.value !== 'all') {
    result = result.filter(item => item.status === statusFilter.value);
  }
  
  // Sortieren
  if (sortOrder.value === 'newest') {
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else {
    result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
  
  return result;
});

// Berechnung der Gesamtseitenzahl
const totalPages = computed(() => {
  return Math.ceil(filteredBulletins.value.length / pageSize.value) || 1;
});

// Nach Typ filtern
const filterByType = (type) => {
  currentFilter.value = type;
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
    year: 'numeric'
  });
};

// Status-Label abrufen
const getStatusLabel = (status) => {
  switch (status) {
    case 'active':
      return 'Aktiv';
    case 'pending':
      return 'Ausstehend';
    case 'archived':
      return 'Archiviert';
    default:
      return status;
  }
};

// Pinnwand-Eintrag ansehen
const viewBulletin = (bulletin) => {
  console.log('Pinnwand-Eintrag ansehen:', bulletin);
  // Implementierung der Detailansicht
};

// Pinnwand-Eintrag bearbeiten
const editBulletin = (bulletin) => {
  console.log('Pinnwand-Eintrag bearbeiten:', bulletin);
  // Implementierung des Bearbeitungs-Dialogs
};

// Pinnwand-Eintrag löschen
const deleteBulletin = async (id) => {
  try {
    await bulletinService.deleteBulletin(id);
    // Nach erfolgreichem Löschen den Eintrag aus der lokalen Liste entfernen
    bulletins.value = bulletins.value.filter(item => item.id !== id);
  } catch (err) {
    console.error('Error deleting bulletin:', err);
    alert('Fehler beim Löschen des Eintrags. Bitte versuchen Sie es später erneut.');
  }
};

// Aktualisieren des Status eines Bulletin-Eintrags
const updateBulletinStatus = async (id, newStatus) => {
  try {
    await bulletinService.updateBulletin(id, { status: newStatus });
    // Nach erfolgreicher Aktualisierung den Eintrag in der lokalen Liste aktualisieren
    const index = bulletins.value.findIndex(item => item.id === id);
    if (index !== -1) {
      bulletins.value[index].status = newStatus;
    }
  } catch (err) {
    console.error('Error updating bulletin status:', err);
    alert('Fehler beim Aktualisieren des Status. Bitte versuchen Sie es später erneut.');
  }
};

// Initialisierung
onMounted(() => {
  fetchBulletins();
});
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style> 