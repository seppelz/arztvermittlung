import { ref, reactive } from 'vue'

// Create a reactive state that will be shared between all instances
const toasts = reactive([])
let toastIdCounter = 0

export const useToast = () => {
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = toastIdCounter++
    const toast = {
      id,
      message,
      type,
      visible: true
    }
    
    // Add toast to the array
    toasts.push(toast)
    
    // Auto-remove the toast after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.findIndex(toast => toast.id === id)
    if (index !== -1) {
      // Mark as invisible first (for animation)
      toasts[index].visible = false
      
      // Then remove after animation completes
      setTimeout(() => {
        const removeIndex = toasts.findIndex(toast => toast.id === id)
        if (removeIndex !== -1) {
          toasts.splice(removeIndex, 1)
        }
      }, 300) // Animation duration
    }
  }
  
  return {
    toasts,
    showToast,
    removeToast
  }
} 