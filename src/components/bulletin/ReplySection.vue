<template>
  <div class="reply-section mt-4">
    <!-- Display existing replies -->
    <div v-if="message.replies && message.replies.length > 0" class="space-y-4 mb-4">
      <div class="flex justify-between items-center">
        <h4 class="text-sm font-medium text-gray-700">Antworten ({{ message.replies.length }})</h4>
        <div v-if="isAdmin && selectedRepliesCount > 0" class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">{{ selectedRepliesCount }} ausgewählt</span>
          <button
            @click="handleBulkDelete"
            class="text-red-600 hover:text-red-800"
            title="Ausgewählte Antworten löschen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div v-for="reply in message.replies" :key="reply.timestamp" class="bg-gray-50 rounded-lg p-4">
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center space-x-2">
            <input
              v-if="isAdmin"
              type="checkbox"
              :checked="selectedReplies.has(reply._id)"
              @change="toggleReplySelection(reply._id)"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <div>
              <p class="font-medium text-gray-900">{{ reply.name }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(reply.timestamp) }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button 
              v-if="canEditReply(reply)"
              @click="editReply(reply)"
              class="text-blue-600 hover:text-blue-800"
              title="Antwort bearbeiten"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              v-if="canDeleteReply(reply)"
              @click="showDeleteConfirm = true; selectedReply = reply"
              class="text-red-600 hover:text-red-800"
              title="Antwort löschen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <p class="text-gray-700">{{ reply.content }}</p>
      </div>
    </div>

    <!-- Reply form -->
    <div v-if="!showReplyForm" class="text-center">
      <button
        @click="showReplyForm = true"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Antworten
      </button>
    </div>

    <!-- Reply form modal -->
    <div v-if="showReplyForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Antwort verfassen</h3>
        <p class="text-sm text-gray-500 mb-4">Sie antworten auf die Nachricht von {{ message.name }}</p>
        
        <form @submit.prevent="submitReply" class="space-y-4">
          <div v-if="!authStore.isAuthenticated">
            <label for="replyName" class="block text-sm font-medium text-gray-700">Ihr Name*</label>
            <input
              id="replyName"
              v-model="replyForm.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div v-if="!authStore.isAuthenticated">
            <label for="replyEmail" class="block text-sm font-medium text-gray-700">Ihre E-Mail*</label>
            <input
              id="replyEmail"
              v-model="replyForm.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="replyContent" class="block text-sm font-medium text-gray-700">Ihre Antwort*</label>
            <textarea
              id="replyContent"
              v-model="replyForm.content"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div v-if="!authStore.isAuthenticated" class="flex items-start">
            <input
              type="checkbox"
              id="replyPrivacyPolicy"
              v-model="replyForm.privacyPolicyAccepted"
              required
              class="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="replyPrivacyPolicy" class="text-sm text-gray-700">
              Ich habe die <router-link to="/privacy" class="text-blue-600 hover:underline">Datenschutzerklärung</router-link> gelesen und akzeptiere diese.*
            </label>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeReplyForm"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Wird gesendet...' : 'Antwort senden' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Antwort löschen</h3>
        <p class="text-gray-600 mb-6">Sind Sie sicher, dass Sie diese Antwort löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteConfirm = false; selectedReply = null"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            @click="deleteReply(selectedReply)"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Reply Modal -->
    <div v-if="showEditForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Antwort bearbeiten</h3>
        
        <form @submit.prevent="updateReply" class="space-y-4">
          <div>
            <label for="editContent" class="block text-sm font-medium text-gray-700">Ihre Antwort*</label>
            <textarea
              id="editContent"
              v-model="selectedReply.content"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showEditForm = false; selectedReply = null"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isSubmitting ? 'Wird gespeichert...' : 'Speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import bulletinProxyService from '@/services/bulletinProxyService'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['reply-added', 'reply-deleted', 'reply-updated'])

const authStore = useAuthStore()
const { showToast } = useToast()
const showReplyForm = ref(false)
const isSubmitting = ref(false)
const showDeleteConfirm = ref(false)
const showEditForm = ref(false)
const selectedReply = ref(null)
const selectedReplies = ref(new Set())

// Add computed property for admin status
const isAdmin = computed(() => authStore.isAdmin)

// Add computed property for selected replies count
const selectedRepliesCount = computed(() => selectedReplies.value.size)

// Add computed property to check if user can edit reply
const canEditReply = (reply) => {
  if (!reply) return false
  // Admin can edit any reply
  if (authStore.isAdmin) return true
  
  // Authenticated user can edit their own replies
  if (authStore.isAuthenticated && reply.userId) {
    return reply.userId === authStore.userId
  }
  
  // Guest user can edit their own replies using sessionId
  const sessionId = localStorage.getItem('guestSessionId')
  if (sessionId && reply.sessionId) {
    return reply.sessionId === sessionId
  }
  
  return false
}

// Add computed property to check if user can delete reply
const canDeleteReply = (reply) => {
  if (!reply) return false
  // Admin can delete any reply
  if (authStore.isAdmin) return true
  
  // Authenticated user can delete their own replies
  if (authStore.isAuthenticated && reply.userId) {
    return reply.userId === authStore.userId
  }
  
  // Guest user can delete their own replies using sessionId
  const sessionId = localStorage.getItem('guestSessionId')
  if (sessionId && reply.sessionId) {
    return reply.sessionId === sessionId
  }
  
  return false
}

