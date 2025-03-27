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
        
        <!-- Nachrichten-Grid -->
        <div class="max-w-7xl mx-auto mb-16">
          <div v-if="filteredMessages.length === 0" class="text-center py-8">
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
                        title="Kontakt aufnehmen"
                      >
                        Kontakt
                      </button>
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
        
        <!-- Neue Nachricht erstellen - Breiteres, kompakteres Formular -->
        <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-strong p-6 mb-8 border border-gray-200">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center text-heading border-b-2 border-primary pb-3">Neue Nachricht anpinnen</h2>
          
          <form @submit.prevent="submitMessage" class="space-y-5">
            <!-- Zwei-Spalten-Layout für kompakteren Look -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label for="name" class="block text-text-dark font-semibold mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="newMessage.name" 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="Ihr Name oder Einrichtung"
                />
              </div>
              
              <div>
                <label for="email" class="block text-text-dark font-semibold mb-1">E-Mail*</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="newMessage.email" 
                  required 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="ihre-email@beispiel.de"
                />
              </div>
              
              <div>
                <label for="phone" class="block text-text-dark font-semibold mb-1">Telefonnummer</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="newMessage.phone" 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="Ihre Telefonnummer"
                />
              </div>
            </div>
            
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
              <label for="specialty" class="block text-text-dark font-semibold mb-1">Fachrichtung</label>
              <input 
                type="text" 
                id="specialty" 
                v-model="newMessage.specialty" 
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                placeholder="Ihre Fachrichtung (optional)"
              />
            </div>
            
            <div>
              <label for="userType" class="block text-text-dark font-semibold mb-1">Sie sind*</label>
              <select 
                id="userType" 
                v-model="newMessage.userType" 
                required 
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm appearance-none"
              >
                <option value="">Bitte wählen</option>
                <option value="Arzt">Arzt</option>
                <option value="Klinik">Klinik/Einrichtung</option>
              </select>
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
            
            <div class="flex items-start">
              <input type="checkbox" id="privacyPolicy" v-model="newMessage.privacyPolicyAccepted" required class="mt-1 mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" />
              <label for="privacyPolicy" class="text-sm text-gray-700">
                Ich habe die <router-link to="/privacy" class="text-primary hover:underline font-medium">Datenschutzerklärung</router-link> gelesen und akzeptiere diese.*
              </label>
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

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import bulletinProxyService from '@/services/bulletinProxyService'
import ReplySection from '@/components/bulletin/ReplySection.vue'
import { Bulletin } from '@/types'

// Define interfaces for type safety
interface BulletinMessage extends Omit<Bulletin, 'replies'> {
  id: string;
  timestamp: string | Date;
  userType: string;
  replies?: UIBulletinReply[];
  [key: string]: any; // Allow other properties
}

// UI-specific bulletin reply that includes bulletinId
interface UIBulletinReply {
  _id: string;
  bulletinId: string;
  content: string;
  name: string;
  timestamp: Date;
  email: string;
  privacyPolicyAccepted: boolean;
  userId?: string;
  sessionId?: string;
}

interface NewMessage {
  name: string;
  email: string;
  phone: string;
  title: string;
  specialty: string;
  content: string;
  userType: string;
  privacyPolicyAccepted: boolean;
  messageType: string;
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
const selectedMessage = ref<BulletinMessage>({} as BulletinMessage);
const isLoading = ref<boolean>(true);
const loadError = ref<string | null>(null);

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
    timestamp: reply.timestamp instanceof Date ? reply.timestamp : new Date(reply.timestamp),
    privacyPolicyAccepted: reply.privacyPolicyAccepted,
    userId: reply.userId,
    sessionId: reply.sessionId
  }));
}

