<template>
  <div class="bulletin-entries">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Meine Einträge</h2>
    
    <div v-if="isLoading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-600">{{ error }}</p>
    </div>
    
    <div v-else-if="entries.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <p class="text-gray-500">Sie haben noch keine Einträge erstellt.</p>
      <button 
        @click="goToBulletinBoard"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Neuen Eintrag erstellen
      </button>
    </div>
    
    <div v-else class="space-y-6">
      <div 
        v-for="entry in entries" 
        :key="entry._id" 
        class="bg-white shadow-sm border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-medium text-gray-900">{{ entry.title }}</h3>
          <div class="flex space-x-2">
            <button 
              @click="editEntry(entry)"
              class="text-blue-600 hover:text-blue-800"
            >
              <span class="sr-only">Bearbeiten</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              @click="deleteEntry(entry._id)"
              class="text-red-600 hover:text-red-800"
            >
              <span class="sr-only">Löschen</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="mt-2 mb-3">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ entry.messageType }}
          </span>
          <span class="ml-2 text-sm text-gray-500">
            {{ formatDate(entry.timestamp || entry.createdAt) }}
          </span>
        </div>
        
        <p class="text-gray-700 text-sm">{{ entry.content }}</p>
        
        <div class="mt-3 text-sm text-gray-500">
          <div v-if="entry.specialty">
            <strong>Fachrichtung:</strong> {{ entry.specialty }}
          </div>
          <div v-if="entry.federalState">
            <strong>Bundesland:</strong> {{ entry.federalState }}
          </div>
          <div v-if="entry.startDate">
            <strong>Startdatum:</strong> {{ formatDate(entry.startDate) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Eintrag bearbeiten</h3>
        
        <form @submit.prevent="updateEntry" class="space-y-4">
          <div>
            <label for="edit-title" class="block text-sm font-medium text-gray-700">Titel</label>
            <input
              id="edit-title"
              v-model="editingEntry.title"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="edit-content" class="block text-sm font-medium text-gray-700">Inhalt</label>
            <textarea
              id="edit-content"
              v-model="editingEntry.content"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div v-if="editingEntry.messageType === 'Angebot' || editingEntry.messageType === 'Gesuch'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="edit-specialty" class="block text-sm font-medium text-gray-700">Fachrichtung</label>
                <input
                  id="edit-specialty"
                  v-model="editingEntry.specialty"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>
              
              <div v-if="editingEntry.messageType === 'Angebot'">
                <label for="edit-federalState" class="block text-sm font-medium text-gray-700">Bundesland</label>
                <select
                  id="edit-federalState"
                  v-model="editingEntry.federalState"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Bitte wählen</option>
                  <option v-for="state in federalStates" :key="state" :value="state">{{ state }}</option>
                </select>
              </div>
              
              <div>
                <label for="edit-startDate" class="block text-sm font-medium text-gray-700">Startdatum</label>
                <input
                  id="edit-startDate"
                  v-model="editingEntry.startDate"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showEditModal = false"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ isSubmitting ? 'Wird gespeichert...' : 'Speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Eintrag löschen</h3>
        <p class="text-gray-700 mb-6">Sind Sie sicher, dass Sie diesen Eintrag löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Abbrechen
          </button>
          <button
            @click="confirmDelete"
            :disabled="isSubmitting"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {{ isSubmitting ? 'Wird gelöscht...' : 'Löschen' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const { showToast } = useToast()
const authStore = useAuthStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref(null)
const entries = ref([])
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingEntry = ref({})
const deletingEntryId = ref(null)

const federalStates = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
  'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
  'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
  'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
]

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

// Navigate to bulletin board page
const goToBulletinBoard = () => {
  router.push('/bulletin-board')
}

// Load user's bulletin entries
const loadEntries = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Get the user's email from auth store
    const userEmail = authStore.user?.email
    
    if (!userEmail) {
      throw new Error('Benutzer nicht angemeldet')
    }
    
    // Fetch all bulletins filtered by user's email using the api instance
    const response = await api.get(`/bulletin`, {
      params: {
        email: userEmail
      }
    })
    
    // Handle different response structures
    let filteredEntries = []
    if (response.data && response.data.data) {
      // Extract entries from data property
      filteredEntries = response.data.data
    } else if (Array.isArray(response.data)) {
      // Response is already an array
      filteredEntries = response.data
    } else {
      console.warn('Unexpected response format:', response.data)
      filteredEntries = []
    }
    
    // Additional filter to ensure only user's entries are shown
    entries.value = filteredEntries.filter(entry => 
      entry.email?.toLowerCase() === userEmail.toLowerCase()
    )
    
    // Sort entries by date (newest first)
    entries.value.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.createdAt || 0)
      const dateB = new Date(b.timestamp || b.createdAt || 0)
      return dateB - dateA
    })
    
    console.log(`Loaded ${entries.value.length} entries for user ${userEmail}`)
  } catch (err) {
    console.error('Error loading bulletin entries:', err)
    error.value = err.message || 'Fehler beim Laden der Einträge'
  } finally {
    isLoading.value = false
  }
}

// Edit an entry
const editEntry = (entry) => {
  // Create a deep copy of the entry to avoid mutating the original
  editingEntry.value = JSON.parse(JSON.stringify(entry))
  
  // Convert date strings to ISO date format for input
  if (editingEntry.value.startDate) {
    const date = new Date(editingEntry.value.startDate)
    if (!isNaN(date.getTime())) {
      editingEntry.value.startDate = date.toISOString().split('T')[0]
    }
  }
  
  showEditModal.value = true
}

// Update an entry
const updateEntry = async () => {
  isSubmitting.value = true
  
  try {
    await api.put(`/bulletin/${editingEntry.value._id}`, editingEntry.value)
    
    showToast('Eintrag erfolgreich aktualisiert', 'success')
    showEditModal.value = false
    
    // Reload entries to get the updated list
    await loadEntries()
  } catch (err) {
    console.error('Error updating bulletin entry:', err)
    showToast(err.message || 'Fehler beim Aktualisieren des Eintrags', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Delete an entry (show confirmation)
const deleteEntry = (id) => {
  deletingEntryId.value = id
  showDeleteModal.value = true
}

// Confirm deletion
const confirmDelete = async () => {
  isSubmitting.value = true
  
  try {
    await api.delete(`/bulletin/${deletingEntryId.value}`)
    
    showToast('Eintrag erfolgreich gelöscht', 'success')
    showDeleteModal.value = false
    
    // Remove the deleted entry from the list
    entries.value = entries.value.filter(entry => entry._id !== deletingEntryId.value)
  } catch (err) {
    console.error('Error deleting bulletin entry:', err)
    showToast(err.message || 'Fehler beim Löschen des Eintrags', 'error')
  } finally {
    isSubmitting.value = false
    deletingEntryId.value = null
  }
}

// Load entries when component is mounted
onMounted(loadEntries)
</script> 