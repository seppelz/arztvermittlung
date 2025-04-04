<template>
  <!-- Bulletins Section -->
  <section class="py-10 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold text-heading mb-8">Arztbörse</h1>
        
        <!-- Filter and Sort Controls -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div class="flex items-center space-x-4">
            <button 
              @click="filterType = 'all'" 
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filterType === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-text-dark hover:bg-gray-100'
              ]"
            >
              Alle
            </button>
            <button 
              @click="filterType = 'Angebot'" 
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filterType === 'Angebot' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-text-dark hover:bg-gray-100'
              ]"
            >
              Stellenangebote
            </button>
            <button 
              @click="filterType = 'Gesuch'" 
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filterType === 'Gesuch' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-text-dark hover:bg-gray-100'
              ]"
            >
              Stellengesuche
            </button>
          </div>
            
          <div class="flex items-center space-x-2">
            <span class="text-text-dark">Sortieren:</span>
            <select 
              v-model="sortOrder" 
              class="bg-white border border-gray-300 rounded-lg px-3 py-1 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
            </select>
          </div>
        </div>
          
        <!-- Bulletins List -->
        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
          
        <div v-else-if="filteredBulletins.length === 0" class="bg-white p-8 rounded-lg shadow-md text-center">
          <p class="text-lg text-text-dark">Keine Einträge gefunden.</p>
        </div>
          
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="bulletin in filteredBulletins" 
            :key="bulletin._id" 
            class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
          >
            <div class="flex justify-between items-start">
              <div>
                <span 
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-sm font-medium mb-2',
                    bulletin.messageType === 'Angebot' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  ]"
                >
                  {{ bulletin.messageType === 'Angebot' ? 'Stellenangebot' : 'Stellengesuch' }}
                </span>
                <h3 class="text-xl font-bold text-heading">{{ bulletin.title }}</h3>
              </div>
              <span class="text-sm text-gray-500">{{ formatDate(bulletin.createdAt) }}</span>
            </div>
              
            <p class="mt-3 text-text-dark whitespace-pre-line flex-grow">{{ bulletin.content }}</p>
              
            <div class="mt-4 grid grid-cols-1 gap-2">
              <div v-if="bulletin.specialty" class="flex items-center">
                <span class="text-primary-700 font-medium mr-2">Fachbereich:</span>
                <span>{{ bulletin.specialty }}</span>
              </div>
              <div v-if="bulletin.location" class="flex items-center">
                <span class="text-primary-700 font-medium mr-2">Ort:</span>
                <span>{{ bulletin.location }}</span>
              </div>
              <div v-if="bulletin.period" class="flex items-center">
                <span class="text-primary-700 font-medium mr-2">Zeitraum:</span>
                <span>{{ bulletin.period }}</span>
              </div>
              <div v-if="bulletin.federalState" class="flex items-center">
                <span class="text-primary-700 font-medium mr-2">Bundesland:</span>
                <span>{{ bulletin.federalState }}</span>
              </div>
            </div>
              
            <div class="mt-6 flex justify-between items-center">
              <div class="flex items-center">
                <span class="font-medium text-text-dark">
                  {{ bulletin.messageType === 'Angebot' ? 'Medizinische Einrichtung' : bulletin.name }}
                </span>
              </div>
              <button 
                @click="openContactModal(bulletin)" 
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Kontakt aufnehmen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Neue Nachricht erstellen -->
  <section v-if="isAuthenticated" class="py-10 bg-white">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-heading">Stellenbörse</h2>
          <button 
            @click="isFormOpen = !isFormOpen" 
            class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg"
          >
            {{ isFormOpen ? 'Formular schließen' : 'Neue Stellenanzeige erstellen' }}
          </button>
        </div>

        <div v-if="isFormOpen" class="bg-white p-6 rounded-lg shadow-md mt-4 mb-6">
          <h3 class="text-xl font-bold text-primary-700 mb-4">
            {{ isUserHospital ? 'Neues Stellenangebot erstellen' : 'Neue Verfügbarkeit melden' }}
          </h3>
            
          <form @submit.prevent="createMessage" class="space-y-4">
            <!-- Hidden field for message type, automatically set based on user type -->
            <input type="hidden" v-model="newMessageForm.messageType">
            
            <!-- Fields for hospitals only -->
            <template v-if="isUserHospital">
              <div>
                <label for="title" class="block text-text-dark font-semibold mb-1">Titel*</label>
                <input 
                  type="text" 
                  id="title" 
                  v-model="newMessageForm.title" 
                  required 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="Titel Ihrer Stellenanzeige"
                />
              </div>
                
              <div>
                <label for="federalState" class="block text-text-dark font-semibold mb-1">Bundesland*</label>
                <select
                  id="federalState"
                  v-model="newMessageForm.federalState"
                  required
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
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
                
              <div>
                <label for="content" class="block text-text-dark font-semibold mb-1">Zusätzliche Informationen</label>
                <textarea 
                  id="content" 
                  v-model="newMessageForm.content" 
                  rows="4" 
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="Weitere Details zur Stelle (optional)"
                ></textarea>
              </div>
                
              <div>
                <label for="specialty" class="block text-text-dark font-semibold mb-1">Fachbereich*</label>
                <input 
                  type="text" 
                  id="specialty" 
                  v-model="newMessageForm.specialty"
                  required  
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  placeholder="z.B. Innere Medizin, Chirurgie, etc."
                />
              </div>
            </template>
            
            <!-- Common field for both user types -->
            <div v-if="!isUserHospital">
              <label for="startDate" class="block text-text-dark font-semibold mb-1">Verfügbar ab*</label>
              <input 
                type="date" 
                id="startDate" 
                v-model="newMessageForm.startDate"
                required
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
              />
              <p class="text-sm text-gray-500 mt-1">Wählen Sie das Datum, ab dem Sie verfügbar sind. Wir vermitteln nur Vertretungen bis maximal 3 Monate.</p>
            </div>

            <div v-if="isUserHospital">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="startDate" class="block text-text-dark font-semibold mb-1">Startdatum*</label>
                  <input 
                    type="date" 
                    id="startDate" 
                    v-model="newMessageForm.startDate"
                    required
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  />
                </div>
                
                <div>
                  <label for="period" class="block text-text-dark font-semibold mb-1">Zeitraum (Beschreibung)</label>
                  <input 
                    type="text" 
                    id="period" 
                    v-model="newMessageForm.period"
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                    placeholder="z.B. 2 Wochen, 1 Monat, max. 3 Monate"
                  />
                  <p class="text-sm text-gray-500 mt-1">Wir vermitteln nur Vertretungen bis maximal 3 Monate.</p>
                </div>
              </div>
            </div>
            
            <div v-if="newMessageForm.error" class="p-3 bg-red-100 text-red-700 rounded-lg">
              {{ newMessageForm.error }}
            </div>
                
            <div v-if="newMessageForm.success" class="p-3 bg-green-100 text-green-700 rounded-lg">
              {{ isUserHospital ? 'Ihr Stellenangebot wurde erfolgreich veröffentlicht.' : 'Ihre Verfügbarkeit wurde erfolgreich veröffentlicht.' }}
            </div>
                
            <div class="text-center">
              <button 
                type="submit" 
                class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-8 rounded-lg shadow-strong transition-colors duration-300 text-lg transform hover:scale-105"
                :disabled="newMessageForm.isSubmitting"
              >
                {{ newMessageForm.isSubmitting ? 'Wird gesendet...' : (isUserHospital ? 'Stellenangebot veröffentlichen' : 'Verfügbarkeit veröffentlichen') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
    
  <!-- Login-Hinweis für nicht angemeldete Benutzer -->
  <section v-else class="py-10 bg-white">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-heading mb-4">Möchten Sie eine Anzeige erstellen?</h2>
        <p class="text-lg mb-6">Bitte melden Sie sich an, um Ihre eigene Anzeige zu veröffentlichen.</p>
        <router-link to="/login" class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-8 rounded-lg shadow-strong transition-colors duration-300 text-lg transform hover:scale-105">
          Zum Login
        </router-link>
      </div>
    </div>
  </section>

  <!-- Kontakt-Modal -->
  <div v-if="showContactModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full mx-4">
      <h3 class="text-2xl font-bold mb-4 text-heading border-b-2 border-primary pb-3">Kontakt aufnehmen</h3>
      <p class="mb-6">
        Sie möchten Kontakt mit <strong>{{ selectedMessage?.name }}</strong> aufnehmen bezüglich: 
        <strong>{{ selectedMessage?.title || 'Stellenanzeige' }}</strong>
      </p>
        
      <form @submit.prevent="sendContactForm" class="space-y-4">
        <div>
          <label for="contactName" class="block text-text-dark font-semibold mb-2">Ihr Name*</label>
          <input 
            type="text" 
            id="contactName" 
            v-model="contactForm.name" 
            required 
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
          />
        </div>
          
        <div>
          <label for="contactEmail" class="block text-text-dark font-semibold mb-2">Ihre E-Mail*</label>
          <input 
            type="email" 
            id="contactEmail" 
            v-model="contactForm.email" 
            required 
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
          />
        </div>
          
        <div>
          <label for="contactMessage" class="block text-text-dark font-semibold mb-2">Ihre Nachricht*</label>
          <textarea 
            id="contactMessage" 
            v-model="contactForm.message" 
            required 
            rows="4" 
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
          ></textarea>
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
            :disabled="contactForm.isSubmitting"
          >
            {{ contactForm.isSubmitting ? 'Wird gesendet...' : 'Nachricht senden' }}
          </button>
        </div>
          
        <div v-if="contactForm.error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {{ contactForm.error }}
        </div>
          
        <div v-if="contactForm.success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
          Ihre Nachricht wurde erfolgreich gesendet. Der Inserent wird sich in Kürze bei Ihnen melden.
        </div>
      </form>
    </div>
  </div>

  <!-- Login-Modal (wenn nicht angemeldet) -->
  <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-strong max-w-md w-full p-6">
      <h3 class="text-xl font-bold text-primary-700 mb-4">Anmeldung erforderlich</h3>
      <p class="mb-6">Um eine neue Anzeige zu erstellen, müssen Sie angemeldet sein.</p>
      <div class="flex justify-end space-x-4">
        <button @click="showLoginModal = false" class="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
          Abbrechen
        </button>
        <router-link to="/login" class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg">
          Zur Anmeldung
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import bulletinProxyService from '@/services/bulletinProxyService';

const authStore = useAuthStore();

// Computed property to check if user is authenticated
const isAuthenticated = computed(() => {
  console.log('[ArztboersePage] Authentication check:', {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    role: authStore.user?.role,
    userType: authStore.user?.userType
  });
  return authStore.isAuthenticated;
});

// Computed property to determine if the user is a hospital or a doctor
const isUserHospital = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) return null;
  console.log('[ArztboersePage] User type check:', {
    role: authStore.user.role,
    userType: authStore.user.userType,
    isHospital: authStore.user.role === 'hospital' || authStore.user.userType === 'Klinik',
    isDoctor: authStore.user.role === 'doctor' || authStore.user.userType === 'Arzt'
  });
  return authStore.user.role === 'hospital' || authStore.user.userType === 'Klinik';
});

