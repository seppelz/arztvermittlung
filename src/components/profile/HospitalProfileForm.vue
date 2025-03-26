<template>
  <div class="hospital-profile-form bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Profil vervollständigen</h2>
    
    <form @submit.prevent="submitProfile" class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Grundlegende Informationen</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name der Klinik</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700">Art der Einrichtung</label>
            <select
              id="type"
              v-model="formData.type"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Bitte wählen</option>
              <option value="krankenhaus">Krankenhaus</option>
              <option value="klinik">Klinik</option>
              <option value="reha">Rehabilitationsklinik</option>
              <option value="praxis">Arztpraxis</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Kontaktinformationen</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="street" class="block text-sm font-medium text-gray-700">Straße</label>
            <input
              id="street"
              v-model="formData.address.street"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700">Stadt</label>
            <input
              id="city"
              v-model="formData.address.city"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="postalCode" class="block text-sm font-medium text-gray-700">Postleitzahl</label>
            <input
              id="postalCode"
              v-model="formData.address.postalCode"
              type="text"
              required
              pattern="[0-9]{5}"
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

      <!-- Specializations -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Fachrichtungen</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="specialty in specialties" :key="specialty.id" class="flex items-center">
            <input
              :id="specialty.id"
              v-model="formData.specialties"
              type="checkbox"
              :value="specialty.id"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label :for="specialty.id" class="ml-2 block text-sm text-gray-700">
              {{ specialty.name }}
            </label>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Zusätzliche Informationen</h3>
        
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div>
          <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
          <input
            id="website"
            v-model="formData.website"
            type="url"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
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
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const { showToast } = useToast()
const { trackForm } = useAnalytics()
const authStore = useAuthStore()

const emit = defineEmits(['close', 'profile-updated'])

const isSubmitting = ref(false)
const specialties = ref([
  { id: 'allgemeinmedizin', name: 'Allgemeinmedizin' },
  { id: 'innere', name: 'Innere Medizin' },
  { id: 'chirurgie', name: 'Chirurgie' },
  { id: 'gynakologie', name: 'Gynäkologie' },
  { id: 'kinderheilkunde', name: 'Kinderheilkunde' },
  { id: 'neurologie', name: 'Neurologie' },
  { id: 'psychiatrie', name: 'Psychiatrie' },
  { id: 'radiologie', name: 'Radiologie' },
  { id: 'anasthesie', name: 'Anästhesie' }
])

const formData = ref({
  name: '',
  type: '',
  address: {
    street: '',
    city: '',
    postalCode: ''
  },
  contact: {
    phone: ''
  },
  specialties: [],
  description: '',
  website: ''
})

// Load existing profile data if available
onMounted(async () => {
  // Initialize form with user data from auth store if available
  const currentUser = authStore.user;
  if (currentUser) {
    formData.value.name = currentUser.name || '';
  }

  try {
    const response = await api.get('/hospital/profile')
    if (response.data) {
      console.log('Loading existing hospital profile:', response.data)
      // Map the data to our form structure, with fallbacks for missing properties
      formData.value = {
        name: response.data.name || currentUser?.name || '',
        type: response.data.type || '',
        address: {
          street: response.data.address?.street || '',
          city: response.data.address?.city || '',
          postalCode: response.data.address?.postalCode || ''
        },
        contact: {
          phone: response.data.contact?.phone || ''
        },
        specialties: response.data.specialties || [],
        description: response.data.description || '',
        website: response.data.website || ''
      }
    }
  } catch (error) {
    console.error('Error loading hospital profile:', error)
    // Don't show an error toast here, as this might be a new user with no profile yet
    if (error.response && error.response.status !== 404) {
      showToast('Fehler beim Laden des Profils', 'error')
    }
  }
})

const submitProfile = async () => {
  isSubmitting.value = true
  
  try {
    const response = await api.post('/hospital/profile', formData.value)
    
    showToast('Profil erfolgreich aktualisiert', 'success')
    trackForm('Hospital Profile Update', {
      hasSpecialties: formData.value.specialties.length > 0,
      hasWebsite: !!formData.value.website
    })
    
    emit('profile-updated', response.data)
  } catch (error) {
    console.error('Error updating hospital profile:', error)
    showToast('Fehler beim Aktualisieren des Profils', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script> 