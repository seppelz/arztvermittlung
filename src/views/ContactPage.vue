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
                  <button type="submit" class="bg-primary text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-dark transition-colors duration-300">
                    Nachricht senden
                  </button>
                </div>
                
                <p class="text-sm text-gray-500">* Pflichtfelder</p>
              </form>
              
              <div v-if="formSubmitted" class="mt-8 p-4 bg-green-100 text-green-800 rounded-lg">
                <p class="font-semibold">Vielen Dank für Ihre Nachricht!</p>
                <p>Wir haben Ihre Anfrage erhalten und werden uns umgehend bei Ihnen melden.</p>
              </div>
            </div>
            
            <div>
              <h2 class="text-2xl font-semibold mb-6">Kontaktinformationen</h2>
              <div class="bg-white p-6 rounded-lg shadow-md space-y-6">
                <div>
                  <h3 class="text-lg font-semibold mb-2">Adresse</h3>
                  <p class="text-gray-700">
                    MedMatch GmbH<br>
                    Musterstraße 123<br>
                    10115 Berlin<br>
                    Deutschland
                  </p>
                </div>
                
                <div>
                  <h3 class="text-lg font-semibold mb-2">Kontakt</h3>
                  <p class="text-gray-700 mb-1">
                    <span class="font-medium">E-Mail:</span> info@med-match.de
                  </p>
                  <p class="text-gray-700 mb-1">
                    <span class="font-medium">Telefon:</span> +49 (0) 30 1234 5678
                  </p>
                  <p class="text-gray-700">
                    <span class="font-medium">Fax:</span> +49 (0) 30 1234 5679
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
                
                <div class="pt-4">
                  <h3 class="text-lg font-semibold mb-2">Folgen Sie uns</h3>
                  <div class="flex space-x-4">
                    <a href="#" class="text-primary hover:text-dark">
                      <span class="sr-only">LinkedIn</span>
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a href="#" class="text-primary hover:text-dark">
                      <span class="sr-only">Twitter</span>
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.383 4.482 13.995 13.995 0 01-10.162-5.159 4.92 4.92 0 001.522 6.574 4.869 4.869 0 01-2.228-.616v.061a4.914 4.914 0 003.941 4.822 4.9 4.9 0 01-2.2.082 4.957 4.957 0 004.616 3.437 9.89 9.89 0 01-6.114 2.107c-.398 0-.79-.022-1.175-.068a13.909 13.909 0 007.548 2.214c9.057 0 14.01-7.503 14.01-14.01 0-.213-.003-.425-.012-.636A10.115 10.115 0 0024 4.59z" />
                      </svg>
                    </a>
                    <a href="#" class="text-primary hover:text-dark">
                      <span class="sr-only">Facebook</span>
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  privacyPolicyAccepted: false
})

const formSubmitted = ref(false)

const submitForm = () => {
  // Here you would normally send the form data to your backend
  console.log('Form submitted:', form)
  
  // For demo purposes, we'll just show a success message
  formSubmitted.value = true
  
  // Reset form after submission (optional)
  // Object.keys(form).forEach(key => {
  //   if (typeof form[key] === 'boolean') {
  //     form[key] = false
  //   } else {
  //     form[key] = ''
  //   }
  // })
}
</script> 