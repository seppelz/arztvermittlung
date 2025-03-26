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
            <p class="text-gray-600">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ user?.role === 'doctor' ? 'Ärzte' : user?.role === 'hospital' ? 'Kliniken / Einrichtungen' : user?.role }}
              </span>
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="(user?.role === 'hospital' && !isHospitalProfileComplete) || (user?.role === 'doctor' && !isDoctorProfileComplete)"
              @click="showProfileForm = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Profil vervollständigen
            </button>
            <button
              v-if="(user?.role === 'hospital' && isHospitalProfileComplete) || (user?.role === 'doctor' && isDoctorProfileComplete)"
              @click="showDeleteConfirm = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Profil löschen
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

      <!-- Hospital Profile Content -->
      <div v-if="user?.role === 'hospital' && hospitalProfile" class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Klinik-Informationen</h2>
          <button 
            @click="showProfileForm = true"
            class="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Bearbeiten
          </button>
        </div>
        
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

      <!-- Doctor Profile Content -->
      <div v-if="user?.role === 'doctor' && doctorProfile" class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Arzt-Informationen</h2>
          <button 
            @click="showProfileForm = true"
            class="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Bearbeiten
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500">Name</h3>
            <p class="mt-1 text-sm text-gray-900">{{ doctorProfile.name }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Fachrichtung</h3>
            <p class="mt-1 text-sm text-gray-900">{{ doctorProfile.specialty }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Kontakt</h3>
            <p class="mt-1 text-sm text-gray-900">
              {{ doctorProfile.contact.email }}<br>
              {{ doctorProfile.contact.phone }}
            </p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Verfügbar ab</h3>
            <p class="mt-1 text-sm text-gray-900">{{ formatDate(doctorProfile.availability.availableFrom) }}</p>
          </div>
          
          <div v-if="doctorProfile.availability.federalState" class="md:col-span-1">
            <h3 class="text-sm font-medium text-gray-500">Bevorzugtes Bundesland</h3>
            <p class="mt-1 text-sm text-gray-900">{{ doctorProfile.availability.federalState }}</p>
          </div>
          
          <div v-if="doctorProfile.qualifications?.length" class="md:col-span-2">
            <h3 class="text-sm font-medium text-gray-500">Qualifikationen</h3>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="qualification in doctorProfile.qualifications"
                :key="qualification"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ formatQualification(qualification) }}
              </span>
            </div>
            <p v-if="doctorProfile.otherQualifications" class="mt-1 text-sm text-gray-900">
              {{ doctorProfile.otherQualifications }}
            </p>
          </div>
          
          <div v-if="doctorProfile.additionalInfo" class="md:col-span-2">
            <h3 class="text-sm font-medium text-gray-500">Weitere Informationen</h3>
            <p class="mt-1 text-sm text-gray-900">{{ doctorProfile.additionalInfo }}</p>
          </div>
        </div>
      </div>

      <!-- Bulletin Entries -->
      <div class="mt-8">
        <BulletinEntries />
      </div>
      
      <!-- Profile Completion Form -->
      <HospitalProfileForm
        v-if="showProfileForm && user?.role === 'hospital'"
        @close="showProfileForm = false"
        @profile-updated="handleProfileUpdate"
      />
      
      <DoctorProfileForm
        v-if="showProfileForm && user?.role === 'doctor'"
        @close="showProfileForm = false"
        @profile-updated="handleDoctorProfileUpdate"
      />
      
      <!-- Delete Profile Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Profil löschen</h3>
          <p class="text-gray-700 mb-6">Sind Sie sicher, dass Sie Ihr Profil löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteConfirm = false"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Abbrechen
            </button>
            <button
              @click="deleteProfile"
              :disabled="isDeleting"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {{ isDeleting ? 'Wird gelöscht...' : 'Löschen' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import HospitalProfileForm from '@/components/profile/HospitalProfileForm.vue'
import DoctorProfileForm from '@/components/profile/DoctorProfileForm.vue'
import BulletinEntries from '@/components/profile/BulletinEntries.vue'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const isLoading = ref(true)
const isDeleting = ref(false)
const error = ref(null)
const user = ref(null)
const hospitalProfile = ref(null)
const doctorProfile = ref(null)
const showProfileForm = ref(false)
const showDeleteConfirm = ref(false)

// Computed property to determine if hospital profile is complete
const isHospitalProfileComplete = computed(() => {
  return !!hospitalProfile.value && Object.keys(hospitalProfile.value).length > 0
})

// Computed property to determine if doctor profile is complete
const isDoctorProfileComplete = computed(() => {
  return !!doctorProfile.value && Object.keys(doctorProfile.value).length > 0
})

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

// Format qualification for display
const formatQualification = (qualification) => {
  const qualifications = {
    facharzt: 'Facharzt',
    oberarzt: 'Oberarzt',
    chefarzt: 'Chefarzt',
    assistenzarzt: 'Assistenzarzt',
    promotion: 'Promotion',
    habilitation: 'Habilitation'
  }
  return qualifications[qualification] || qualification
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'Nicht angegeben'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Load user profile
const loadProfile = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Get user from auth store
    user.value = authStore.user
    
    // If user is not available in the store, try to initialize auth from localStorage
    if (!user.value) {
      console.log('User not found in store, reinitializing auth state')
      authStore.initAuth()
      user.value = authStore.user
    }
    
    // If still no user, redirect to login
    if (!user.value) {
      console.error('No user found after auth state initialization')
      error.value = 'Kein Benutzer angemeldet'
      router.push('/login')
      return
    }
    
    console.log('User profile loaded:', user.value)
    
    // Check if user is a hospital (either by role or userType)
    const isHospital = user.value.role === 'hospital' || (user.value.role === 'user' && user.value.userType === 'Klinik')
    
    // Check if user is a doctor (either by role or userType)
    const isDoctor = user.value.role === 'doctor' || (user.value.role === 'user' && user.value.userType === 'Arzt')
    
    // If user is a hospital, load hospital profile
    if (isHospital) {
      try {
        const response = await api.get('/hospital/profile')
        console.log('Hospital profile response:', response)
        hospitalProfile.value = response.data
      } catch (profileErr) {
        console.error('Error loading hospital profile:', profileErr)
        if (profileErr.response && profileErr.response.status === 404) {
          // Profile doesn't exist yet, which is fine - we'll show the "complete profile" button
          console.log('Hospital profile not found - new user needs to complete profile')
          hospitalProfile.value = null
        } else {
          console.error('Failed to load hospital profile:', profileErr.message)
          // We still don't set error.value here as we want to show the profile page
          // with the "complete profile" button for new users
        }
      }
    }
    
    // If user is a doctor, load doctor profile
    if (isDoctor) {
      try {
        const response = await api.get('/doctor/profile')
        console.log('Doctor profile response:', response)
        doctorProfile.value = response.data
      } catch (profileErr) {
        console.error('Error loading doctor profile:', profileErr)
        if (profileErr.response && profileErr.response.status === 404) {
          // Profile doesn't exist yet, which is fine - we'll show the "complete profile" button
          console.log('Doctor profile not found - new user needs to complete profile')
          doctorProfile.value = null
        } else {
          console.error('Failed to load doctor profile:', profileErr.message)
          // We still don't set error.value here as we want to show the profile page
          // with the "complete profile" button for new users
        }
      }
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Handle hospital profile update
const handleProfileUpdate = (updatedProfile) => {
  hospitalProfile.value = updatedProfile
  showProfileForm.value = false
}

// Handle doctor profile update
const handleDoctorProfileUpdate = (updatedProfile) => {
  doctorProfile.value = updatedProfile
  showProfileForm.value = false
}

// Delete profile
const deleteProfile = async () => {
  isDeleting.value = true
  
  try {
    let url = ''
    // Check if user is a hospital (either by role or userType)
    const isHospital = user.value.role === 'hospital' || (user.value.role === 'user' && user.value.userType === 'Klinik')
    
    // Check if user is a doctor (either by role or userType)
    const isDoctor = user.value.role === 'doctor' || (user.value.role === 'user' && user.value.userType === 'Arzt')
    
    if (isHospital) {
      url = '/hospital/profile'
    } else if (isDoctor) {
      url = '/doctor/profile'
    } else {
      throw new Error('Ungültiger Benutzertyp')
    }
    
    const response = await api.delete(url)
    
    showToast('Profil erfolgreich gelöscht', 'success')
    showDeleteConfirm.value = false
    
    // Reset profile data
    if (isHospital) {
      hospitalProfile.value = null
    } else if (isDoctor) {
      doctorProfile.value = null
    }
  } catch (err) {
    console.error('Error deleting profile:', err)
    showToast(err.message || 'Ein Fehler ist aufgetreten', 'error')
  } finally {
    isDeleting.value = false
  }
}

// Logout function
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Load profile on mount
onMounted(loadProfile)
</script> 