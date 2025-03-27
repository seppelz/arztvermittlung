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
                {{ isDoctor ? 'Ärzte' : isHospital ? 'Kliniken / Einrichtungen' : user?.role }}
              </span>
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="(isHospital && !isHospitalProfileComplete) || (isDoctor && !isDoctorProfileComplete)"
              @click="showProfileForm = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Profil vervollständigen
            </button>
            <button
              v-if="(isHospital && isHospitalProfileComplete) || (isDoctor && isDoctorProfileComplete)"
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
      <div v-if="isHospital && hospitalProfile" class="bg-white shadow rounded-lg p-6 mb-6">
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
      <div v-if="isDoctor && doctorProfile" class="bg-white shadow rounded-lg p-6 mb-6">
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

      <!-- Profile Completion Form -->
      <HospitalProfileForm
        v-if="showProfileForm && isHospital"
        @close="showProfileForm = false"
        @profile-updated="handleProfileUpdate"
      />
      
      <DoctorProfileForm
        v-if="showProfileForm && isDoctor"
        @close="showProfileForm = false"
        @profile-updated="handleDoctorProfileUpdate"
      />

      <!-- Bulletin Entries -->
      <div class="mt-8">
        <BulletinEntries />
      </div>

      <!-- Account Deletion Section -->
      <div class="mt-12 border-t border-gray-200 pt-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-red-800 mb-2">Konto löschen</h2>
          <p class="text-red-700 mb-4">
            Wenn Sie Ihr Konto löschen, werden alle Ihre Daten, einschließlich Ihres Profils, Ihrer Einträge und Ihrer Einstellungen, unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <button
            @click="showDeleteConfirm = true"
            class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Konto löschen
          </button>
        </div>
      </div>
      
      <!-- Delete Account Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-red-800 mb-4">Konto löschen</h3>
          <p class="text-gray-700 mb-4">
            Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion:
          </p>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Löscht Ihr gesamtes Konto unwiderruflich</li>
            <li>Entfernt alle Ihre Profilinformationen</li>
            <li>Löscht alle Ihre Einträge in der Stellenbörse</li>
            <li>Kann nicht rückgängig gemacht werden</li>
          </ul>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteConfirm = false"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Abbrechen
            </button>
            <button
              @click="deleteAccount"
              :disabled="isDeleting"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isDeleting ? 'Wird gelöscht...' : 'Konto löschen' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import HospitalProfileForm from '@/components/profile/HospitalProfileForm.vue'
import DoctorProfileForm from '@/components/profile/DoctorProfileForm.vue'
import BulletinEntries from '@/components/profile/BulletinEntries.vue'
import api from '@/services/api'

