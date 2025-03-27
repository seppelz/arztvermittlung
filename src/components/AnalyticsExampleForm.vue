<template>
  <div class="analytics-example-form bg-white shadow-md rounded p-6 max-w-lg mx-auto my-6">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">Kontaktformular</h2>
    
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input 
          id="name" 
          v-model="formData.name" 
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @focus="trackFieldFocus('name')"
        >
      </div>
      
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
        <input 
          id="email" 
          v-model="formData.email" 
          type="email" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @focus="trackFieldFocus('email')"
        >
      </div>
      
      <div class="mb-4">
        <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Nachricht</label>
        <textarea 
          id="message" 
          v-model="formData.message" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          @focus="trackFieldFocus('message')"
        ></textarea>
      </div>
      
      <div class="flex items-center mb-4">
        <input 
          id="terms" 
          v-model="formData.terms" 
          type="checkbox" 
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          @click="trackTermsToggle"
        >
        <label for="terms" class="ml-2 block text-sm text-gray-700">
          Ich stimme den <a href="#" class="text-blue-600 hover:underline" @click.prevent="viewTerms">Nutzungsbedingungen</a> zu
        </label>
      </div>
      
      <div>
        <button 
          type="submit" 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          :disabled="!formValid"
          :class="{ 'opacity-50 cursor-not-allowed': !formValid }"
        >
          Absenden
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnalytics } from '../composables/useAnalytics'

// Form data interface
interface FormData {
  name: string;
  email: string;
  message: string;
  terms: boolean;
}

// Initialize our analytics composable
const { trackForm, trackInteraction, trackFeatureUsage } = useAnalytics()

const formData = ref<FormData>({
  name: '',
  email: '',
  message: '',
  terms: false
})

// Computed property to check if form is valid
const formValid = computed((): boolean => {
  return (
    formData.value.name.trim() !== '' && 
    formData.value.email.trim() !== '' && 
    formData.value.message.trim() !== '' && 
    formData.value.terms
  )
})

// Track when user focuses on a field
const trackFieldFocus = (fieldName: string): void => {
  trackInteraction('Field Focus', { field: fieldName })
}

// Track when user toggles terms checkbox
const trackTermsToggle = (): void => {
  trackInteraction('Terms Toggle', { 
    action: formData.value.terms ? 'unchecked' : 'checked'
  })
}

// Track when user views terms
const viewTerms = (): void => {
  trackFeatureUsage('View Terms', { source: 'contact-form' })
}

// Submit the form and track the submission
const submitForm = (): void => {
  if (formValid.value) {
    // Here you would normally send the form data to your backend
    console.log('Form submitted:', formData.value)
    
    // Track form submission with analytics
    trackForm('Contact Form', {
      // Don't include personal data in analytics
      hasName: !!formData.value.name,
      hasEmail: !!formData.value.email,
      messageLength: formData.value.message.length
    })
    
    // Reset form after submission
    formData.value = {
      name: '',
      email: '',
      message: '',
      terms: false
    }
    
    // Show success message (in a real app)
    alert('Vielen Dank für Ihre Nachricht!')
  }
}
</script> 