<template>
  <div class="doctor-profile-form bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Profil vervollständigen</h2>
    
    <form @submit.prevent="submitProfile" class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Grundlegende Informationen</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="specialty" class="block text-sm font-medium text-gray-700">Fachrichtung</label>
            <input
              id="specialty"
              v-model="formData.specialty"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.specialty }"
            >
            <p v-if="errors.specialty" class="mt-1 text-sm text-red-600">{{ errors.specialty }}</p>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Kontaktinformationen</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">E-Mail</label>
            <input
              id="email"
              v-model="formData.contact.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Telefon</label>
            <input
              id="phone"
              v-model="formData.contact.phone"
              type="tel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>

      <!-- Qualifications -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Qualifikationen</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="qualification in qualificationsList" :key="qualification.id" class="flex items-center">
            <input
              :id="qualification.id"
              v-model="formData.qualifications"
              type="checkbox"
              :value="qualification.id"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label :for="qualification.id" class="ml-2 block text-sm text-gray-700">
              {{ qualification.name }}
            </label>
          </div>
        </div>
        
        <div>
          <label for="otherQualifications" class="block text-sm font-medium text-gray-700">Weitere Qualifikationen</label>
          <input
            id="otherQualifications"
            v-model="formData.otherQualifications"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>
      </div>

      <!-- Availability -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Verfügbarkeit</h3>
        
        <div>
          <label for="availableFrom" class="block text-sm font-medium text-gray-700">Verfügbar ab</label>
          <input
            id="availableFrom"
            v-model="formData.availability.availableFrom"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.availability.availableFrom }"
          >
          <p v-if="errors.availability.availableFrom" class="mt-1 text-sm text-red-600">
            {{ errors.availability.availableFrom }}
          </p>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Zusätzliche Informationen</h3>
        
        <div>
          <label for="additionalInfo" class="block text-sm font-medium text-gray-700">Weitere Informationen</label>
          <textarea
            id="additionalInfo"
            v-model="formData.additionalInfo"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Wird gespeichert...' : 'Profil speichern' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAnalytics } from '@/composables/useAnalytics'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

// Define types for the form data
interface ContactInfo {
  email: string;
  phone: string;
}

interface Availability {
  availableFrom: string;
}

interface Qualification {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  specialty: string;
  qualifications: string[];
  otherQualifications: string;
  contact: ContactInfo;
  availability: Availability;
  additionalInfo: string;
}

interface FormErrors {
  name: string;
  specialty: string;
  contact: {
    email: string;
    phone: string;
  };
  availability: {
    availableFrom: string;
  };
}

const { showToast } = useToast()
const { trackForm } = useAnalytics()
const authStore = useAuthStore()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'profile-updated', profile: any): void;
}>()

const isSubmitting = ref<boolean>(false)

const qualificationsList = ref<Qualification[]>([
  { id: 'facharzt', name: 'Facharzt' },
  { id: 'oberarzt', name: 'Oberarzt' },
  { id: 'chefarzt', name: 'Chefarzt' },
  { id: 'assistenzarzt', name: 'Assistenzarzt' },
  { id: 'promotion', name: 'Promotion' },
  { id: 'habilitation', name: 'Habilitation' }
])

const formData = ref<FormData>({
  name: '',
  specialty: '',
  qualifications: [],
  otherQualifications: '',
  contact: {
    email: '',
    phone: ''
  },
  availability: {
    availableFrom: ''
  },
  additionalInfo: ''
})

const errors = ref<FormErrors>({
  name: '',
  specialty: '',
  contact: {
    email: '',
    phone: ''
  },
  availability: {
    availableFrom: ''
  }
})

// Load existing profile data if available
onMounted(async () => {
  // Initialize form with user data from auth store if available
  const currentUser = authStore.user;
  if (currentUser) {
    formData.value.name = currentUser.name || '';
    
    // Pre-populate email from user data
    if (currentUser.email && formData.value.contact) {
      formData.value.contact.email = currentUser.email;
    }
  }

  try {
    const response = await api.get('/doctor/profile')
    
    if (response.data) {
      console.log('Loading existing doctor profile:', response.data)
      // Map the data to our form structure, with fallbacks for missing properties
      formData.value = {
        name: response.data.name || currentUser?.name || '',
        specialty: response.data.specialty || '',
        qualifications: response.data.qualifications || [],
        otherQualifications: response.data.otherQualifications || '',
        contact: {
          email: response.data.contact?.email || currentUser?.email || '',
          phone: response.data.contact?.phone || ''
        },
        availability: {
          availableFrom: response.data.availability?.availableFrom || ''
        },
        additionalInfo: response.data.additionalInfo || ''
      }
      
      // Convert date string to ISO date format for input
      if (formData.value.availability.availableFrom) {
        formData.value.availability.availableFrom = new Date(formData.value.availability.availableFrom)
          .toISOString().split('T')[0]
      }
    }
  } catch (error: unknown) {
    console.error('Error loading doctor profile:', error)
    // Don't show an error toast here, as this might be a new user with no profile yet
    const errorResponse = error as { response?: { status?: number } }
    if (errorResponse.response && errorResponse.response.status !== 404) {
      showToast('Fehler beim Laden des Profils', 'error')
    }
  }
})

const validateForm = (): boolean => {
  errors.value = {
    name: '',
    specialty: '',
    contact: {
      email: '',
      phone: ''
    },
    availability: {
      availableFrom: ''
    }
  }

  let isValid = true

  if (!formData.value.name) {
    errors.value.name = 'Name ist erforderlich'
    isValid = false
  }

  if (!formData.value.contact?.email) {
    errors.value.contact.email = 'E-Mail ist erforderlich'
    isValid = false
  }

  if (!formData.value.availability?.availableFrom) {
    errors.value.availability.availableFrom = 'Verfügbarkeitsdatum ist erforderlich'
    isValid = false
  }

  return isValid
}

const submitProfile = async (): Promise<void> => {
  try {
    if (!validateForm()) {
      return
    }

    isSubmitting.value = true
    
    // Track the form submission
    trackForm('doctor_profile')
    
    const response = await api.post('/doctor/profile', formData.value)
    
    if (response.data) {
      emit('profile-updated', response.data)
      showToast('Profil wurde erfolgreich aktualisiert', 'success')
    }
  } catch (error: unknown) {
    console.error('Error submitting doctor profile:', error)
    
    // Handle validation errors
    const errorResponse = error as { response?: { data?: { required?: any }, status?: number } }
    if (errorResponse.response?.data?.required) {
      const required = errorResponse.response.data.required
      if (required.name) errors.value.name = 'Name ist erforderlich'
      if (required.specialty) errors.value.specialty = 'Fachrichtung ist erforderlich'
      if (required.contact) errors.value.contact.email = 'E-Mail ist erforderlich'
      if (required.availability) errors.value.availability.availableFrom = 'Verfügbarkeitsdatum ist erforderlich'
    } else {
      showToast('Fehler beim Speichern des Profils', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script> 