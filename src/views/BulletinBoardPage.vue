<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import bulletinProxyService from '@/services/bulletinProxyService'
import ReplySection from '@/components/bulletin/ReplySection.vue'
import { Bulletin, UIBulletinReply } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

// Define interfaces for type safety
interface BulletinMessage {
  id: string;
  _id: string; // Match Bulletin's required _id
  title?: string; // Make optional to match Bulletin
  content: string;
  name: string;
  email: string;
  timestamp: Date;
  messageType: string;
  status: string;
  replies?: UIBulletinReply[];
  userType: 'anonymous' | 'registered' | string;
  createdAt: Date; // Match Bulletin's required createdAt
  updatedAt: Date; // Match Bulletin's required updatedAt
  [key: string]: any; // Allow other properties
}

// Local form interfaces
interface NewMessage {
  name: string;
  email: string;
  title: string;
  content: string;
  userType: string;
  messageType: string;
  [key: string]: string; // Add index signature for dynamic property access
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Zustandsvariablen
const messages = ref<BulletinMessage[]>([]);
const sortOrder = ref<'newest' | 'oldest'>('newest');
const currentPage = ref<number>(1);
const itemsPerPage = 6;
const isSubmitting = ref<boolean>(false);
const messageSent = ref<boolean>(false);
const showContactModal = ref<boolean>(false);
const showLoginModal = ref<boolean>(false);
const selectedMessage = ref<BulletinMessage>({} as BulletinMessage);
const isLoading = ref<boolean>(true);
const loadError = ref<string | null>(null);
const error = ref<string | null>(null);
const fieldErrors = ref<Record<string, string>>({});
const authStore = useAuthStore();
const router = useRouter();
const { showToast } = useToast();

// Helper function to convert server replies to UI replies
function convertServerReplies(bulletin: Bulletin): UIBulletinReply[] {
  if (!bulletin.replies || bulletin.replies.length === 0) {
    return [];
  }
  
  return bulletin.replies.map(reply => ({
    _id: reply._id,
    bulletinId: bulletin._id, // Add bulletinId from parent
    content: reply.content,
    name: reply.name,
    email: reply.email,
    timestamp: reply.timestamp,
    edited: reply.edited,
    userId: reply.userId,
    sessionId: reply.sessionId,
    privacyPolicyAccepted: true // Always set to true for UI consistency
  }));
}

// Ensure auth store is initialized before fetching bulletins
onMounted(async () => {
  console.log('[BulletinBoardPage] Component mounted');
  
  // Check if auth store is initialized
  if (!authStore.initialized) {
    console.log('[BulletinBoardPage] Auth store not initialized, initializing now');
    await authStore.initAuth();
  }
  
  // Log authentication status
  console.log('[BulletinBoardPage] Auth status on mount:', 
    authStore.isAuthenticated ? 'Authenticated' : 'Not authenticated');
  console.log('[BulletinBoardPage] User data:', authStore.user);
  
  // Fetch bulletins
  await fetchBulletins();
});

/**
 * Fetch bulletins from the server
 */
async function fetchBulletins(): Promise<void> {
  isLoading.value = true;
  loadError.value = null;
  
  try {
    console.log('[BulletinBoardPage] Fetching bulletins');
    console.log('[BulletinBoardPage] Auth status:', 
      authStore.isAuthenticated ? 'Authenticated' : 'Not authenticated');
    console.log('[BulletinBoardPage] Auth token exists:', !!authStore.token);
    
    // Make sure auth is initialized before proceeding
    if (!authStore.initialized) {
      console.log('[BulletinBoardPage] Auth store not initialized, initializing now');
      await authStore.initAuth();
    }
    
    let bulletinsData = [];
    const response = await bulletinProxyService.getAllBulletins({
      sort: sortOrder.value === 'newest' ? '-createdAt' : 'createdAt',
      status: 'active', // First try with active status
      messageType: 'Information'
    });
    
    bulletinsData = response?.data || [];
    console.log(`[BulletinBoardPage] Fetched ${bulletinsData.length} active bulletins:`, bulletinsData);
    
    // If no active bulletins found, try with pending status
    if (bulletinsData.length === 0) {
      console.log('[BulletinBoardPage] No active bulletins found, trying pending status');
      const pendingResponse = await bulletinProxyService.getAllBulletins({
        sort: sortOrder.value === 'newest' ? '-createdAt' : 'createdAt',
        status: 'pending',
        messageType: 'Information'
      });
      
      bulletinsData = pendingResponse?.data || [];
      console.log(`[BulletinBoardPage] Fetched ${bulletinsData.length} pending bulletins:`, bulletinsData);
    }
    
    // As fallback, try without status filter if still no bulletins found
    if (bulletinsData.length === 0) {
      console.log('[BulletinBoardPage] No bulletins found with status filters, trying without status filter');
      const allResponse = await bulletinProxyService.getAllBulletins({
        sort: sortOrder.value === 'newest' ? '-createdAt' : 'createdAt',
        messageType: 'Information'
      });
      
      bulletinsData = allResponse?.data || [];
      console.log(`[BulletinBoardPage] Fetched ${bulletinsData.length} bulletins without status filter:`, bulletinsData);
    }
    
    if (bulletinsData.length === 0) {
      console.log('[BulletinBoardPage] No bulletins found');
      messages.value = [];
      return;
    }
    
    // Process bulletins into UI format with proper type conversions
    messages.value = bulletinsData.map((item: Bulletin) => {
      // Ensure all required fields exist and handle any missing data
      const bulletin = {
        ...item,
        createdAt: item.createdAt || new Date(),
        updatedAt: item.updatedAt || new Date(),
        status: item.status || 'published',
        messageType: item.messageType || 'Information'
      };
      
      // Process server timestamp to client-side Date
      const timestamp = bulletin.createdAt instanceof Date 
        ? bulletin.createdAt 
        : new Date(bulletin.createdAt);
        
      // Convert server replies to UI-friendly format
      const uiReplies = bulletin.replies ? convertServerReplies(bulletin) : [];
      
      // Create a UI-friendly message object
      const message: BulletinMessage = {
        id: bulletin._id,
        _id: bulletin._id,
        title: bulletin.title || '',
        content: bulletin.content,
        name: bulletin.name,
        email: bulletin.email,
        status: bulletin.status,
        messageType: bulletin.messageType,
        timestamp: timestamp,
        createdAt: bulletin.createdAt,
        updatedAt: bulletin.updatedAt,
        userType: bulletin.userId ? 'registered' : 'anonymous',
        replies: uiReplies
      };
      
      return message;
    });
    
    console.log('[BulletinBoardPage] Bulletins processed successfully:', messages.value.length);
  } catch (error: any) {
    console.error('[BulletinBoardPage] Error fetching bulletins:', error);
    
    // Check for authentication errors
    if (error.response?.status === 401) {
      loadError.value = 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.';
      showToast('Authentifizierungsfehler: Sie sind nicht mehr eingeloggt', 'error');
      
      // Clear auth state and redirect to login if necessary
      if (authStore.isAuthenticated) {
        authStore.clearAuth();
        router.push('/login');
      }
    } else {
      loadError.value = 'Fehler beim Laden der Daten';
      showToast('Es ist ein Fehler beim Laden der Einträge aufgetreten', 'error');
    }
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
}

/**
 * Submit a new bulletin message
 */
async function submitMessage(): Promise<void> {
  try {
    isSubmitting.value = true;
    error.value = null;
    
    // Check authentication status
    const isLoggedIn = authStore.isAuthenticated;
    
    console.log('[BulletinBoard] Authentication check before submission:', {
      isAuthenticated: isLoggedIn,
      hasUser: !!authStore.user,
      userId: authStore.user?._id,
      token: localStorage.getItem('token') ? 'Present (truncated): ' + localStorage.getItem('token')?.substring(0, 20) + '...' : 'Not found'
    });

    if (!isLoggedIn) {
      error.value = 'Sie müssen angemeldet sein, um Einträge zu erstellen';
      showLoginModal.value = true;
      isSubmitting.value = false;
      return;
    }
    
    // Validate form
    const requiredFields = ['title', 'content'];
    let hasErrors = false;
    
    requiredFields.forEach(field => {
      if (!newMessage[field]) {
        fieldErrors.value[field] = 'Dieses Feld ist erforderlich';
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      error.value = 'Bitte füllen Sie alle erforderlichen Felder aus';
      isSubmitting.value = false;
      return;
    }
    
    console.log('[BulletinBoard] Creating bulletin with form data:', {
      title: newMessage.title,
      type: newMessage.messageType || 'Information'
    });
    
    // Attempt to create bulletin
    const { success, message } = await bulletinProxyService.createBulletin({
      title: newMessage.title,
      content: newMessage.content,
      messageType: newMessage.messageType || 'Information'
    });
    
    console.log('[BulletinBoard] Bulletin creation response:', { success, message });
    
    if (success) {
      // Reset form data
      newMessage.title = '';
      newMessage.content = '';
      newMessage.messageType = 'Information';
      
      // Update bulletin list
      await fetchBulletins();
      
      // Show success message
      messageSent.value = true;
      setTimeout(() => {
        messageSent.value = false;
      }, 3000);
    } else {
      error.value = message || 'Fehler beim Erstellen des Eintrags. Bitte versuchen Sie es später erneut.';
      
      // If authentication error, show login modal
      if (message && message.includes('anmelden')) {
        showLoginModal.value = true;
      }
    }
  } catch (err: any) {
    console.error('[BulletinBoard] Error:', err);
    error.value = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
  } finally {
    isSubmitting.value = false;
  }
}

// Formulare
const newMessage = reactive<NewMessage>({
  name: '',
  email: '',
  title: '',
  content: '',
  userType: '',
  messageType: 'Information',
})

const contactForm = reactive<ContactForm>({
  name: '',
  email: '',
  message: ''
});

// Computed Properties
const totalPages = computed(() => Math.ceil(messages.value.length / itemsPerPage));

const filteredMessages = computed(() => {
  // Apply sorting based on the selected order
  const sortedMessages = [...messages.value].sort((a, b) => {
    if (sortOrder.value === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });
  
  // Apply pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sortedMessages.slice(startIndex, endIndex);
});

// Helper function to check if the current user can edit a message
function canEditMessage(message: BulletinMessage): boolean {
  if (!authStore.isAuthenticated) return false;
  
  // Admin can edit all messages
  if (authStore.isAdmin) return true;
  
  // User can edit their own messages
  return message.userId === authStore.userId;
}

// Methoden
function sortMessages(): void {
  // Sortierung wird in der computed property angewendet
  currentPage.value = 1; // Zurück zur ersten Seite
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function prevPage(): void {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage(): void {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(page: number): void {
  currentPage.value = page;
}

function contactPoster(message: BulletinMessage): void {
  selectedMessage.value = message;
  showContactModal.value = true;
}

function closeContactModal(): void {
  showContactModal.value = false;
  // Formular zurücksetzen
  contactForm.name = '';
  contactForm.email = '';
  contactForm.message = '';
}

function sendContact(): void {
  // Hier würden wir normalerweise eine API-Anfrage senden
  console.log('Kontaktanfrage gesendet:', {
    to: selectedMessage.value.email,
    from: contactForm
  });
  
  // Schließe das Modal und zeige eine Erfolgsmeldung
  alert('Ihre Nachricht wurde gesendet!');
  closeContactModal();
}

const handleReplyAdded = (reply: UIBulletinReply): void => {
  // Find the bulletin this reply belongs to
  const bulletinIndex = messages.value.findIndex(message => message.id === reply.bulletinId);
  if (bulletinIndex !== -1) {
    console.log(`Adding reply to bulletin at index ${bulletinIndex}`);
    
    // If replies array doesn't exist, initialize it
    if (!messages.value[bulletinIndex].replies) {
      messages.value[bulletinIndex].replies = [];
    }
    
    // Add the new reply to the bulletin
    messages.value[bulletinIndex].replies?.push({
      ...reply,
      privacyPolicyAccepted: true // Ensure this is always true for UI consistency
    });
  }
}

const handleReplyUpdated = (updatedReply: UIBulletinReply): void => {
  // Find the bulletin this reply belongs to
  const bulletinIndex = messages.value.findIndex(message => message.id === updatedReply.bulletinId);
  if (bulletinIndex !== -1) {
    console.log(`Updating reply in bulletin at index ${bulletinIndex}`);
    
    // Find the reply to update
    const replies = messages.value[bulletinIndex].replies || [];
    const replyIndex = replies.findIndex(reply => reply._id === updatedReply._id);
    
    if (replyIndex !== -1) {
      // Update the reply
      messages.value[bulletinIndex].replies![replyIndex] = {
        ...updatedReply,
        privacyPolicyAccepted: true // Ensure this is always true for UI consistency
      };
    }
  }
}

const handleReplyDeleted = (replyId: string): void => {
  // Find the bulletin containing this reply
  const bulletinIndex = messages.value.findIndex(
    message => message.replies?.some(reply => reply._id === replyId)
  );
  
  if (bulletinIndex !== -1) {
    console.log(`Removing reply ${replyId} from bulletin at index ${bulletinIndex}`);
    
    // Remove the reply
    const replies = messages.value[bulletinIndex].replies || [];
    messages.value[bulletinIndex].replies = replies.filter(reply => reply._id !== replyId);
  }
}

async function deleteMessage(message: BulletinMessage): Promise<void> {
  if (!canEditMessage(message)) {
    alert('Sie sind nicht berechtigt, diese Nachricht zu löschen.');
    return;
  }

  if (!confirm('Möchten Sie diese Nachricht wirklich löschen?')) {
    return;
  }

  try {
    // Call the API to delete the message
    await bulletinProxyService.deleteBulletin(message.id);
    
    // Remove the message from the local list
    messages.value = messages.value.filter(m => m.id !== message.id);
    
    alert('Nachricht erfolgreich gelöscht!');
  } catch (err) {
    console.error('Error deleting bulletin:', err);
    alert('Fehler beim Löschen der Nachricht. Bitte versuchen Sie es später erneut.');
  }
}

function editMessage(message: BulletinMessage): void {
  if (!canEditMessage(message)) {
    alert('Sie sind nicht berechtigt, diese Nachricht zu bearbeiten.');
    return;
  }
  
  // For now, just show an alert. A proper implementation would use a modal or redirect to an edit page
  alert('Diese Funktion ist noch in Entwicklung. Sie können Ihre Nachricht später bearbeiten.');
}
</script>

<template>
  <div>
    <section class="bg-dark text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Pinnwand</h1>
        <p class="text-xl max-w-3xl">
          Hier finden Sie Informationen und Ankündigungen rund um medizinische Fortbildungen, Veranstaltungen und andere berufsrelevante Themen.
        </p>
      </div>
    </section>

    <section class="py-12 bg-light">
      <div class="container mx-auto px-4">
        <!-- Filter-Optionen -->
        <div class="max-w-7xl mx-auto mb-8">
          <div class="bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-4 items-center border border-gray-200">
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-bold text-heading mr-4">Informationen</h3>
            </div>
            
            <div class="ml-auto flex items-center">
              <label for="sortOrder" class="mr-2 text-gray-700 font-medium">Sortieren nach:</label>
              <select 
                id="sortOrder" 
                v-model="sortOrder" 
                class="px-4 py-2 border-2 border-gray-300 rounded-lg text-text-dark bg-white shadow-sm appearance-none"
                @change="sortMessages()"
              >
                <option value="newest">Neueste zuerst</option>
                <option value="oldest">Älteste zuerst</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="max-w-7xl mx-auto text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-600">Lade Informationen...</p>
        </div>
        
        <!-- Error message -->
        <div v-else-if="loadError" class="max-w-7xl mx-auto py-8">
          <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-red-700">{{ loadError }}</p>
                <button 
                  @click="fetchBulletins" 
                  class="mt-2 px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                >
                  Erneut versuchen
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Nachrichten-Grid -->
        <div v-else class="max-w-7xl mx-auto mb-16">
          <div v-if="messages.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-lg">Keine Informationen gefunden. Erstellen Sie die erste!</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="message in filteredMessages" 
              :key="message.id" 
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-strong transition-shadow duration-300 flex flex-col border border-gray-200"
            >
              <div class="h-2 w-full bg-warning"></div>
              <div class="p-6 flex-grow">
                <div class="flex justify-between items-start mb-3">
                  <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-warning bg-opacity-20 text-warning border border-warning">
                    Information
                  </span>
                  <span class="text-sm text-gray-500">{{ formatDate(message.timestamp) }}</span>
                </div>
                <h3 class="text-xl font-bold mb-2 text-heading">{{ message.title }}</h3>
                <p class="text-gray-700 mb-4">{{ message.content }}</p>
                <div class="mt-auto pt-4 border-t border-gray-200">
                  <div class="flex justify-between">
                    <div>
                      <p class="font-medium text-gray-700">{{ message.name }}</p>
                      <p class="text-sm text-gray-500">{{ message.userType }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <button 
                        @click="contactPoster(message)" 
                        class="text-white bg-primary hover:bg-primary-dark font-medium px-4 py-1 rounded-lg shadow-sm transform hover:scale-105 transition-all"
                        title="Kontakt"
                      >
                        Kontakt
                      </button>
                      <!-- Edit and delete buttons for authenticated users -->
                      <template v-if="authStore.isAuthenticated && canEditMessage(message)">
                        <button 
                          @click="editMessage(message)" 
                          class="text-white bg-orange-500 hover:bg-orange-700 font-medium px-4 py-1 rounded-lg shadow-sm transform hover:scale-105 transition-all"
                          title="Bearbeiten"
                        >
                          Bearbeiten
                        </button>
                        <button 
                          @click="deleteMessage(message)" 
                          class="text-white bg-red-500 hover:bg-red-700 font-medium px-4 py-1 rounded-lg shadow-sm transform hover:scale-105 transition-all"
                          title="Löschen"
                        >
                          Löschen
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Reply Section -->
              <ReplySection 
                :message="message"
                @reply-added="handleReplyAdded"
                @reply-deleted="handleReplyDeleted"
                @reply-updated="handleReplyUpdated"
              />
            </div>
          </div>
          
          <!-- Paginierung (bei vielen Nachrichten) -->
          <div v-if="messages.length > itemsPerPage" class="mt-8 flex justify-center">
            <nav class="inline-flex rounded-md shadow">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1" 
                class="px-4 py-2 rounded-l-md border-2 border-gray-300"
                :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
              >
                Zurück
              </button>
              <button 
                v-for="page in totalPages" 
                :key="page" 
                @click="goToPage(page)" 
                class="px-4 py-2 border-t-2 border-b-2 border-gray-300"
                :class="currentPage === page ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages" 
                class="px-4 py-2 rounded-r-md border-2 border-gray-300"
                :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
              >
                Weiter
              </button>
            </nav>
          </div>
        </div>
        
        <!-- Neue Nachricht erstellen - Bedingt nach Authentifizierungsstatus -->
        <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-strong p-6 mb-8 border border-gray-200">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center text-heading border-b-2 border-primary pb-3">Neue Nachricht anpinnen</h2>
          
          <!-- Authentifizierungsaufforderung für nicht angemeldete Benutzer -->
          <div v-if="!authStore.isAuthenticated" class="py-6">
            <div class="text-center mb-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-3">Melden Sie sich an, um einen Beitrag zu erstellen</h3>
              <p class="text-gray-600 mb-5">Um eine Nachricht zu veröffentlichen, Beiträge zu bearbeiten oder zu löschen, müssen Sie angemeldet sein.</p>
              
              <div class="flex justify-center space-x-4">
                <router-link to="/login" class="inline-block px-6 py-3 bg-primary text-primary font-bold rounded-lg broder-2 border-primary hover:bg-primary-dark transition-colors shadow-md">
                  <span class="text-lg">Anmelden</span>
                </router-link>
                <router-link to="/register" class="inline-block px-6 py-3 bg-white text-primary font-bold rounded-lg border-2 border-primary hover:bg-blue-50 transition-colors shadow-sm">
                  <span class="text-lg">Registrieren</span>
                </router-link>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-5 mt-5">
              <div class="flex items-center justify-center">
                <div class="bg-primary-100 rounded-full p-3 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-gray-600 text-sm">Die Registrierung ermöglicht es Ihnen, Ihre Beiträge später zu bearbeiten oder zu löschen.</p>
              </div>
            </div>
          </div>
          
          <!-- Vereinfachtes Formular für angemeldete Benutzer -->
          <form v-else @submit.prevent="submitMessage" class="space-y-5">
            <div>
              <label for="title" class="block text-text-dark font-semibold mb-1">Titel*</label>
              <input 
                type="text" 
                id="title" 
                v-model="newMessage.title" 
                required 
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                placeholder="Titel Ihrer Nachricht"
              />
            </div>
            
            <div>
              <label for="content" class="block text-text-dark font-semibold mb-1">Nachricht*</label>
              <textarea 
                id="content" 
                v-model="newMessage.content" 
                required 
                rows="4" 
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                placeholder="Ihre Information hier..."
              ></textarea>
            </div>
            
            <div class="text-center">
              <button 
                type="submit" 
                class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-8 rounded-lg shadow-strong transition-colors duration-300 text-lg transform hover:scale-105"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Wird gesendet...' : 'Information veröffentlichen' }}
              </button>
            </div>
          </form>
          
          <div v-if="messageSent" class="mt-6 p-4 bg-success bg-opacity-10 text-success rounded-lg border-2 border-success">
            <p class="font-semibold">Vielen Dank für Ihre Nachricht!</p>
            <p>Ihre Nachricht wurde erfolgreich veröffentlicht.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Kontakt-Modal -->
    <div v-if="showContactModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full mx-4">
        <h3 class="text-2xl font-bold mb-4 text-heading border-b-2 border-primary pb-3">Kontakt aufnehmen</h3>
        <p class="mb-6">Sie möchten Kontakt mit <strong>{{ selectedMessage.name }}</strong> aufnehmen bezüglich der Information: <strong>{{ selectedMessage.title }}</strong></p>
        
        <form @submit.prevent="sendContact" class="space-y-4">
          <div>
            <label for="contactName" class="block text-text-dark font-semibold mb-2">Ihr Name*</label>
            <input type="text" id="contactName" v-model="contactForm.name" required class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
          </div>
          
          <div>
            <label for="contactEmail" class="block text-text-dark font-semibold mb-2">Ihre E-Mail*</label>
            <input type="email" id="contactEmail" v-model="contactForm.email" required class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
          </div>
          
          <div>
            <label for="contactMessage" class="block text-text-dark font-semibold mb-2">Ihre Nachricht*</label>
            <textarea id="contactMessage" v-model="contactForm.message" required rows="4" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"></textarea>
          </div>
          
          <div class="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              @click="closeContactModal" 
              class="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-bold shadow-md transform hover:scale-105 transition-all"
            >
              Nachricht senden
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>