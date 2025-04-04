<template>
  <div class="bulletin-board-manager bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Meine Beiträge auf der Pinnwand</h2>
    
    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 text-sm text-blue-700">
      <p>
        <i class="fas fa-info-circle mr-2"></i>
        Hier finden Sie Ihre Informationsbeiträge und Antworten auf der Pinnwand. Diese Beiträge dienen dem allgemeinen Informationsaustausch und sind keine Stellenangebote oder -gesuche.
      </p>
    </div>
    
    <div v-if="loading" class="flex items-center justify-center h-32">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg mb-4">
      <p>{{ error }}</p>
    </div>
    
    <!-- Bulletin Posts Section -->
    <div v-if="bulletinPosts.length > 0" class="mb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-3">Meine Pinnwand-Einträge</h3>
      
      <div class="space-y-4">
        <div v-for="bulletin in bulletinPosts" :key="bulletin._id" class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center">
                <span class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded mr-2">
                  {{ bulletin.messageType }}
                </span>
                <h3 class="font-medium text-lg">
                  {{ bulletin.title || 'Beitrag' }}
                </h3>
              </div>
              
              <p class="text-sm text-gray-500 mb-2">
                Erstellt am {{ new Date(bulletin.createdAt).toLocaleDateString('de-DE') }}
              </p>
              
              <p class="text-gray-700">{{ truncateContent(bulletin.content) }}</p>
              
              <div v-if="bulletin.replies && bulletin.replies.length > 0" class="mt-2">
                <p class="text-sm text-gray-600">{{ bulletin.replies.length }} Antwort(en)</p>
              </div>
            </div>
            
            <div class="flex space-x-2 ml-4">
              <button 
                @click="deleteBulletin(bulletin._id)" 
                class="inline-flex items-center p-1.5 border border-red-300 rounded text-sm text-red-700 bg-white hover:bg-red-50"
                :disabled="isDeleting[bulletin._id]"
                title="Löschen"
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
    
    <div v-else-if="!loading && userReplies.length === 0" class="p-4 bg-gray-50 text-gray-600 rounded-lg mb-4">
      <p>Sie haben noch keine Beiträge auf der Pinnwand erstellt.</p>
    </div>
    
    <!-- User Replies Section -->
    <div v-if="userReplies.length > 0" class="mb-4">
      <h3 class="text-lg font-medium text-gray-900 mb-3">Meine Antworten</h3>
      
      <div class="space-y-4">
        <div v-for="reply in userReplies" :key="reply._id" class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center">
                <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded mr-2">
                  Antwort
                </span>
              </div>
              
              <p class="text-sm text-gray-500 mb-2">
                Gepostet am {{ new Date(reply.timestamp).toLocaleDateString('de-DE') }}
                {{ reply.edited ? ` (bearbeitet am ${new Date(reply.edited).toLocaleDateString('de-DE')})` : '' }}
              </p>
              
              <p class="text-gray-700">{{ truncateContent(reply.content) }}</p>
              
              <p class="text-xs text-gray-500 mt-1">
                Auf Beitrag: {{ getBulletinTitle(reply.bulletinId) }}
              </p>
            </div>
            
            <div class="flex space-x-2 ml-4">
              <button 
                @click="deleteReply(reply.bulletinId, reply._id)" 
                class="inline-flex items-center p-1.5 border border-red-300 rounded text-sm text-red-700 bg-white hover:bg-red-50"
                :disabled="isDeletingReply[reply._id]"
                title="Löschen"
              >
                <svg v-if="!isDeletingReply[reply._id]" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div v-else class="animate-spin h-4 w-4 border-2 border-red-500 rounded-full border-t-transparent"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!loading && bulletinPosts.length === 0" class="p-4 bg-gray-50 text-gray-600 rounded-lg">
      <p>Sie haben noch keine Antworten auf der Pinnwand verfasst.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { 
  getUserBulletins, 
  getUserReplies, 
  deleteBulletin as deleteBulletinService, 
  deleteReply as deleteReplyService 
} from '@/services/bulletin.service';
import type { Bulletin, UIBulletinReply } from '@/types';

const authStore = useAuthStore();
const toast = useToast();

const allBulletins = ref<Bulletin[]>([]);
const userReplies = ref<UIBulletinReply[]>([]);
const loading = ref(true);
const error = ref('');
const isDeleting = ref<Record<string, boolean>>({});
const isDeletingReply = ref<Record<string, boolean>>({});

// Filter bulletins to only show information posts (not job related)
const bulletinPosts = computed(() => {
  return allBulletins.value.filter(bulletin => {
    // Only show Information posts, exclude job-related posts
    return bulletin.messageType === 'Information' || bulletin.messageType === 'information';
  });
});

// Map of bulletin IDs to titles for reference in replies
const bulletinTitlesMap = ref<Record<string, string>>({});

const loadUserContent = async () => {
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
    
    // Load bulletins
    const bulletinsResponse = await getUserBulletins({
      email: authStore.user.email
    });
    
    if (bulletinsResponse.success && Array.isArray(bulletinsResponse.data)) {
      allBulletins.value = bulletinsResponse.data;
      
      // Create a map of bulletin IDs to titles
      bulletinsResponse.data.forEach(bulletin => {
        bulletinTitlesMap.value[bulletin._id] = bulletin.title || 'Beitrag';
      });
    } else {
      console.error('Error fetching user bulletins:', bulletinsResponse);
    }
    
    // Load replies
    const repliesResponse = await getUserReplies({
      email: authStore.user.email
    });
    
    if (repliesResponse.success && Array.isArray(repliesResponse.data)) {
      userReplies.value = repliesResponse.data;
    } else {
      console.error('Error fetching user replies:', repliesResponse);
    }
  } catch (err) {
    console.error('Error in loadUserContent:', err);
    error.value = 'Fehler beim Laden der Beiträge';
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

const deleteReply = async (bulletinId: string, replyId: string) => {
  try {
    isDeletingReply.value = { ...isDeletingReply.value, [replyId]: true };
    
    const response = await deleteReplyService(bulletinId, replyId);
    
    if (response && response.success) {
      // Remove the deleted reply from the list
      userReplies.value = userReplies.value.filter(r => r._id !== replyId);
      toast.showToast('Antwort erfolgreich gelöscht', 'success');
    } else {
      console.error('Error deleting reply:', response);
      toast.showToast('Fehler beim Löschen der Antwort', 'error');
    }
  } catch (err) {
    console.error('Error in deleteReply:', err);
    toast.showToast('Fehler beim Löschen der Antwort', 'error');
  } finally {
    isDeletingReply.value = { ...isDeletingReply.value, [replyId]: false };
  }
};

const getBulletinTitle = (bulletinId: string) => {
  return bulletinTitlesMap.value[bulletinId] || 'Unbekannter Beitrag';
};

const truncateContent = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

onMounted(loadUserContent);
</script>