// State for bulletins
const bulletins = ref<any[]>([]);
const isLoading = ref(true);
const filterType = ref('all');
const sortOrder = ref('newest');

// State for new message form
const isFormOpen = ref(true); // Set to true by default for logged-in users
const newMessageForm = ref({
  title: '',
  content: '',
  messageType: 'Angebot',
  specialty: '',
  location: '',
  period: '',
  startDate: new Date().toISOString().split('T')[0], // Initialize with today's date
  federalState: '',
  contactEmail: '',
  isSubmitting: false,
  error: null,
  success: false
});

// State for contact modal
const showContactModal = ref(false);
const selectedMessage = ref<any>(null);
const contactForm = ref({
  name: '',
  email: '',
  message: '',
  isSubmitting: false,
  error: null,
  success: false
});

// State for login modal
const showLoginModal = ref(false);

// Filtered bulletins based on selected filter
const filteredBulletins = computed(() => {
  // First filter out "Information" type messages - only show Angebot and Gesuch
  const jobBulletins = bulletins.value.filter(bulletin => 
    bulletin.messageType === 'Angebot' || bulletin.messageType === 'Gesuch'
  );
  
  // Then apply the type filter if not "all"
  if (filterType.value === 'all') {
    return jobBulletins;
  }
  return jobBulletins.filter(bulletin => bulletin.messageType === filterType.value);
});

