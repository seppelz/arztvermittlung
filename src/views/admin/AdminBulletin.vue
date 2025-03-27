<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Pinnwand-Einträge</h1>
      
      <div class="flex">
        <button 
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-sm"
          @click="openNewBulletinModal"
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

    <!-- Edit/View Modal -->
    <div v-if="showBulletinModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 class="text-lg font-bold text-gray-900">
            {{ isEditMode ? 'Pinnwand-Eintrag bearbeiten' : 'Pinnwand-Eintrag anzeigen' }}
          </h3>
          <button @click="closeBulletinModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveBulletin" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Titel -->
            <div class="col-span-2">
              <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-1">Titel*</label>
              <input 
                id="edit-title"
                v-model="editingBulletin.title"
                type="text"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <!-- Basisinformationen -->
            <div>
              <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                id="edit-name"
                v-model="editingBulletin.name"
                type="text"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="edit-email" class="block text-sm font-medium text-gray-700 mb-1">E-Mail*</label>
              <input 
                id="edit-email"
                v-model="editingBulletin.email"
                type="email"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="edit-phone" class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input 
                id="edit-phone"
                v-model="editingBulletin.phone"
                type="text"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="edit-userType" class="block text-sm font-medium text-gray-700 mb-1">Benutzertyp*</label>
              <select 
                id="edit-userType"
                v-model="editingBulletin.userType"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="Arzt">Arzt</option>
                <option value="Klinik">Klinik</option>
              </select>
            </div>
            
            <div>
              <label for="edit-messageType" class="block text-sm font-medium text-gray-700 mb-1">Nachrichtentyp*</label>
              <select 
                id="edit-messageType"
                v-model="editingBulletin.messageType"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="Angebot">Angebot</option>
                <option value="Gesuch">Gesuch</option>
                <option value="Information">Information</option>
              </select>
            </div>
            
            <div>
              <label for="edit-specialty" class="block text-sm font-medium text-gray-700 mb-1">Fachrichtung</label>
              <input 
                id="edit-specialty"
                v-model="editingBulletin.specialty"
                type="text"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="edit-status" class="block text-sm font-medium text-gray-700 mb-1">Status*</label>
              <select 
                id="edit-status"
                v-model="editingBulletin.status"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="active">Aktiv</option>
                <option value="pending">Ausstehend</option>
                <option value="archived">Archiviert</option>
              </select>
            </div>
            
            <!-- Angebots-/Gesuchsspezifische Felder -->
            <div v-if="editingBulletin.messageType === 'Angebot' || editingBulletin.messageType === 'Gesuch'">
              <label for="edit-startDate" class="block text-sm font-medium text-gray-700 mb-1">Verfügbar ab*</label>
              <input 
                id="edit-startDate"
                v-model="formattedStartDate"
                type="date"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div v-if="editingBulletin.userType === 'Klinik' && editingBulletin.messageType === 'Angebot'">
              <label for="edit-federalState" class="block text-sm font-medium text-gray-700 mb-1">Bundesland*</label>
              <select 
                id="edit-federalState"
                v-model="editingBulletin.federalState"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
            
            <!-- Weitere optionale Felder -->
            <div>
              <label for="edit-location" class="block text-sm font-medium text-gray-700 mb-1">Ort</label>
              <input 
                id="edit-location"
                v-model="editingBulletin.location"
                type="text"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="edit-duration" class="block text-sm font-medium text-gray-700 mb-1">Dauer</label>
              <input 
                id="edit-duration"
                v-model="editingBulletin.duration"
                type="text"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="edit-compensation" class="block text-sm font-medium text-gray-700 mb-1">Vergütung</label>
              <input 
                id="edit-compensation"
                v-model="editingBulletin.compensation"
                type="number"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div v-if="isEditMode">
              <label for="edit-featured" class="block text-sm font-medium text-gray-700 mb-1">
                <input 
                  id="edit-featured"
                  v-model="editingBulletin.featured"
                  type="checkbox"
                  class="h-4 w-4 mr-2 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                Hervorgehoben
              </label>
            </div>

            <div v-if="isEditMode">
              <label for="edit-privacyPolicyAccepted" class="block text-sm font-medium text-gray-700 mb-1">
                <input 
                  id="edit-privacyPolicyAccepted"
                  v-model="editingBulletin.privacyPolicyAccepted"
                  type="checkbox"
                  class="h-4 w-4 mr-2 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                Datenschutzerklärung akzeptiert
              </label>
            </div>

            <!-- Inhalt -->
            <div class="col-span-2">
              <label for="edit-content" class="block text-sm font-medium text-gray-700 mb-1">Inhalt*</label>
              <textarea 
                id="edit-content"
                v-model="editingBulletin.content"
                rows="6"
                :disabled="!isEditMode"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end mt-6 space-x-3">
            <button 
              v-if="!isEditMode" 
              type="button" 
              @click="enableEditMode" 
              class="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md shadow-sm"
            >
              Bearbeiten
            </button>
            <button 
              v-if="isEditMode" 
              type="submit" 
              class="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md shadow-sm"
            >
              Speichern
            </button>
            <button 
              type="button" 
              @click="closeBulletinModal" 
              class="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm"
            >
              {{ isEditMode ? 'Abbrechen' : 'Schließen' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import bulletinProxyService from '@/services/bulletinProxyService';

// Zustandsvariablen
const bulletins = ref([]);
const isLoading = ref(true);
const error = ref(null);

const currentFilter = ref('all');
const statusFilter = ref('all');
const sortOrder = ref('newest');
const currentPage = ref(1);
const pageSize = ref(10);

// Modal und Bearbeitungsstatus
const showBulletinModal = ref(false);
const isEditMode = ref(false);
const editingBulletin = ref({});

// Formatiertes Startdatum für das Datums-Input-Feld
const formattedStartDate = computed({
  get: () => {
    if (!editingBulletin.value.startDate) return '';
    // ISO-Datum für input[type="date"] (YYYY-MM-DD)
    const date = new Date(editingBulletin.value.startDate);
    return date.toISOString().split('T')[0];
  },
  set: (newValue) => {
    editingBulletin.value.startDate = newValue ? new Date(newValue) : null;
  }
});

// Holen der Bulletin-Einträge vom Server
const fetchBulletins = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('AdminBulletin: Fetching bulletins from server...');
    
    // Log the request parameters
    console.log('AdminBulletin: Request parameters:', {});
    
    const response = await bulletinProxyService.getAllBulletins();
    
    if (response.data) {
      // Format the data to use consistent id property (either id or _id)
      const formattedData = response.data.map(item => ({
        ...item,
        id: item._id || item.id
      }));
      
      bulletins.value = formattedData;
      console.log('AdminBulletin: Loading completed, bulletins count:', bulletins.value.length);
    } else {
      bulletins.value = [];
      console.warn('AdminBulletin: No bulletins found or empty response');
      console.log('AdminBulletin: Loading completed, bulletins count: 0');
    }
  } catch (error) {
    console.error('AdminBulletin: Error fetching bulletins:', error);
    console.error('AdminBulletin: Error details:', error.response || error.message);
    
    // Set error message
    error.value = 'Fehler beim Laden der Daten: ' + (error.message || 'Unbekannter Fehler');
    
    // Reset bulletins
    bulletins.value = [];
    console.log('AdminBulletin: Loading completed, bulletins count: 0');
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

// Neues Bulletin anlegen
const openNewBulletinModal = () => {
  editingBulletin.value = {
    title: '',
    content: '',
    name: '',
    email: '',
    phone: '',
    userType: 'Arzt',
    messageType: 'Information',
    status: 'pending',
    specialty: '',
    federalState: '',
    startDate: null,
    location: '',
    duration: '',
    compensation: null,
    featured: false,
    privacyPolicyAccepted: true
  };
  isEditMode.value = true;
  showBulletinModal.value = true;
};

// Pinnwand-Eintrag ansehen
const viewBulletin = (bulletin) => {
  editingBulletin.value = { ...bulletin };
  isEditMode.value = false;
  showBulletinModal.value = true;
};

// Bearbeitungsmodus aktivieren
const enableEditMode = () => {
  isEditMode.value = true;
};

// Modal schließen
const closeBulletinModal = () => {
  showBulletinModal.value = false;
  isEditMode.value = false;
  editingBulletin.value = {};
};

// Pinnwand-Eintrag bearbeiten
const editBulletin = (bulletin) => {
  editingBulletin.value = { ...bulletin };
  isEditMode.value = true;
  showBulletinModal.value = true;
};

// Pinnwand-Eintrag speichern
const saveBulletin = async () => {
  try {
    // Pflichtfelder validieren
    if (!editingBulletin.value.title || !editingBulletin.value.content || !editingBulletin.value.email) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    
    // Validierung für Angebote und Gesuche
    if ((editingBulletin.value.messageType === 'Angebot' || editingBulletin.value.messageType === 'Gesuch') && !editingBulletin.value.startDate) {
      alert('Für Angebote und Gesuche ist ein Startdatum erforderlich.');
      return;
    }
    
    // Validierung für Klinik-Angebote
    if (editingBulletin.value.userType === 'Klinik' && editingBulletin.value.messageType === 'Angebot' && !editingBulletin.value.federalState) {
      alert('Für Klinik-Angebote ist ein Bundesland erforderlich.');
      return;
    }

    // Erstellung eines neuen Bulletins oder Aktualisierung eines bestehenden
    let response;
    const bulletinData = { ...editingBulletin.value };
    delete bulletinData.id; // ID entfernen, da MongoDB _id verwendet
    
    if (bulletinData._id) {
      const id = bulletinData._id;
      delete bulletinData._id; // _id kann nicht aktualisiert werden
      response = await bulletinProxyService.updateBulletin(id, bulletinData);
    } else {
      response = await bulletinProxyService.createBulletin(bulletinData);
    }
    
    // Nach erfolgreichem Speichern, aktualisieren wir die lokale Liste
    await fetchBulletins();
    closeBulletinModal();
  } catch (err) {
    console.error('Error saving bulletin:', err);
    alert('Fehler beim Speichern des Eintrags: ' + (err.response?.data?.message || err.message));
  }
};

// Pinnwand-Eintrag löschen
const deleteBulletin = async (id) => {
  try {
    await bulletinProxyService.deleteBulletin(id);
    // Nach erfolgreichem Löschen den Eintrag aus der lokalen Liste entfernen
    bulletins.value = bulletins.value.filter(item => item.id !== id);
  } catch (err) {
    console.error('Error deleting bulletin:', err);
    alert('Fehler beim Löschen des Eintrags. Bitte versuchen Sie es später erneut.');
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