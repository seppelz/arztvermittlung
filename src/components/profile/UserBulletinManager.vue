<template>
  <div class="user-bulletin-manager bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Meine Beiträge</h2>
    
    <div v-if="loading" class="flex items-center justify-center h-32">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg mb-4">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="userBulletins.length === 0" class="p-4 bg-gray-50 text-gray-600 rounded-lg mb-4">
      <p>Sie haben noch keine Beiträge erstellt.</p>
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="bulletin in userBulletins" :key="bulletin._id" class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-medium text-lg">
              {{ bulletin.title || (bulletin.messageType === 'Verfügbarkeit' ? 'Verfügbarkeit' : 'Beitrag') }}
            </h3>
            <p class="text-sm text-gray-500 mb-2">
              {{ new Date(bulletin.createdAt).toLocaleDateString('de-DE') }} | 
              <span :class="{
                'text-green-600': bulletin.messageType === 'Verfügbarkeit',
                'text-blue-600': bulletin.messageType === 'Angebot',
                'text-purple-600': bulletin.messageType === 'Information'
              }">
                {{ bulletin.messageType }}
              </span>
            </p>
            
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-if="bulletin.specialty" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ bulletin.specialty }}
              </span>
              <span v-if="bulletin.federalState" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {{ bulletin.federalState }}
              </span>
              <span v-if="bulletin.period" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {{ bulletin.period }}
              </span>
            </div>
            
            <p class="text-gray-700">{{ truncateContent(bulletin.content) }}</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="deleteBulletinHandler(bulletin._id)" 
              class="inline-flex items-center p-1.5 border border-red-300 rounded text-sm text-red-700 bg-white hover:bg-red-50"
              :disabled="isDeleting[bulletin._id]"
            >
              <svg v-if="!isDeleting[bulletin._id]" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { getUserBulletins, deleteBulletin } from '@/services/bulletin.service';
import type { Bulletin } from '@/types';

const authStore = useAuthStore();
const toast = useToast();

const userBulletins = ref<Bulletin[]>([]);
const loading = ref(true);
const error = ref('');
const isDeleting = ref<Record<string, boolean>>({});

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
      userBulletins.value = response.data;
    } else {
      console.error('Error fetching user bulletins:', response);
      error.value = 'Fehler beim Laden der Beiträge';
    }
  } catch (err) {
    console.error('Error in loadUserBulletins:', err);
    error.value = 'Fehler beim Laden der Beiträge';
  } finally {
    loading.value = false;
  }
};

const deleteBulletinHandler = async (bulletinId: string) => {
  try {
    isDeleting.value = { ...isDeleting.value, [bulletinId]: true };
    
    const response = await deleteBulletin(bulletinId);
    
    if (response.success) {
      // Remove the deleted bulletin from the list
      userBulletins.value = userBulletins.value.filter(b => b._id !== bulletinId);
      toast.showToast('Beitrag erfolgreich gelöscht', 'success');
    } else {
      console.error('Error deleting bulletin:', response);
      toast.showToast('Fehler beim Löschen des Beitrags', 'error');
    }
  } catch (err) {
    console.error('Error in deleteBulletin:', err);
    toast.showToast('Fehler beim Löschen des Beitrags', 'error');
  } finally {
    isDeleting.value = { ...isDeleting.value, [bulletinId]: false };
  }
};

const truncateContent = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

onMounted(loadUserBulletins);
</script>