// Fetch bulletins on component mount
onMounted(async () => {
  console.log('[ArztboersePage] Component mounted, auth state:', {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    isUserHospital: isUserHospital.value
  });
  
  await fetchBulletins();
  
  // Set message type based on user type
  if (isUserHospital.value !== null) {
    newMessageForm.value.messageType = isUserHospital.value ? 'Angebot' : 'Gesuch';
    console.log('[ArztboersePage] Setting message type based on user type:', newMessageForm.value.messageType);
  }
});

// Watch for changes in sort order and refetch bulletins
watch(sortOrder, async () => {
  await fetchBulletins();
});

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Fetch bulletins from API
const fetchBulletins = async () => {
  isLoading.value = true;
  try {
    const response = await bulletinProxyService.getAllBulletins({
      sort: sortOrder.value === 'newest' ? '-createdAt' : 'createdAt',
      status: 'active'
    });
    bulletins.value = response.data;
  } catch (error) {
    console.error('Error fetching bulletins:', error);
  } finally {
    isLoading.value = false;
  }
};

// Reset form fields
const resetNewMessageForm = () => {
  // Set message type based on user type
  if (isUserHospital.value !== null) {
    newMessageForm.value.messageType = isUserHospital.value ? 'Angebot' : 'Gesuch';
  } else {
    newMessageForm.value.messageType = 'Angebot';
  }
  
  newMessageForm.value.title = '';
  newMessageForm.value.content = '';
  newMessageForm.value.specialty = '';
  newMessageForm.value.location = '';
  newMessageForm.value.period = '';
  newMessageForm.value.startDate = new Date().toISOString().split('T')[0]; // Reset to today's date
  newMessageForm.value.federalState = '';
  newMessageForm.value.contactEmail = '';
  newMessageForm.value.error = null;
  newMessageForm.value.success = false;
  
  // Don't close form after submission for logged-in users
  // setTimeout(() => {
  //   isFormOpen.value = false;
  // }, 2000);
};

