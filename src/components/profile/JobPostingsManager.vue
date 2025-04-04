<template>
  <div class="job-postings-manager bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ isDoctor ? 'Meine Stellengesuche' : 'Meine Stellenangebote' }}</h2>
    
    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 text-sm text-blue-700">
      <p>
        <i class="fas fa-info-circle mr-2"></i>
        {{ isDoctor 
          ? 'Hier können Sie Ihre Stellengesuche verwalten. Diese Einträge sind für alle Kliniken sichtbar und zeigen Ihre Verfügbarkeit an.'
          : 'Hier können Sie Ihre Stellenangebote verwalten. Diese Angebote sind für alle Ärzte sichtbar.' 
        }}
      </p>
    </div>
    
    <div v-if="loading" class="flex items-center justify-center h-32">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg mb-4">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="jobPostings.length === 0" class="p-4 bg-gray-50 text-gray-600 rounded-lg mb-4">
      <p>Sie haben noch keine Einträge in der Stellenbörse erstellt.</p>
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="posting in jobPostings" :key="posting._id" class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
        <div class="flex justify-between items-start">
          <div class="flex-grow">
            <div class="flex items-center">
              <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mr-2">
                {{ isDoctor ? 'Stellengesuch' : 'Stellenangebot' }}
              </span>
              <h3 class="font-medium text-lg">
                {{ posting.title || getDefaultTitle(posting) }}
              </h3>
            </div>
            
            <p class="text-sm text-gray-500 mb-2">
              Erstellt am {{ new Date(posting.createdAt).toLocaleDateString('de-DE') }}
            </p>
            
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-if="posting.specialty" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Fachbereich: {{ posting.specialty }}
              </span>
              <span v-if="posting.federalState" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Bundesland: {{ posting.federalState }}
              </span>
              <span v-if="posting.period" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Zeitraum: {{ posting.period }}
              </span>
            </div>
            
            <p class="text-gray-700">{{ truncateContent(posting.content) }}</p>
          </div>
          
          <div class="flex space-x-2 ml-4">
            <button 
              @click="deleteBulletin(posting._id)" 
              class="inline-flex items-center p-1.5 border border-red-300 rounded text-sm text-red-700 bg-white hover:bg-red-50"
              :disabled="isDeleting[posting._id]"
              title="Löschen"
            >
              <svg v-if="!isDeleting[posting._id]" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <div v-else class="animate-spin h-4 w-4 border-2 border-red-500 rounded-full border-t-transparent"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { getUserBulletins, deleteBulletin as deleteBulletinService } from '@/services/bulletin.service';
import type { Bulletin } from '@/types';

const authStore = useAuthStore();
const toast = useToast();

const allBulletins = ref<Bulletin[]>([]);
const loading = ref(true);
const error = ref('');
const isDeleting = ref<Record<string, boolean>>({});

// Determine if the user is a doctor or hospital
const isDoctor = computed(() => authStore.isDoctor);
const isHospital = computed(() => authStore.isHospital);

// Filter bulletins to only show job postings based on user type
const jobPostings = computed(() => {
  return allBulletins.value.filter(bulletin => {
    // For doctors, show Gesuch or Verfügbarkeit posts (availability/job seeking)
    if (isDoctor.value) {
      return bulletin.messageType === 'Gesuch' || bulletin.messageType === 'Verfügbarkeit';
    }
    // For hospitals, show Angebot posts (job offers)
    else if (isHospital.value) {
      return bulletin.messageType === 'Angebot';
    }
    return false;
  });
});

const loadUserBulletins = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    if (!authStore.isAuthenticated) {
      await authStore.initAuth();
    }
    
    if (!authStore.user?.email) {
      error.value = 'Benutzer nicht angemeldet';
      return;
    }
    
    const response = await getUserBulletins({
      email: authStore.user.email
    });
    
    if (response.success && Array.isArray(response.data)) {
      allBulletins.value = response.data;
    } else {
      console.error('Error fetching user bulletins:', response);
      error.value = 'Fehler beim Laden der Einträge';
    }
  } catch (err) {
    console.error('Error in loadUserBulletins:', err);
    error.value = 'Fehler beim Laden der Einträge';
  } finally {
    loading.value = false;
  }
};

const deleteBulletin = async (bulletinId: string) => {
  try {
    isDeleting.value = { ...isDeleting.value, [bulletinId]: true };
    
    const response = await deleteBulletinService(bulletinId);
    
    if (response && response.success) {
      // Remove the deleted bulletin from the list
      allBulletins.value = allBulletins.value.filter(b => b._id !== bulletinId);
      toast.showToast('Eintrag erfolgreich gelöscht', 'success');
    } else {
      console.error('Error deleting bulletin:', response);
      toast.showToast('Fehler beim Löschen des Eintrags', 'error');
    }
  } catch (err) {
    console.error('Error in deleteBulletin:', err);
    toast.showToast('Fehler beim Löschen des Eintrags', 'error');
  } finally {
    isDeleting.value = { ...isDeleting.value, [bulletinId]: false };
  }
};

const truncateContent = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

const getDefaultTitle = (bulletin: Bulletin) => {
  if (bulletin.messageType === 'Verfügbarkeit') {
    return `Arzt verfügbar ${bulletin.startDate ? `ab ${new Date(bulletin.startDate).toLocaleDateString('de-DE')}` : ''}`;
  } else if (bulletin.messageType === 'Angebot') {
    return 'Stellenangebot';
  }
  return 'Eintrag';
};

onMounted(loadUserBulletins);
</script>
