<template>
  <div>
    <section class="bg-primary text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Kontakt</h1>
        <p class="text-xl max-w-3xl">
          Haben Sie Fragen zu MedMatch? Wir sind für Sie da und freuen uns auf Ihre Nachricht.
        </p>
      </div>
    </section>

    <section class="py-12 bg-light">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-2xl font-semibold mb-6">Kontaktformular</h2>
              <form @submit.prevent="submitForm" class="space-y-6">
                <div>
                  <label for="name" class="block text-gray-700 mb-2">Name*</label>
                  <input type="text" id="name" v-model="form.name" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="email" class="block text-gray-700 mb-2">E-Mail*</label>
                  <input type="email" id="email" v-model="form.email" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="subject" class="block text-gray-700 mb-2">Betreff*</label>
                  <input type="text" id="subject" v-model="form.subject" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="message" class="block text-gray-700 mb-2">Nachricht*</label>
                  <textarea id="message" v-model="form.message" rows="5" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                </div>
                
                <div class="flex items-start">
                  <input type="checkbox" id="privacyPolicy" v-model="form.privacyPolicyAccepted" required class="mt-1 mr-2" />
                  <label for="privacyPolicy" class="text-sm text-gray-600">
                    Ich habe die <router-link to="/privacy" class="text-primary hover:underline">Datenschutzerklärung</router-link> gelesen und akzeptiere diese.*
                  </label>
                </div>
                
                <div>
                  <button 
                    type="submit" 
                    class="bg-primary text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-dark transition-colors duration-300"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="flex items-center">
                      <span class="w-5 h-5 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Wird gesendet...
                    </span>
                    <span v-else>Nachricht senden</span>
                  </button>
                </div>
                
                <p class="text-sm text-gray-500">* Pflichtfelder</p>
              </form>
              
              <div v-if="errorMessage" class="mt-8 p-4 bg-red-100 text-red-800 rounded-lg">
                <p class="font-semibold">Fehler!</p>
                <p>{{ errorMessage }}</p>
              </div>
              
              <div v-if="formSubmitted" class="mt-8 p-4 bg-green-100 text-green-800 rounded-lg">
                <p class="font-semibold">Vielen Dank für Ihre Nachricht!</p>
                <p>Wir haben Ihre Anfrage erhalten und werden uns umgehend bei Ihnen melden.</p>
              </div>
            </div>
            
            <div>
              <h2 class="text-2xl font-semibold mb-6">Kontaktinformationen</h2>
              <div class="bg-white p-6 rounded-lg shadow-md space-y-6">
                
                <div>
                  <h3 class="text-lg font-semibold mb-2">Kontakt</h3>
                  <p class="text-gray-700 mb-1">
                    <span class="font-medium">E-Mail:</span> info@med-match.de
                  </p>
                </div>
                
                <div>
                  <h3 class="text-lg font-semibold mb-2">Geschäftszeiten</h3>
                  <p class="text-gray-700 mb-1">
                    <span class="font-medium">Montag - Freitag:</span> 9:00 - 17:00 Uhr
                  </p>
                  <p class="text-gray-700">
                    <span class="font-medium">Wochenende:</span> Geschlossen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import contactService from '@/services/contact.service'

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  privacyPolicyAccepted: boolean;
}

const form = reactive<ContactForm>({
  name: '',
  email: '',
  subject: '',
  message: '',
  privacyPolicyAccepted: false
})

const formSubmitted = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const errorMessage = ref<string>('')

const submitForm = async (): Promise<void> => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    
    // Prepare data for API
    const contactData = {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message
    }
    
    console.log('Submitting contact form:', contactData)
    
    // Send to backend using contact service
    await contactService.sendMessage(contactData)
    
    // Show success message
    formSubmitted.value = true
    
    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    form.privacyPolicyAccepted = false
    
  } catch (error: unknown) {
    console.error('Error submitting contact form:', error)
    errorMessage.value = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
  } finally {
    isSubmitting.value = false
  }
}
</script> 