// Add method to handle reply selection
const toggleReplySelection = (replyId) => {
  if (selectedReplies.value.has(replyId)) {
    selectedReplies.value.delete(replyId)
  } else {
    selectedReplies.value.add(replyId)
  }
}

// Add method to handle bulk delete
const handleBulkDelete = async () => {
  if (!selectedReplies.value.size) return
  
  try {
    for (const replyId of selectedReplies.value) {
      await bulletinProxyService.deleteReply(props.message.id, replyId)
      emit('reply-deleted', replyId)
    }
    selectedReplies.value.clear()
    showToast('Ausgewählte Antworten wurden erfolgreich gelöscht', 'success')
  } catch (error) {
    console.error('Error deleting replies:', error)
    showToast('Fehler beim Löschen der Antworten', 'error')
  }
}

// Add method to handle reply editing
const editReply = (reply) => {
  selectedReply.value = { ...reply }
  showEditForm.value = true
}

// Add method to handle reply update
const updateReply = async () => {
  try {
    if (!authStore.isAuthenticated) {
      showToast('Bitte melden Sie sich an, um Antworten zu bearbeiten', 'error')
      return
    }

    isSubmitting.value = true
    const response = await bulletinProxyService.updateReply(
      props.message.id, 
      selectedReply.value._id, 
      selectedReply.value.content
    )
    
    if (response && response.data) {
      showToast('Antwort wurde erfolgreich aktualisiert', 'success')
      emit('reply-updated', response.data)
      showEditForm.value = false
      selectedReply.value = null
    }
  } catch (error) {
    console.error('Error updating reply:', error)
    if (error.message === 'Please log in to update replies') {
      showToast('Bitte melden Sie sich an, um Antworten zu bearbeiten', 'error')
    } else {
      showToast('Fehler beim Aktualisieren der Antwort', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

const replyForm = reactive({
  name: '',
  email: '',
  content: '',
  privacyPolicyAccepted: false
})

// Add method to initialize form with user data
const initializeFormWithUserData = () => {
  if (authStore.isAuthenticated && authStore.user) {
    replyForm.name = authStore.user.name || ''
    replyForm.email = authStore.user.email || ''
    replyForm.privacyPolicyAccepted = true // Since user is logged in, they've already accepted the privacy policy
  }
}

// Update showReplyForm watcher to initialize form
watch(showReplyForm, (newValue) => {
  if (newValue) {
    initializeFormWithUserData()
  }
})

// Update closeReplyForm to reset form
const closeReplyForm = () => {
  showReplyForm.value = false
  // Reset form
  replyForm.name = ''
  replyForm.email = ''
  replyForm.content = ''
  replyForm.privacyPolicyAccepted = false
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const submitReply = async () => {
  try {
    // Validate form
    if (authStore.isAuthenticated) {
      // For logged-in users, only content is required
      if (!replyForm.content) {
        showToast('Bitte geben Sie einen Inhalt ein', 'error')
        return
      }
    } else {
      // For guests, name, email, content and privacy policy are required
      if (!replyForm.name || !replyForm.email || !replyForm.content || !replyForm.privacyPolicyAccepted) {
        showToast('Bitte füllen Sie alle Pflichtfelder aus', 'error')
        return
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(replyForm.email)) {
        showToast('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'error')
        return
      }
    }
    
    isSubmitting.value = true
    
    const response = await bulletinProxyService.addReply(props.message.id, {
      ...replyForm,
      timestamp: new Date()
    })
    
    if (response && response.data) {
      showToast('Ihre Antwort wurde erfolgreich gesendet', 'success')
      emit('reply-added', response.data)
      closeReplyForm()
    }
  } catch (error) {
    console.error('Error submitting reply:', error)
    if (error.response?.status === 401) {
      showToast('Bitte melden Sie sich an, um eine Antwort zu senden', 'error')
    } else if (error.response?.status === 500) {
      showToast('Server-Fehler beim Verarbeiten der Antwort. Bitte versuchen Sie es später erneut.', 'error')
      console.error('Server error details:', error.response?.data)
    } else if (error.response?.data?.error) {
      showToast(error.response.data.error, 'error')
    } else {
      showToast('Fehler beim Senden der Antwort. Bitte überprüfen Sie Ihre Internetverbindung.', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

// Add delete reply method
const deleteReply = async (reply) => {
  try {
    await bulletinProxyService.deleteReply(props.message.id, reply._id)
    showToast('Antwort wurde erfolgreich gelöscht', 'success')
    emit('reply-deleted', reply._id)
    showDeleteConfirm.value = false
    selectedReply.value = null
  } catch (error) {
    console.error('Error deleting reply:', error)
    if (error.response?.status === 401) {
      showToast('Bitte melden Sie sich an, um Antworten zu löschen', 'error')
    } else if (error.response?.status === 403) {
      showToast('Sie haben keine Berechtigung, diese Antwort zu löschen', 'error')
    } else if (error.response?.status === 500) {
      showToast('Server-Fehler beim Löschen der Antwort. Bitte versuchen Sie es später erneut.', 'error')
      console.error('Server error details:', error.response?.data)
    } else if (error.message === 'Please log in to delete replies') {
      showToast('Bitte melden Sie sich an, um Antworten zu löschen', 'error')
    } else {
      showToast('Fehler beim Löschen der Antwort. Bitte überprüfen Sie Ihre Internetverbindung.', 'error')
    }
  }
}
</script> 