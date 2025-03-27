<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import { onMounted, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const { showToast } = useToast()

// Add ApiStatus tracking
const apiStatus = ref<'pending' | 'online' | 'offline'>('pending')
const apiStatusMessage = ref<string>('')

// Check if user is on a mobile device
const isMobile = ref(window.innerWidth < 768)

// Update the isMobile value when the window is resized
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})

onMounted(async () => {
  // Initialize auth state from localStorage
  authStore.initAuth()
  
  // Check API connectivity
  checkApiStatus()
})

// Function to check API connectivity
async function checkApiStatus() {
  apiStatus.value = 'pending'
  apiStatusMessage.value = 'Checking API connection...'
  
  try {
    // Try to fetch a simple resource from the API that's guaranteed to exist
    await api.get('/bulletin?limit=1')
    
    // If successful, set status to online
    apiStatus.value = 'online'
    console.log('API connection successful')
  } catch (error: any) {
    // If there's an error, check if it's a network error or a server error
    console.error('API connection error:', error)
    
    if (error.message?.includes('Network Error')) {
      apiStatus.value = 'offline'
      apiStatusMessage.value = 'API ist nicht erreichbar. Bitte überprüfen Sie Ihre Internetverbindung.'
      showToast('Verbindungsproblem: Server ist nicht erreichbar', 'error')
    } else if (error.response) {
      // If we got a response, the API is online but returned an error
      apiStatus.value = 'online'
      console.log('API returned error but is online:', error.response.status)
    } else {
      // Other errors
      apiStatus.value = 'offline'
      apiStatusMessage.value = 'Verbindungsproblem: ' + error.message
      showToast('Verbindungsproblem: ' + error.message, 'error')
    }
  }
}

// Create a computed property to determine if we should show API status warning
const showApiWarning = computed(() => {
  return apiStatus.value === 'offline'
})
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col">
    <!-- API Status Warning -->
    <div v-if="showApiWarning" class="bg-red-100 text-red-800 px-4 py-2 text-center text-sm">
      {{ apiStatusMessage }}
      <button 
        @click="checkApiStatus" 
        class="ml-2 px-2 py-1 bg-red-200 hover:bg-red-300 rounded text-xs"
      >
        Erneut versuchen
      </button>
    </div>
    
    <main class="flex-grow main-content">
      <RouterView />
    </main>
    
    <AppFooter />
    <ToastNotification />
    <CookieBanner />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
