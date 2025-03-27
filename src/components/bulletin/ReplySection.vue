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
      <div v-for="reply in message.replies" :key="reply._id" class="bg-gray-50 rounded-lg p-4">
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
              v-model="selectedReply?.content"
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

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import * as bulletinService from '@/services/bulletin.service'
import { useAuthStore } from '@/stores/auth'
import { Bulletin, BulletinReply } from '@/types'

interface Props {
  message: Bulletin;
}

// UI-specific bulletin reply that includes bulletinId
interface UIBulletinReply extends BulletinReply {
  bulletinId: string;
}

interface ReplyForm {
  name: string;
  email: string;
  content: string;
  privacyPolicyAccepted: boolean;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'reply-added': [reply: UIBulletinReply];
  'reply-deleted': [replyId: string];
  'reply-updated': [reply: UIBulletinReply];
}>()

const authStore = useAuthStore()
const { showToast } = useToast()
const showReplyForm = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const errorMessage = ref<string>('')
const showDeleteConfirm = ref<boolean>(false)
const showEditForm = ref<boolean>(false)
const selectedReply = ref<BulletinReply | null>(null)
const selectedReplies = ref<Set<string>>(new Set())

// Form data
const replyForm = reactive<ReplyForm>({
  name: '',
  email: '',
  content: '',
  privacyPolicyAccepted: false
})

// Add computed property for admin status
const isAdmin = computed<boolean>(() => authStore.isAdmin)

// Add computed property for selected replies count
const selectedRepliesCount = computed<number>(() => selectedReplies.value.size)

/**
 * Format date to a user-friendly string
 */
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Check if current user can edit a reply
 */
function canEditReply(reply: BulletinReply): boolean {
  if (isAdmin.value) return true
  
  const authStore = useAuthStore()
  
  // Check if user is authenticated and owns the reply
  if (authStore.isAuthenticated && reply.userId === authStore.userId) {
    return true
  }
  
  // For anonymous users, check if they have the same session ID
  if (!authStore.isAuthenticated && reply.sessionId) {
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId && sessionId === reply.sessionId) {
      return true
    }
  }
  
  return false
}

/**
 * Check if current user can delete a reply
 */
function canDeleteReply(reply: BulletinReply): boolean {
  return canEditReply(reply)
}

/**
 * Submit a new reply
 */
async function submitReply(): Promise<void> {
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    
    // Prepare reply data with proper type
    const replyData: Partial<BulletinReply> = {
      content: replyForm.content,
      privacyPolicyAccepted: true
    }
    
    // Add name/email if not authenticated
    if (!authStore.isAuthenticated) {
      replyData.name = replyForm.name
      replyData.email = replyForm.email
      replyData.privacyPolicyAccepted = replyForm.privacyPolicyAccepted
    }
    
    // Send the reply
    const response = await bulletinService.addReply(props.message._id, replyData)
    
    // Get the newly created reply
    const newReply = response.data.replies.slice(-1)[0]
    
    // Construct UI-friendly reply object to emit
    const uiReply: UIBulletinReply = {
      ...newReply,
      bulletinId: props.message._id
    }
    
    // Emit event to parent
    emit('reply-added', uiReply)
    
    // Reset and close form
    replyForm.content = ''
    replyForm.privacyPolicyAccepted = false
    showReplyForm.value = false
    
    showToast('Antwort erfolgreich gesendet', 'success')
  } catch (error) {
    console.error('Error submitting reply:', error)
    errorMessage.value = 'Fehler beim Senden der Antwort. Bitte versuchen Sie es später erneut.'
    showToast('Fehler beim Senden der Antwort', 'error')
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Close the reply form and reset fields
 */
function closeReplyForm(): void {
  showReplyForm.value = false
  replyForm.content = ''
  replyForm.name = ''
  replyForm.email = ''
  replyForm.privacyPolicyAccepted = false
}

/**
 * Delete a reply
 */
async function deleteReply(reply: BulletinReply | null): Promise<void> {
  if (!reply) return
  
  try {
    isSubmitting.value = true
    
    await bulletinService.deleteReply(props.message._id, reply._id)
    
    // Emit event to parent
    emit('reply-deleted', reply._id)
    
    // Reset state
    showDeleteConfirm.value = false
    selectedReply.value = null
    
    showToast('Antwort erfolgreich gelöscht', 'success')
  } catch (error) {
    console.error('Error deleting reply:', error)
    showToast('Fehler beim Löschen der Antwort', 'error')
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Prepare to edit a reply
 */
function editReply(reply: BulletinReply): void {
  selectedReply.value = {...reply}
  showEditForm.value = true
}

/**
 * Update a reply
 */
async function updateReply(): Promise<void> {
  if (!selectedReply.value) return
  
  try {
    isSubmitting.value = true
    
    const response = await bulletinService.updateReply(
      props.message._id, 
      selectedReply.value._id, 
      selectedReply.value.content
    )
    
    // Get the updated reply from response
    const updatedReply = response.data.replies.find(
      (r: BulletinReply) => r._id === selectedReply.value?._id
    )
    
    if (updatedReply) {
      // Construct UI-friendly reply object to emit
      const uiReply: UIBulletinReply = {
        ...updatedReply,
        bulletinId: props.message._id
      }
      
      // Emit event to parent
      emit('reply-updated', uiReply)
    }
    
    // Reset state
    showEditForm.value = false
    selectedReply.value = null
    
    showToast('Antwort erfolgreich aktualisiert', 'success')
  } catch (error) {
    console.error('Error updating reply:', error)
    showToast('Fehler beim Aktualisieren der Antwort', 'error')
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Toggle selection of a reply for bulk operations
 */
function toggleReplySelection(replyId: string): void {
  if (selectedReplies.value.has(replyId)) {
    selectedReplies.value.delete(replyId)
  } else {
    selectedReplies.value.add(replyId)
  }
}

/**
 * Delete multiple replies at once
 */
async function handleBulkDelete(): Promise<void> {
  if (selectedReplies.value.size === 0) return
  
  const confirmed = confirm(`Sind Sie sicher, dass Sie ${selectedReplies.value.size} Antworten löschen möchten?`)
  if (!confirmed) return
  
  try {
    isSubmitting.value = true
    
    // Delete each selected reply
    for (const replyId of selectedReplies.value) {
      await bulletinService.deleteReply(props.message._id, replyId)
      emit('reply-deleted', replyId)
    }
    
    // Clear selection
    selectedReplies.value.clear()
    
    showToast('Antworten erfolgreich gelöscht', 'success')
  } catch (error) {
    console.error('Error deleting replies:', error)
    showToast('Fehler beim Löschen der Antworten', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script> 