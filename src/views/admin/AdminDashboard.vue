<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium uppercase leading-4">Pinnwand-Einträge</p>
            <p class="text-gray-800 text-2xl font-semibold leading-normal">{{ stats.bulletins.total }}</p>
          </div>
        </div>
        <div class="flex justify-between mt-4 text-sm text-gray-600">
          <div>
            <span class="font-medium text-green-600">{{ stats.bulletins.active }}</span> Aktiv
          </div>
          <div>
            <span class="font-medium text-yellow-600">{{ stats.bulletins.pending }}</span> Ausstehend
          </div>
          <div>
            <span class="font-medium text-gray-600">{{ stats.bulletins.archived }}</span> Archiviert
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium uppercase leading-4">Benutzer</p>
            <p class="text-gray-800 text-2xl font-semibold leading-normal">{{ stats.users.total }}</p>
          </div>
        </div>
        <div class="flex justify-between mt-4 text-sm text-gray-600">
          <div>
            <span class="font-medium text-blue-600">{{ stats.users.doctors }}</span> Ärzte
          </div>
          <div>
            <span class="font-medium text-purple-600">{{ stats.users.hospitals }}</span> Kliniken
          </div>
          <div>
            <span class="font-medium text-red-600">{{ stats.users.admins }}</span> Admins
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-accent-100 text-accent-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium uppercase leading-4">Kontaktanfragen</p>
            <p class="text-gray-800 text-2xl font-semibold leading-normal">{{ stats.contacts.total }}</p>
          </div>
        </div>
        <div class="flex justify-between mt-4 text-sm text-gray-600">
          <div>
            <span class="font-medium text-red-600">{{ stats.contacts.pending }}</span> Ausstehend
          </div>
          <div>
            <span class="font-medium text-blue-600">{{ stats.contacts.viewed }}</span> Gesehen
          </div>
          <div>
            <span class="font-medium text-green-600">{{ stats.contacts.responded }}</span> Beantwortet
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Letzte Aktivitäten</h2>
      
      <div v-if="loading" class="py-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p class="text-lg text-gray-600">Daten werden geladen...</p>
      </div>
      
      <div v-else-if="error" class="p-6 bg-red-50 rounded-lg text-center mb-4">
        <p class="text-red-600 mb-2 font-medium">{{ error }}</p>
        <button 
          @click="loadData" 
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
        >
          Erneut versuchen
        </button>
      </div>
      
      <div v-else-if="recentActivities.length === 0" class="py-8 text-center">
        <p class="text-lg text-gray-600">Keine Aktivitäten gefunden.</p>
      </div>
      
      <div v-else class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Typ
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beschreibung
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Benutzer
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(activity, index) in recentActivities" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-primary-100 text-primary-800': activity.type === 'bulletin',
                    'bg-secondary-100 text-secondary-800': activity.type === 'user',
                    'bg-accent-100 text-accent-800': activity.type === 'contact',
                    'bg-green-100 text-green-800': activity.type === 'job_offer',
                    'bg-blue-100 text-blue-800': activity.type === 'job_request'
                  }"
                >
                  {{ getActivityTypeLabel(activity.type) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ activity.description }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ activity.user }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(activity.date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Schnellzugriff</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link :to="{ name: 'AdminBulletin' }" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="p-2 rounded-md bg-primary-100 text-primary-600 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700">Pinnwand verwalten</span>
        </router-link>
        
        <router-link :to="{ name: 'AdminUsers' }" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="p-2 rounded-md bg-secondary-100 text-secondary-600 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700">Benutzer verwalten</span>
        </router-link>
        
        <router-link :to="{ name: 'AdminContacts' }" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="p-2 rounded-md bg-accent-100 text-accent-600 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700">Anfragen verwalten</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dashboardService from '@/services/dashboard.service';

// Zustandsvariablen
const loading = ref(false);
const error = ref(null);
const stats = ref({
  bulletins: {
    total: 0,
    active: 0,
    pending: 0,
    archived: 0
  },
  users: {
    total: 0,
    doctors: 0,
    hospitals: 0,
    admins: 0
  },
  contacts: {
    total: 0,
    pending: 0,
    viewed: 0,
    responded: 0
  }
});
const recentActivities = ref([]);

// Hilfsfunktion zum Formatieren des Datums
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Hilfsfunktion zum Abrufen des Labels für den Aktivitätstyp
const getActivityTypeLabel = (type) => {
  switch (type) {
    case 'bulletin':
      return 'Pinnwand';
    case 'user':
      return 'Benutzer';
    case 'contact':
      return 'Kontakt';
    case 'job_offer':
      return 'Stellenangebot';
    case 'job_request':
      return 'Stellengesuch';
    default:
      return 'Unbekannt';
  }
};

// Daten laden
const loadData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Statistiken laden
    const statsData = await dashboardService.getDashboardStats();
    stats.value = statsData;
    
    // Letzte Aktivitäten laden
    const activitiesData = await dashboardService.getRecentActivities(10);
    recentActivities.value = activitiesData;
    
    console.log('Dashboard-Daten geladen:', { stats: stats.value, activities: recentActivities.value.length });
  } catch (err) {
    console.error('Fehler beim Laden der Dashboard-Daten:', err);
    error.value = 'Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.';
  } finally {
    loading.value = false;
  }
};

// Initialisierung
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style> 