// Fetch actual bulletin board entries using the proxy service that now only uses real data
const fetchBulletins = async (): Promise<void> => {
  isLoading.value = true;
  loadError.value = null;
  
  try {
    console.log('Fetching bulletins via proxy service');
    
    const response = await bulletinProxyService.getAllBulletins({
      messageType: 'Information',
      sort: '-timestamp'
    });
    
    if (response && response.data) {
      // Process real API data
      messages.value = response.data.map((item: Bulletin) => {
        // Convert replies for UI usage
        const uiReplies = convertServerReplies(item);
        
        return {
          ...item,
          id: item._id, // Add id field based on _id
          userType: item.userId ? 'registered' : 'anonymous', // Derive userType
          timestamp: item.createdAt || new Date(), // Use createdAt as timestamp
          replies: uiReplies
        };
      });
      
      console.log('Loaded bulletins from database:', messages.value.length);
    } else {
      // API returned no data
      messages.value = [];
      loadError.value = 'Keine Einträge gefunden.';
    }
  } catch (err: unknown) {
    console.error('Error fetching bulletins:', err);
    const error = err as Error;
    loadError.value = 'Fehler beim Laden der Daten: ' + (error.message || 'Unbekannter Fehler');
    messages.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Formulare
const newMessage = reactive<NewMessage>({
  name: '',
  email: '',
  phone: '',
  title: '',
  specialty: '',
  content: '',
  userType: '',
  privacyPolicyAccepted: false,
  messageType: 'Information',
})

const contactForm = reactive<ContactForm>({
  name: '',
  email: '',
  message: ''
});

// Berechnete Eigenschaften
const filteredMessages = computed<BulletinMessage[]>(() => {
  let result = [...messages.value];
  
  // Only show Information messages
  result = result.filter(msg => msg.messageType === 'Information');
  
  // Sortieren
  result.sort((a, b) => {
    if (sortOrder.value === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });
  
  // Paginierung
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return result.slice(startIndex, endIndex);
});

const totalPages = computed<number>(() => {
  let filteredTotal = messages.value.filter(msg => msg.messageType === 'Information');
  return Math.ceil(filteredTotal.length / itemsPerPage);
});

// Methoden
async function submitMessage(): Promise<void> {
  isSubmitting.value = true;
  
  // Always set messageType to Information
  newMessage.messageType = 'Information';
  
  try {
    console.log('Submitting bulletin via proxy service');
    
    // Prepare the bulletin data with properties matching the Bulletin interface
    const bulletinData: Partial<Bulletin> = {
      name: newMessage.name,
      email: newMessage.email,
      title: newMessage.title,
      specialty: newMessage.specialty,
      content: newMessage.content,
      messageType: newMessage.messageType,
      privacyPolicyAccepted: newMessage.privacyPolicyAccepted,
      // Set status to 'active' instead of 'pending' to comply with backend validation
      status: 'active',
    };
    
    // Send the request through our proxy service for better error handling
    const response = await bulletinProxyService.createBulletin(bulletinData);
    
    if (response && response.data) {
      // If successful, add the new message to our local list
      const newEntry = response.data;
      
      // Convert and add the new entry to our messages list
      const formattedEntry: BulletinMessage = {
        ...newEntry,
        id: newEntry._id,
        userType: newEntry.userId ? 'registered' : 'anonymous',
        timestamp: newEntry.createdAt || new Date(),
        replies: convertServerReplies(newEntry)
      };
      
      messages.value.unshift(formattedEntry);
      
      // Formular zurücksetzen
      Object.keys(newMessage).forEach(key => {
        if (key === 'privacyPolicyAccepted') {
          newMessage.privacyPolicyAccepted = false;
        } else if (key === 'messageType') {
          newMessage.messageType = 'Information';
        } else {
          (newMessage as any)[key] = '';
        }
      });
      
      messageSent.value = true;
      
      // Show warning if using demo data
      if ((response as any).isDemoData) {
        alert('Ihre Nachricht wurde gespeichert, aber der Server konnte nicht erreicht werden. Die Nachricht wird lokal angezeigt, aber nicht dauerhaft gespeichert. Bitte versuchen Sie es später erneut.');
      }
      
      // Erfolgsmeldung nach 3 Sekunden ausblenden
      setTimeout(() => {
        messageSent.value = false;
      }, 3000);
    }
  } catch (err: unknown) {
    console.error('Error submitting bulletin:', err);
    const error = err as Error;
    alert('Fehler beim Speichern: ' + (error.message || 'Unbekannter Fehler'));
  } finally {
    isSubmitting.value = false;
  }
}

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
  // Find the message and add the reply to its replies array
  const message = messages.value.find(m => m.id === reply.bulletinId)
  if (message) {
    if (!message.replies) {
      message.replies = []
    }
    message.replies.push(reply)
  }
}

const handleReplyDeleted = (replyId: string): void => {
  // Find the message and remove the reply from its replies array
  messages.value.forEach(message => {
    if (message.replies) {
      message.replies = message.replies.filter(reply => reply._id !== replyId)
    }
  })
}

const handleReplyUpdated = (updatedReply: UIBulletinReply): void => {
  // Find the message and update the reply in its replies array
  messages.value.forEach(message => {
    if (message.replies) {
      message.replies = message.replies.map(reply => 
        reply._id === updatedReply._id ? updatedReply : reply
      )
    }
  })
}

// Load bulletins when component mounts
onMounted(() => {
  fetchBulletins();
});
</script> 