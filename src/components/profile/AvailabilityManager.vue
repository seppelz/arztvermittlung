<template>
  <div class="availability-manager bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">{{ isHospital ? 'Stellenangebote verwalten' : 'Verfügbarkeiten verwalten' }}</h2>
    
    <!-- Specific Availabilities (Stellenbörse) -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-700">{{ isHospital ? 'Meine Stellenangebote' : 'Meine Einträge in der Stellenbörse' }}</h3>
        <button
          @click="showNewAvailabilityForm = !showNewAvailabilityForm"
          class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg class="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ showNewAvailabilityForm ? 'Abbrechen' : (isHospital ? 'Neues Stellenangebot erstellen' : 'Neue Verfügbarkeit melden') }}
        </button>
      </div>
      
      <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              {{ isHospital 
                ? 'Hier können Sie Ihre Stellenangebote in der Stellenbörse verwalten. Diese Angebote sind für alle Ärzte sichtbar.' 
                : 'Hier können Sie Ihre Einträge in der Stellenbörse verwalten. Diese Einträge sind für alle Kliniken sichtbar.' 
              }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- New Availability Form -->
      <div v-if="showNewAvailabilityForm" class="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 class="text-md font-medium text-gray-700 mb-3">{{ isHospital ? 'Neues Stellenangebot erstellen' : 'Neue Verfügbarkeit erstellen' }}</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700">{{ isHospital ? 'Stelle verfügbar ab' : 'Verfügbar ab' }}</label>
            <input
              id="startDate"
              v-model="newAvailability.startDate"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="period" class="block text-sm font-medium text-gray-700">Zeitraum</label>
            <select
              id="period"
              v-model="newAvailability.period"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Bitte wählen</option>
              <option value="kurzfristig">Kurzfristig</option>
              <option value="1-2 Wochen">1-2 Wochen</option>
              <option value="2-4 Wochen">2-4 Wochen</option>
              <option value="1-3 Monate">1-3 Monate</option>
              <option value="3-6 Monate">3-6 Monate</option>
              <option value="6-12 Monate">6-12 Monate</option>
              <option value="langfristig">Langfristig</option>
            </select>
          </div>
          
          <div>
            <label for="availabilityFederalState" class="block text-sm font-medium text-gray-700">Bundesland</label>
            <select
              id="availabilityFederalState"
              v-model="newAvailability.federalState"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Bitte wählen</option>
              <option v-for="state in federalStates" :key="state" :value="state">{{ state }}</option>
            </select>
          </div>
          
          <div>
            <label for="specialty" class="block text-sm font-medium text-gray-700">Fachrichtung</label>
            <input
              id="specialty"
              v-model="newAvailability.specialty"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
        </div>
        
        <!-- Title field for hospitals -->
        <div v-if="isHospital" class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Titel des Stellenangebots</label>
          <input
            id="title"
            v-model="newAvailability.title"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="z.B. Facharzt für Innere Medizin gesucht"
          >
        </div>
        
        <div class="mb-4">
          <label for="content" class="block text-sm font-medium text-gray-700">{{ isHospital ? 'Beschreibung der Stelle' : 'Zusätzliche Informationen' }}</label>
          <textarea
            id="content"
            v-model="newAvailability.content"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            :placeholder="isHospital ? 'Beschreiben Sie die Stelle, Anforderungen, etc...' : 'Weitere Details zu Ihrer Verfügbarkeit...'"
          ></textarea>
        </div>
        
        <div class="flex justify-end">
          <button
            @click="createAvailability"
            :disabled="isCreatingAvailability"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <svg v-if="isCreatingAvailability" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isCreatingAvailability ? 'Wird erstellt...' : (isHospital ? 'Stellenangebot erstellen' : 'Verfügbarkeit erstellen') }}</span>
          </button>
        </div>
      </div>
      
      <!-- Existing Availabilities List -->
      <div v-if="isLoadingAvailabilities" class="flex justify-center py-6">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="availabilities.length === 0" class="bg-gray-50 p-6 rounded-lg text-center">
        <p class="text-gray-500">{{ isHospital ? 'Sie haben noch keine Stellenangebote erstellt.' : 'Sie haben noch keine Einträge in der Stellenbörse.' }}</p>
        <button
          @click="showNewAvailabilityForm = true"
          class="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg class="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ isHospital ? 'Erstes Stellenangebot erstellen' : 'Ersten Eintrag erstellen' }}
        </button>
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="(availability, index) in availabilities" :key="index" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start">
            <div>
              <span 
                :class="[
                  'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2',
                  availability.messageType === 'Angebot' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ availability.messageType === 'Angebot' ? 'Stellenangebot' : 'Stellengesuch' }}
              </span>
              <h4 class="text-lg font-medium text-gray-800">{{ availability.title }}</h4>
              <p class="text-sm text-gray-500 mb-2">Erstellt am {{ formatDate(availability.createdAt) }}</p>
            </div>
            
            <div class="flex space-x-2">
              <button
                @click="deleteAvailability(availability._id)"
                :disabled="isDeletingAvailability === availability._id"
                class="inline-flex items-center p-1.5 border border-red-300 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                title="Löschen"
              >
                <svg v-if="isDeletingAvailability === availability._id" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <p class="text-gray-700 whitespace-pre-line">{{ availability.content }}</p>
          
          <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div v-if="getBulletinMetadata(availability, 'specialty')">
              <span class="text-gray-600 font-medium mr-2">Fachbereich:</span>
              <span>{{ getBulletinMetadata(availability, 'specialty') }}</span>
            </div>
            
            <div v-if="getBulletinMetadata(availability, 'federalState')">
              <span class="text-gray-600 font-medium mr-2">Bundesland:</span>
              <span>{{ getBulletinMetadata(availability, 'federalState') }}</span>
            </div>
            
            <div v-if="getBulletinMetadata(availability, 'period')">
              <span class="text-gray-600 font-medium mr-2">Zeitraum:</span>
              <span>{{ getBulletinMetadata(availability, 'period') }}</span>
            </div>
            
            <div v-if="availability.startDate">
              <span class="text-gray-600 font-medium mr-2">Verfügbar ab:</span>
              <span>{{ formatDate(availability.startDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/stores/auth';
import bulletinProxyService from '@/services/bulletinProxyService';
import { Bulletin } from '@/types';

const toast = useToast();
const authStore = useAuthStore();

// Define interfaces
interface NewAvailabilityForm {
  startDate: string;
  period: string;
  federalState: string;
  specialty: string;
  content: string;
  title?: string;  // For hospital job postings
}

// Extended Bulletin type for our custom fields
interface ExtendedBulletin extends Bulletin {
  specialty?: string;
  federalState?: string;
  period?: string;
}

// State
const availabilities = ref<ExtendedBulletin[]>([]);
const isLoadingAvailabilities = ref<boolean>(true);
const isCreatingAvailability = ref<boolean>(false);
const isDeletingAvailability = ref<string | null>(null);
const showNewAvailabilityForm = ref<boolean>(false);

const newAvailability = ref<NewAvailabilityForm>({
  startDate: '',
  period: '',
  federalState: '',
  specialty: '',
  content: '',
  title: ''
});

// Federal states list
const federalStates = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen'
];

// Computed properties
const doctorSpecialty = computed(() => {
  return authStore.user?.specialty || '';
});

const isHospital = computed(() => {
  return authStore.isHospital;
});

// Methods
const loadAvailabilities = async () => {
  try {
    isLoadingAvailabilities.value = true;
    console.log('AvailabilityManager: Starting to load availabilities');
    
    // Get user bulletins using bulletinProxyService
    const response = await bulletinProxyService.getUserBulletins();
    console.log('AvailabilityManager: Got response from getUserBulletins', response);
    
    if (response && response.data) {
      // Include all user bulletins, both offers and requests
      availabilities.value = response.data;
      console.log('AvailabilityManager: Loaded availabilities', availabilities.value.length);
    }
  } catch (error) {
    console.error('Error loading availabilities:', error);
    // Log more detailed error information
    if (error && typeof error === 'object') {
      console.error('AvailabilityManager: Detailed error info:', {
        name: (error as any).name,
        message: (error as any).message,
        response: (error as any).response,
        stack: (error as any).stack
      });
    }
    
    // Don't show error toast for 404 as this might be expected
    const errorResponse = error as { response?: { status?: number } };
    if (errorResponse.response && errorResponse.response.status !== 404) {
      toast.showToast('Fehler beim Laden Ihrer Einträge', 'error');
    }
  } finally {
    isLoadingAvailabilities.value = false;
  }
};

// Helper function to extract metadata from bulletin content or title
const getBulletinMetadata = (bulletin: Bulletin, field: string): string => {
  // Try to get from custom properties if they exist (backward compatibility)
  const extendedBulletin = bulletin as any;
  if (extendedBulletin[field]) {
    return extendedBulletin[field];
  }
  
  // Try to extract from content
  const content = bulletin.content || '';
  const title = bulletin.title || '';
  
  if (field === 'specialty') {
    // Try to extract from title first (e.g., "Kardiologe verfügbar ab...")
    const titleMatch = title.match(/^([^v]+)verfügbar/i);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }
    
    // Try to extract from content
    const specialtyMatch = content.match(/als\s+([^,\.]+)/i);
    return specialtyMatch ? specialtyMatch[1].trim() : '';
  }
  
  if (field === 'federalState') {
    const stateMatch = content.match(/in\s+([^,\.]+)/i);
    return stateMatch ? stateMatch[1].trim() : '';
  }
  
  if (field === 'period') {
    const periodMatch = content.match(/für\s+([^,\.]+)/i);
    if (periodMatch) return periodMatch[1].trim();
    
    // Check if content mentions "ab" with a date
    const abMatch = content.match(/ab\s+([^,\.]+)/i);
    return abMatch ? abMatch[1].trim() : '';
  }
  
  return '';
};

const createAvailability = async () => {
  try {
    isCreatingAvailability.value = true;
    
    // Validate form
    if (!newAvailability.value.startDate || !newAvailability.value.federalState) {
      toast.showToast('Bitte füllen Sie alle Pflichtfelder aus', 'error');
      return;
    }
    
    if (isHospital.value && !newAvailability.value.title) {
      toast.showToast('Bitte geben Sie einen Titel für das Stellenangebot ein', 'error');
      return;
    }
    
    // Format date for display
    const formattedDate = new Date(newAvailability.value.startDate).toLocaleDateString('de-DE');
    
    let bulletinData: any;
    
    if (isHospital.value) {
      // For hospitals - create a job offer
      bulletinData = {
        messageType: 'Angebot', // This is a hospital job offer
        title: newAvailability.value.title,
        content: `Eine Einrichtung in ${newAvailability.value.federalState} sucht ab ${formattedDate} einen ${newAvailability.value.specialty || 'Arzt'} für ${newAvailability.value.period || 'einen kurzen Zeitraum'}.\n\n${newAvailability.value.content || ''}`,
        startDate: new Date(newAvailability.value.startDate),
        email: authStore.user?.email || '',
        name: authStore.user?.name || 'Anonym',
        status: 'active',
        privacyPolicyAccepted: true,
        specialty: newAvailability.value.specialty || '',
        federalState: newAvailability.value.federalState,
        period: newAvailability.value.period || `ab ${formattedDate}`
      };
    } else {
      // For doctors - create an availability announcement
      const specialty = newAvailability.value.specialty || doctorSpecialty.value || 'Arzt';
      bulletinData = {
        messageType: 'Gesuch', // This is a doctor availability announcement
        title: `${specialty} verfügbar ab ${formattedDate}`,
        content: `Ich bin als ${specialty} verfügbar ab ${formattedDate} in ${newAvailability.value.federalState}.${newAvailability.value.period ? ` Verfügbar für ${newAvailability.value.period}.` : ''}${newAvailability.value.content ? `\n\n${newAvailability.value.content}` : ''}`,
        startDate: new Date(newAvailability.value.startDate),
        email: authStore.user?.email || '',
        name: authStore.user?.name || 'Anonym',
        status: 'active',
        privacyPolicyAccepted: true
      };
    }
    
    // Create bulletin using bulletinProxyService
    await bulletinProxyService.createBulletin(bulletinData);
    
    toast.showToast(isHospital.value ? 'Stellenangebot erfolgreich erstellt' : 'Verfügbarkeit erfolgreich erstellt', 'success');
    
    // Reset form and reload availabilities
    resetNewAvailabilityForm();
    showNewAvailabilityForm.value = false;
    await loadAvailabilities();
  } catch (error) {
    console.error('Error creating availability:', error);
    toast.showToast(isHospital.value ? 'Fehler beim Erstellen des Stellenangebots' : 'Fehler beim Erstellen der Verfügbarkeit', 'error');
  } finally {
    isCreatingAvailability.value = false;
  }
};

const deleteAvailability = async (id: string) => {
  try {
    isDeletingAvailability.value = id;
    
    // Delete bulletin using bulletinProxyService
    await bulletinProxyService.deleteBulletin(id);
    
    toast.showToast('Eintrag erfolgreich gelöscht', 'success');
    
    // Reload availabilities
    await loadAvailabilities();
  } catch (error) {
    console.error('Error deleting availability:', error);
    toast.showToast('Fehler beim Löschen des Eintrags', 'error');
  } finally {
    isDeletingAvailability.value = null;
  }
};

const resetNewAvailabilityForm = () => {
  // Get profile availability date from doctor profile form if available
  const doctorForm = document.querySelector('#availableFrom') as HTMLInputElement;
  const startDate = doctorForm?.value || new Date().toISOString().split('T')[0];
  
  newAvailability.value = {
    startDate,
    period: '',
    federalState: '',
    specialty: doctorSpecialty.value || '',
    content: '',
    title: ''
  };
};

const formatDate = (dateString: string | Date) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Initialize
onMounted(async () => {
  resetNewAvailabilityForm();
  await loadAvailabilities();
});
</script>
