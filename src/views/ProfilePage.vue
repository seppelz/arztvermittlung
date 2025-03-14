<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-lg text-gray-700">Profil wird geladen...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="rounded-md bg-red-50 p-4 mx-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            <div class="mt-2">
              <button @click="fetchUserProfile" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile content -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Benutzerprofil
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Ihre persönlichen Daten und Einstellungen
            </p>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="completeProfile" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Profil vervollständigen
            </button>
            <button 
              @click="logout" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Abmelden
            </button>
          </div>
        </div>
        
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Vollständiger Name
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ userProfile.name || 'Nicht angegeben' }}
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Typ
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ userProfile.userType || 'Nicht angegeben' }}
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                E-Mail-Adresse
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ userProfile.email }}
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Benutzername
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ userProfile.username }}
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Rolle
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{ 
                    'bg-green-100 text-green-800': userProfile.role === 'admin',
                    'bg-blue-100 text-blue-800': userProfile.role === 'user'
                  }"
                >
                  {{ userProfile.role === 'admin' ? 'Administrator' : 'Benutzer' }}
                </span>
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Profilstatus
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Basis-Profil
                </span>
                <p class="mt-1 text-sm text-gray-500">
                  Vervollständigen Sie Ihr Profil, um alle Funktionen nutzen zu können.
                </p>
              </dd>
            </div>
          </dl>
        </div>
        
        <!-- Profile completion section -->
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 class="text-md leading-6 font-medium text-gray-900 mb-4">
            Nächste Schritte
          </h4>
          
          <div class="space-y-4">
            <div class="bg-yellow-50 p-4 rounded-md flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Profil vervollständigen</h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>
                    Um alle Funktionen nutzen zu können, vervollständigen Sie bitte Ihr Profil mit weiteren Informationen.
                  </p>
                </div>
                <div class="mt-3">
                  <button 
                    @click="completeProfile" 
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Profil vervollständigen
                  </button>
                </div>
              </div>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-md flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Schwarzes Brett ansehen</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <p>
                    Sehen Sie sich aktuelle Stellenangebote und Gesuche auf unserem Schwarzen Brett an.
                  </p>
                </div>
                <div class="mt-3">
                  <router-link 
                    to="/bulletin-board" 
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Zum Schwarzen Brett
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import userService from '@/services/user.service'
import authService from '@/services/auth.service'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const userProfile = ref({})
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  await fetchUserProfile()
})

const fetchUserProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Get current user profile from store
    const currentUser = authStore.user
    
    if (!currentUser) {
      throw new Error('Kein Benutzer angemeldet')
    }
    
    // For now, we'll use the stored user data
    // Later you can implement a full user profile API endpoint
    userProfile.value = { ...currentUser }
    
  } catch (err) {
    console.error('Error fetching profile:', err)
    error.value = 'Fehler beim Laden des Profils. Bitte versuchen Sie es später erneut.'
    showToast('Fehler beim Laden des Profils', 'error')
  } finally {
    loading.value = false
  }
}

const completeProfile = () => {
  // This is a placeholder for the future complete profile feature
  showToast('Diese Funktion ist noch in Entwicklung', 'info')
  // router.push('/complete-profile')
}

const logout = async () => {
  try {
    await authService.logout()
    authStore.clearAuth()
    showToast('Erfolgreich abgemeldet', 'success')
    router.push('/login')
  } catch (err) {
    console.error('Logout error:', err)
    showToast('Fehler beim Abmelden', 'error')
  }
}
</script> 