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
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
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
              required
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
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="availableFrom" class="block text-sm font-medium text-gray-700">Verfügbar ab</label>
            <input
              id="availableFrom"
              v-model="formData.availability.availableFrom"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="federalState" class="block text-sm font-medium text-gray-700">Bevorzugtes Bundesland</label>
            <select
              id="federalState"
              v-model="formData.availability.federalState"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Bitte wählen</option>
              <option v-for="state in federalStates" :key="state" :value="state">{{ state }}</option>
            </select>
          </div>
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useAnalytics } from '@/composables/useAnalytics'

const router = useRouter()
const { showToast } = useToast()
const { trackForm } = useAnalytics()

const emit = defineEmits(['close', 'profile-updated'])

const isSubmitting = ref(false)

const qualificationsList = ref([
  { id: 'facharzt', name: 'Facharzt' },
  { id: 'oberarzt', name: 'Oberarzt' },
  { id: 'chefarzt', name: 'Chefarzt' },
  { id: 'assistenzarzt', name: 'Assistenzarzt' },
  { id: 'promotion', name: 'Promotion' },
  { id: 'habilitation', name: 'Habilitation' }
])

const federalStates = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
  'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
  'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
  'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
]

const formData = ref({
  name: '',
  specialty: '',
  qualifications: [],
  otherQualifications: '',
  contact: {
    email: '',
    phone: ''
  },
  availability: {
    availableFrom: '',
    federalState: ''
  },
  additionalInfo: ''
})

// Load existing profile data if available
onMounted(async () => {
  try {
    const response = await fetch('/api/doctor/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      // Map the data to our form structure
      formData.value = {
        name: data.name || '',
        specialty: data.specialty || '',
        qualifications: data.qualifications || [],
        otherQualifications: data.otherQualifications || '',
        contact: data.contact || { email: '', phone: '' },
        availability: data.availability || { availableFrom: '', federalState: '' },
        additionalInfo: data.additionalInfo || ''
      }
      
      // Convert date string to ISO date format for input
      if (formData.value.availability.availableFrom) {
        formData.value.availability.availableFrom = new Date(formData.value.availability.availableFrom)
          .toISOString().split('T')[0]
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }
})

const submitProfile = async () => {
  try {
    isSubmitting.value = true
    
    // Track the form submission
    trackForm('doctor_profile', 'submit')
    
    const response = await fetch('/api/doctor/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData.value)
    })
    
    if (!response.ok) {
      throw new Error('Fehler beim Speichern des Profils')
    }
    
    const updatedProfile = await response.json()
    
    showToast('Profil erfolgreich gespeichert', 'success')
    emit('profile-updated', updatedProfile)
  } catch (error) {
    console.error('Error submitting profile:', error)
    showToast(error.message || 'Ein Fehler ist aufgetreten', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script> 