import { reactive } from 'vue'

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  visible: boolean;
}

// ToastOptions interface is used for documentation purposes
export interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom';
}

interface ToastAPI {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type'], duration?: number) => number;
  removeToast: (id: number) => void;
}

// Create a reactive state that will be shared between all instances
const toasts = reactive<Toast[]>([]);
let toastIdCounter = 0;

/**
 * Composable for managing toast notifications
 * @returns Toast notification API
 */
export function useToast(): ToastAPI {
  /**
   * Display a toast notification
   * @param message - The message to display
   * @param type - Toast type (info, success, warning, error)
   * @param duration - How long the toast should be displayed (ms)
   * @returns The ID of the created toast
   */
  function showToast(message: string, type: Toast['type'] = 'info', duration = 3000): number {
    const id = toastIdCounter++;
    const toast: Toast = {
      id,
      message,
      type,
      visible: true
    };
    
    // Add toast to the array
    toasts.push(toast);
    
    // Auto-remove the toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  }
  
  /**
   * Remove a toast by ID
   * @param id - The ID of the toast to remove
   */
  function removeToast(id: number): void {
    const index = toasts.findIndex(toast => toast.id === id);
    if (index !== -1) {
      // Mark as invisible first (for animation)
      toasts[index].visible = false;
      
      // Then remove after animation completes
      setTimeout(() => {
        const removeIndex = toasts.findIndex(toast => toast.id === id);
        if (removeIndex !== -1) {
          toasts.splice(removeIndex, 1);
        }
      }, 300); // Animation duration
    }
  }
  
  return {
    toasts,
    showToast,
    removeToast
  };
} 