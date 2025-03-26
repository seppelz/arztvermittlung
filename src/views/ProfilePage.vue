<template>
  <div class="profile-page container mx-auto px-4 py-8">
    <div v-if="isLoading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- Profile Header -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Profil</h1>
            <p class="text-gray-600">{{ user?.email }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="user?.role === 'hospital' && !isProfileComplete"
              @click="showProfileForm = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Profil vervollständigen
            </button>
            <button
              @click="logout"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-if="user?.role === 'hospital' && hospitalProfile" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Klinik-Informationen</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500">Name der Klinik</h3>
            <p class="mt-1 text-sm text-gray-900">{{ hospitalProfile.name }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Art der Einrichtung</h3>
            <p class="mt-1 text-sm text-gray-900">{{ formatType(hospitalProfile.type) }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Adresse</h3>
            <p class="mt-1 text-sm text-gray-900">
              {{ hospitalProfile.address.street }}<br>
              {{ hospitalProfile.address.postalCode }} {{ hospitalProfile.address.city }}
            </p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Telefon</h3>
            <p class="mt-1 text-sm text-gray-900">{{ hospitalProfile.contact.phone }}</p>
          </div>
          
          <div v-if="hospitalProfile.specialties?.length" class="md:col-span-2">
            <h3 class="text-sm font-medium text-gray-500">Fachrichtungen</h3>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="specialty in hospitalProfile.specialties"
                :key="specialty"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ formatSpecialty(specialty) }}
              </span>
            </div>
          </div>
          
          <div v-if="hospitalProfile.description" class="md:col-span-2">
            <h3 class="text-sm font-medium text-gray-500">Beschreibung</h3>
            <p class="mt-1 text-sm text-gray-900">{{ hospitalProfile.description }}</p>
          </div>
          
          <div v-if="hospitalProfile.website" class="md:col-span-2">
            <h3 class="text-sm font-medium text-gray-500">Website</h3>
            <a
              :href="hospitalProfile.website"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1 text-sm text-blue-600 hover:text-blue-800"
            >
              {{ hospitalProfile.website }}
            </a>
          </div>
        </div>
      </div>

      <!-- Profile Completion Form -->
      <HospitalProfileForm
        v-if="showProfileForm"
        @close="showProfileForm = false"
        @profile-updated="handleProfileUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HospitalProfileForm from '@/components/profile/HospitalProfileForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(true)
const error = ref(null)
const user = ref(null)
const hospitalProfile = ref(null)
const showProfileForm = ref(false)

// Format hospital type for display
const formatType = (type) => {
  const types = {
    krankenhaus: 'Krankenhaus',
    klinik: 'Klinik',
    reha: 'Rehabilitationsklinik',
    praxis: 'Arztpraxis'
  }
  return types[type] || type
}

// Format specialty for display
const formatSpecialty = (specialty) => {
  const specialties = {
    allgemeinmedizin: 'Allgemeinmedizin',
    innere: 'Innere Medizin',
    chirurgie: 'Chirurgie',
    gynakologie: 'Gynäkologie',
    kinderheilkunde: 'Kinderheilkunde',
    neurologie: 'Neurologie',
    psychiatrie: 'Psychiatrie',
    radiologie: 'Radiologie',
    anasthesie: 'Anästhesie'
  }
  return specialties[specialty] || specialty
}

// Load user profile
const loadProfile = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Get user from auth store
    user.value = authStore.user
    
    if (!user.value) {
      throw new Error('Kein Benutzer angemeldet')
    }
    
    // If user is a hospital, load hospital profile
    if (user.value.role === 'hospital') {
      const response = await fetch('/api/hospital/profile', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Fehler beim Laden des Profils')
      }
      
      hospitalProfile.value = await response.json()
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Handle profile update
const handleProfileUpdate = (updatedProfile) => {
  hospitalProfile.value = updatedProfile
  showProfileForm.value = false
}

// Logout function
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Load profile on mount
onMounted(loadProfile)
</script> 