// Define interfaces
interface User {
  _id?: string;
  name: string;
  email: string;
  role?: string;
  userType?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface Address {
  street: string;
  city: string;
  postalCode: string;
}

interface Contact {
  phone: string;
}

interface HospitalProfile {
  _id?: string;
  userId?: string;
  name: string;
  type: string;
  address: Address;
  contact: Contact;
  specialties: string[];
  description?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface DoctorProfile {
  _id?: string;
  userId?: string;
  name: string;
  specialty: string;
  qualifications: string[];
  otherQualifications?: string;
  contact: {
    email: string;
    phone?: string;
  };
  availability: {
    availableFrom: string;
    federalState?: string;
  };
  additionalInfo?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const isLoading = ref<boolean>(true)
const isDeleting = ref<boolean>(false)
const error = ref<string | null>(null)
const user = ref<User | null>(null)
const hospitalProfile = ref<HospitalProfile | null>(null)
const doctorProfile = ref<DoctorProfile | null>(null)
const showProfileForm = ref<boolean>(false)
const showDeleteConfirm = ref<boolean>(false)

// Computed property to determine if hospital profile is complete
const isHospitalProfileComplete = computed<boolean>(() => {
  return !!hospitalProfile.value && Object.keys(hospitalProfile.value).length > 0
})

// Computed property to determine if doctor profile is complete
const isDoctorProfileComplete = computed<boolean>(() => {
  return !!doctorProfile.value && Object.keys(doctorProfile.value).length > 0
})

// Computed property to determine if user is a doctor
const isDoctor = computed<boolean>(() => {
  return !!user.value && (user.value.role === 'doctor' || (user.value.role === 'user' && user.value.userType === 'Arzt'))
})

// Computed property to determine if user is a hospital
const isHospital = computed<boolean>(() => {
  return !!user.value && (user.value.role === 'hospital' || (user.value.role === 'user' && user.value.userType === 'Klinik'))
})

// Format hospital type for display
const formatType = (type: string): string => {
  const types: Record<string, string> = {
    krankenhaus: 'Krankenhaus',
    klinik: 'Klinik',
    reha: 'Rehabilitationsklinik',
    praxis: 'Arztpraxis'
  }
  return types[type] || type
}

// Format specialty for display
const formatSpecialty = (specialty: string): string => {
  const specialties: Record<string, string> = {
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
const formatQualification = (qualification: string): string => {
  const qualifications: Record<string, string> = {
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
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Nicht angegeben'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Load user profile
const loadProfile = async (): Promise<void> => {
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
    const isHospitalUser = user.value.role === 'hospital' || (user.value.role === 'user' && user.value.userType === 'Klinik')
    
    // Check if user is a doctor (either by role or userType)
    const isDoctorUser = user.value.role === 'doctor' || (user.value.role === 'user' && user.value.userType === 'Arzt')
    
    // If user is a hospital, load hospital profile
    if (isHospitalUser) {
      try {
        const response = await api.get('/hospital/profile')
        console.log('Hospital profile response:', response)
        hospitalProfile.value = response.data
      } catch (profileErr: any) {
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
    if (isDoctorUser) {
      try {
        const response = await api.get('/doctor/profile')
        console.log('Doctor profile response:', response)
        doctorProfile.value = response.data
      } catch (profileErr: any) {
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
  } catch (err: any) {
    console.error('Error loading profile:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Handle hospital profile update
const handleProfileUpdate = (updatedProfile: HospitalProfile): void => {
  hospitalProfile.value = updatedProfile
  showProfileForm.value = false
}

// Handle doctor profile update
const handleDoctorProfileUpdate = (updatedProfile: DoctorProfile): void => {
  doctorProfile.value = updatedProfile
  showProfileForm.value = false
}

// Delete profile
const deleteProfile = async (): Promise<void> => {
  isDeleting.value = true
  
  try {
    let url = ''
    // Check if user is a hospital (either by role or userType)
    const isHospitalUser = user.value?.role === 'hospital' || (user.value?.role === 'user' && user.value?.userType === 'Klinik')
    // Check if user is a doctor (either by role or userType)
    const isDoctorUser = user.value?.role === 'doctor' || (user.value?.role === 'user' && user.value?.userType === 'Arzt')
    
    if (isHospitalUser) {
      url = '/hospital/profile'
    } else if (isDoctorUser) {
      url = '/doctor/profile'
    } else {
      throw new Error('Unbekannter Benutzertyp')
    }
    
    await api.delete(url)
    
    // Reset profiles
    if (isHospitalUser) {
      hospitalProfile.value = null
    } else if (isDoctorUser) {
      doctorProfile.value = null
    }
    
    showDeleteConfirm.value = false
    showToast('Profil erfolgreich gelöscht', 'success')
  } catch (err: any) {
    console.error('Error deleting profile:', err)
    showToast(`Fehler beim Löschen des Profils: ${err.message}`, 'error')
  } finally {
    isDeleting.value = false
  }
}

// Close the profile form
const closeProfileForm = (): void => {
  showProfileForm.value = false
}

// Logout user
const logout = (): void => {
  authStore.clearAuth()
  router.push('/login')
}

// Delete account
const deleteAccount = async (): Promise<void> => {
  try {
    isDeleting.value = true
    await api.delete('/user/account')
    showToast('Ihr Konto wurde erfolgreich gelöscht', 'success')
    await logout()
  } catch (error) {
    console.error('Error deleting account:', error)
    showToast('Fehler beim Löschen des Kontos', 'error')
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
  }
}

// Load profile when component is mounted
onMounted(() => {
  loadProfile()
})
</script> 