// Create a new message
const createMessage = async () => {
  if (!isAuthenticated.value) {
    showLoginModal.value = true;
    return;
  }
  
  newMessageForm.value.isSubmitting = true;
  newMessageForm.value.error = null;
  
  try {
    // For doctors, auto-generate title and content based on their profile
    let bulletinData: any = {
      messageType: newMessageForm.value.messageType,
      period: newMessageForm.value.period || `ab ${newMessageForm.value.startDate}`,
      email: authStore.user?.email || '',
      name: authStore.user?.firstName || 'Anonym',
      privacyPolicyAccepted: true,
      startDate: newMessageForm.value.startDate // Use the date picker value directly
    };
    
    if (isUserHospital.value) {
      // Format the content in the standardized format for hospitals
      const formattedDate = new Date(newMessageForm.value.startDate).toLocaleDateString('de-DE');
      const standardContent = `Eine Einrichtung in ${newMessageForm.value.federalState} sucht ab ${formattedDate} einen Vertretungsarzt für ${newMessageForm.value.period || 'einen kurzen Zeitraum'}.`;
      
      // Add any additional content if provided
      const fullContent = newMessageForm.value.content 
        ? `${standardContent}\n\n${newMessageForm.value.content}` 
        : standardContent;
      
      // For hospitals, use the form fields with standardized content
      bulletinData = {
        ...bulletinData,
        title: newMessageForm.value.title,
        content: fullContent,
        specialty: newMessageForm.value.specialty,
        federalState: newMessageForm.value.federalState
      };
    } else {
      // For doctors, generate title and content based on their profile
      const specialty = authStore.user?.specialty || 'Arzt';
      const formattedDate = new Date(newMessageForm.value.startDate).toLocaleDateString('de-DE');
      bulletinData.title = `${specialty} verfügbar ab ${formattedDate}`;
      bulletinData.content = `Ich bin als ${specialty} verfügbar ab ${formattedDate}.`;
      bulletinData.specialty = authStore.user?.specialty || '';
    }
    
    console.log('Submitting bulletin data:', bulletinData);
    await bulletinProxyService.createBulletin(bulletinData);
    
    newMessageForm.value.success = true;
    resetNewMessageForm();
    await fetchBulletins();
  } catch (error: any) {
    console.error('Error creating bulletin:', error);
    if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors).join(', ');
      newMessageForm.value.error = errorMessages || error.response?.data?.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    } else {
      newMessageForm.value.error = error.response?.data?.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    }
  } finally {
    newMessageForm.value.isSubmitting = false;
  }
};

// Open contact modal
const openContactModal = (message: any) => {
  if (!isAuthenticated.value) {
    showLoginModal.value = true;
    return;
  }
  
  selectedMessage.value = message;
  showContactModal.value = true;
  
  // Pre-fill contact form with user data if available
  if (authStore.user) {
    contactForm.value.name = `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`.trim();
    contactForm.value.email = authStore.user.email || '';
  }
};

// Close contact modal
const closeContactModal = () => {
  showContactModal.value = false;
  contactForm.value = {
    name: '',
    email: '',
    message: '',
    isSubmitting: false,
    error: null,
    success: false
  };
};

// Send contact form
const sendContactForm = async () => {
  contactForm.value.isSubmitting = true;
  contactForm.value.error = null;
  
  try {
    await bulletinProxyService.contactBulletinAuthor(selectedMessage.value._id, {
      name: contactForm.value.name,
      email: contactForm.value.email,
      message: contactForm.value.message
    });
    
    contactForm.value.success = true;
    
    // Close modal after a delay
    setTimeout(() => {
      closeContactModal();
    }, 3000);
  } catch (error: any) {
    console.error('Error sending contact form:', error);
    contactForm.value.error = error.response?.data?.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
  } finally {
    contactForm.value.isSubmitting = false;
  }
};
</script>