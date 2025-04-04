<template>
  <div>
    <div class="bg-blue-900 text-white py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-2">Anfrage-Matches verwalten</h1>
        <p class="text-lg">Übersicht aller Gesuche, Angebote und Interessenbekundungen</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading spinner -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      <!-- Error message -->
      <div v-else-if="loadError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
        <p class="font-bold">Fehler beim Laden der Matches</p>
        <p>{{ loadError }}</p>
        <button
          @click="fetchData"
          class="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-md"
        >
          Erneut versuchen
        </button>
      </div>

      <!-- Main content when loaded -->
      <div v-else>
        <!-- Filter controls -->
        <div class="bg-white p-4 rounded-lg shadow mb-8">
          <div class="flex flex-wrap gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Anzeigetyp</label>
              <select 
                v-model="filters.messageType" 
                class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="all">Alle anzeigen</option>
                <option value="Angebot">Nur Angebote</option>
                <option value="Gesuch">Nur Gesuche</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Interessenstatus</label>
              <select 
                v-model="filters.interestStatus" 
                class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="all">Alle anzeigen</option>
                <option value="withInterest">Mit Interessensbekundungen</option>
                <option value="noInterest">Ohne Interessensbekundungen</option>
              </select>
            </div>
            <div>
              <button 
                @click="fetchData" 
                class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg"
              >
                Aktualisieren
              </button>
            </div>
          </div>
        </div>

        <!-- No results message -->
        <div v-if="filteredBulletins.length === 0" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-8 rounded-lg text-center">
          <p class="text-xl font-semibold mb-2">Keine Einträge gefunden</p>
          <p>Für die gewählten Filter sind aktuell keine Anzeigen vorhanden.</p>
        </div>

        <!-- Bulletins list with accordion for interests -->
        <div v-else class="space-y-6">
          <div 
            v-for="bulletin in filteredBulletins" 
            :key="bulletin._id" 
            class="bg-white rounded-lg shadow overflow-hidden"
          >
            <!-- Bulletin header -->
            <div 
              class="p-4 cursor-pointer flex justify-between items-center"
              :class="bulletin.messageType === 'Angebot' ? 'bg-blue-50' : 'bg-green-50'"
              @click="toggleBulletinOpen(bulletin._id)"
            >
              <div>
                <div class="flex items-center space-x-3">
                  <span 
                    class="inline-block px-3 py-1 text-sm font-semibold rounded-full capitalize"
                    :class="bulletin.messageType === 'Angebot' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                  >
                    {{ bulletin.messageType }}
                  </span>
                  <span class="text-gray-500 text-sm">{{ formatDate(bulletin.createdAt) }}</span>
                </div>
                <h3 class="text-lg font-bold mt-2">{{ bulletin.title }}</h3>
              </div>
              
              <div class="flex items-center space-x-4">
                <span 
                  v-if="bulletin.replies && bulletin.replies.length > 0" 
                  class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold"
                >
                  {{ bulletin.replies.length }} Interessenten
                </span>
                <svg 
                  class="w-5 h-5 text-gray-500 transform transition-transform duration-200"
                  :class="openBulletins.includes(bulletin._id) ? 'rotate-180' : ''"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            <!-- Bulletin details + interests (collapsible) -->
            <div v-if="openBulletins.includes(bulletin._id)" class="border-t border-gray-200">
              <div class="p-4 bg-gray-50">
                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Left column: Bulletin details -->
                  <div>
                    <h4 class="font-semibold text-gray-700 mb-3">Anzeigendetails</h4>
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                      <p class="text-gray-700 mb-4">{{ bulletin.content }}</p>
                      
                      <div class="space-y-2 text-sm">
                        <p v-if="bulletin.specialty" class="flex items-center text-gray-600">
                          <span class="font-semibold mr-2">Fachbereich:</span> {{ bulletin.specialty }}
                        </p>
                        <p v-if="bulletin.location" class="flex items-center text-gray-600">
                          <span class="font-semibold mr-2">Ort:</span> {{ bulletin.location }}
                        </p>
                        <p v-if="bulletin.period" class="flex items-center text-gray-600">
                          <span class="font-semibold mr-2">Zeitraum:</span> {{ bulletin.period }}
                        </p>
                      </div>
                      
                      <div class="mt-4 pt-3 border-t border-gray-200">
                        <h5 class="font-semibold text-gray-700 mb-2">Kontaktdaten</h5>
                        <p class="text-sm"><span class="font-medium">Name:</span> {{ bulletin.name }}</p>
                        <p class="text-sm"><span class="font-medium">Email:</span> {{ bulletin.email }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Right column: Interests -->
                  <div>
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="font-semibold text-gray-700">Interessensbekundungen</h4>
                      <span class="text-sm text-gray-500">{{ bulletin.replies?.length || 0 }} insgesamt</span>
                    </div>
                    
                    <div v-if="!bulletin.replies || bulletin.replies.length === 0" class="bg-white p-4 rounded-lg border border-gray-200 text-center text-gray-500">
                      Keine Interessensbekundungen vorhanden
                    </div>
                    
                    <div v-else class="space-y-3">
                      <div 
                        v-for="reply in bulletin.replies" 
                        :key="reply._id" 
                        class="bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <div class="flex justify-between items-start mb-2">
                          <h5 class="font-medium">{{ reply.name }}</h5>
                          <span class="text-xs text-gray-500">{{ formatDate(reply.timestamp) }}</span>
                        </div>
                        <p class="text-gray-700 mb-3">{{ reply.content }}</p>
                        <div class="text-right">
                          <a 
                            :href="`mailto:${reply.email}`" 
                            class="text-primary hover:text-primary-dark text-sm font-medium"
                          >
                            {{ reply.email }}
                          </a>
                        </div>
                        <div class="mt-3 flex justify-end space-x-2">
                          <button 
                            @click="markMatch(bulletin._id, reply._id)" 
                            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Match bestätigen
                          </button>
                          <button 
                            @click="declineMatch(bulletin._id, reply._id)" 
                            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Ablehnen
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import bulletinProxyService from '@/services/bulletinProxyService';

// Types
interface BulletinReply {
  _id: string;
  content: string;
  name: string;
  email: string;
  timestamp: Date;
  interestExpression?: boolean;
  matchStatus?: 'pending' | 'approved' | 'declined';
}

interface Bulletin {
  _id: string;
  title: string;
  content: string;
  name: string;
  email: string;
  status: string;
  messageType: string;
  createdAt: Date;
  specialty?: string;
  location?: string;
  period?: string;
  replies?: BulletinReply[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | null;
}

// State
const bulletins = ref<Bulletin[]>([]);
const isLoading = ref(false);
const loadError = ref<string | null>(null);
const openBulletins = ref<string[]>([]);

// Filters
const filters = reactive({
  messageType: 'all',
  interestStatus: 'all'
});

// Computed
const filteredBulletins = computed(() => {
  return bulletins.value.filter(bulletin => {
    // Filter by message type
    if (filters.messageType !== 'all' && bulletin.messageType !== filters.messageType) {
      return false;
    }
    
    // Filter by interest status
    if (filters.interestStatus === 'withInterest' && (!bulletin.replies || bulletin.replies.length === 0)) {
      return false;
    }
    if (filters.interestStatus === 'noInterest' && bulletin.replies && bulletin.replies.length > 0) {
      return false;
    }
    
    return true;
  });
});

// Methods
const fetchData = async () => {
  isLoading.value = true;
  loadError.value = null;
  
  try {
    // Get all bulletins
    const response = await bulletinProxyService.getAllBulletins({
      status: 'active'
    }) as ApiResponse<Bulletin[]>;
    
    if (response.success && response.data) {
      bulletins.value = response.data;
    } else {
      loadError.value = response.error || 'Fehler beim Laden der Daten';
    }
  } catch (error) {
    console.error('Error loading bulletins:', error);
    loadError.value = 'Fehler beim Laden der Daten';
  } finally {
    isLoading.value = false;
  }
};

const toggleBulletinOpen = (id: string) => {
  const index = openBulletins.value.indexOf(id);
  if (index === -1) {
    openBulletins.value.push(id);
  } else {
    openBulletins.value.splice(index, 1);
  }
};

// Would integrate with a backend endpoint
const markMatch = async (bulletinId: string, replyId: string) => {
  try {
    // Since updateBulletinReply doesn't exist, we'll use updateBulletin with the reply info
    console.log(`Match confirmed for bulletin ${bulletinId} with reply ${replyId}`);
    
    // First fetch the bulletin to get the current state
    const bulletinResponse = await bulletinProxyService.getBulletinById(bulletinId);
    
    if (bulletinResponse.success && bulletinResponse.data) {
      const bulletin = bulletinResponse.data;
      
      // Find the reply and update its status
      if (bulletin.replies) {
        const updatedReplies = bulletin.replies.map(reply => {
          if (reply._id === replyId) {
            return { ...reply, matchStatus: 'approved' };
          }
          return reply;
        });
        
        // Update the bulletin with the modified replies
        await bulletinProxyService.updateBulletin(bulletinId, {
          ...bulletin,
          replies: updatedReplies
        });
      }
    }
    
    // Refresh the data
    await fetchData();
  } catch (error) {
    console.error('Error marking match:', error);
    // Would show an error notification
  }
};

// Would integrate with a backend endpoint
const declineMatch = async (bulletinId: string, replyId: string) => {
  try {
    // Since updateBulletinReply doesn't exist, we'll use updateBulletin with the reply info
    console.log(`Match declined for bulletin ${bulletinId} with reply ${replyId}`);
    
    // First fetch the bulletin to get the current state
    const bulletinResponse = await bulletinProxyService.getBulletinById(bulletinId);
    
    if (bulletinResponse.success && bulletinResponse.data) {
      const bulletin = bulletinResponse.data;
      
      // Find the reply and update its status
      if (bulletin.replies) {
        const updatedReplies = bulletin.replies.map(reply => {
          if (reply._id === replyId) {
            return { ...reply, matchStatus: 'declined' };
          }
          return reply;
        });
        
        // Update the bulletin with the modified replies
        await bulletinProxyService.updateBulletin(bulletinId, {
          ...bulletin,
          replies: updatedReplies
        });
      }
    }
    
    // Refresh the data
    await fetchData();
  } catch (error) {
    console.error('Error declining match:', error);
    // Would show an error notification
  }
};

const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Initialize
onMounted(() => {
  fetchData();
});
</script>
