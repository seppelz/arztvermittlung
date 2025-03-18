<template>
  <div>
    <section class="bg-primary text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Für Ärzte</h1>
        <p class="text-xl max-w-2xl">
          Finden Sie Ihren nächsten Einsatz in einer Klinik ohne teure Vermittlungsgebühren. 
          Direkt, transparent und flexibel.
        </p>
      </div>
    </section>

    <section class="py-12 bg-light">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-strong p-8">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center text-heading">Ihre Angaben</h2>
          
          <form @submit.prevent="submitForm" class="space-y-8">
            <!-- Personal Information -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Persönliche Informationen</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="specialty" class="block text-text-dark font-semibold mb-2">Fachrichtung</label>
                  <input type="text" id="specialty" v-model="form.specialty" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" placeholder="Ihre Fachrichtung" />
                </div>
                
                <div>
                  <label for="name" class="block text-text-dark font-semibold mb-2">Name</label>
                  <input type="text" id="name" v-model="form.name" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
                </div>
                
                <div>
                  <label for="email" class="block text-text-dark font-semibold mb-2">E-Mail*</label>
                  <input type="email" id="email" v-model="form.email" required class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
                </div>
                
                <div>
                  <label for="phone" class="block text-text-dark font-semibold mb-2">Telefon</label>
                  <input type="tel" id="phone" v-model="form.phone" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
                </div>
              </div>
            </div>
            
            <!-- Professional Information -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Berufliche Informationen</h3>
              <div class="space-y-6">
                <div>
                  <label class="block text-text-dark font-semibold mb-2">Qualifikationen und Zusatzbezeichnungen</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="(qualification, index) in qualifications" :key="index" class="flex items-center">
                      <input type="checkbox" :id="'qualification-' + index" v-model="form.qualifications" :value="qualification" class="mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" />
                      <label :for="'qualification-' + index" class="cursor-pointer text-text-dark">{{ qualification }}</label>
                    </div>
                  </div>
                  <input type="text" placeholder="Weitere Qualifikationen" v-model="form.otherQualifications" class="w-full px-4 py-3 mt-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
                </div>
              </div>
            </div>
            
            <!-- Availability -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Verfügbarkeit</h3>
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="availableFrom" class="block text-text-dark font-medium mb-2">Verfügbar ab*</label>
                    <input type="date" id="availableFrom" v-model="form.availableFrom" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                
                <div>
                  <label for="additionalInfo" class="block text-text-dark font-medium mb-2">Weitere Informationen</label>
                  <textarea id="additionalInfo" v-model="form.additionalInfo" rows="4" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                </div>
              </div>
            </div>
            
            <!-- Privacy -->
            <div class="space-y-4">
              <div class="flex items-start">
                <input type="checkbox" id="privacyPolicy" v-model="form.privacyPolicyAccepted" required class="mt-1 mr-2" />
                <label for="privacyPolicy" class="text-sm text-gray-600">
                  Ich habe die <router-link to="/privacy" class="text-primary hover:underline">Datenschutzerklärung</router-link> gelesen und akzeptiere diese.*
                </label>
              </div>
              
              <div class="flex items-start">
                <input type="checkbox" id="marketing" v-model="form.marketingAccepted" class="mt-1 mr-2" />
                <label for="marketing" class="text-sm text-gray-600">
                  Ich möchte über passende Stellenangebote per E-Mail informiert werden.
                </label>
              </div>
            </div>
            
            <div class="text-center">
              <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-10 rounded-lg shadow-strong transition-colors duration-300 text-lg">
                Angaben erstellen
              </button>
            </div>
            
            <p class="text-sm text-gray-500 text-center">* Pflichtfelder</p>
          </form>
          
          <div v-if="formSubmitted" class="mt-8 p-6 bg-success bg-opacity-10 text-success rounded-lg border border-success border-opacity-20">
            <p class="font-semibold text-lg">Vielen Dank für Ihre Registrierung!</p>
            <p>Wir haben Ihre Daten erhalten und werden uns in Kürze bei Ihnen melden.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const qualifications = [
  'Facharzt',
  'Oberarzt',
  'Notfallmedizin',
  'Intensivmedizin',
  'Palliativmedizin',
  'Schmerztherapie',
  'Sonographie',
  'Endoskopie'
]

const form = reactive({
  specialty: '',
  name: '',
  email: '',
  phone: '',
  qualifications: [],
  otherQualifications: '',
  availableFrom: '',
  additionalInfo: '',
  privacyPolicyAccepted: false,
  marketingAccepted: false
})

const formSubmitted = ref(false)

const submitForm = () => {
  // Here you would normally send the form data to your backend
  console.log('Form submitted:', form)
  
  // For demo purposes, we'll just show a success message
  formSubmitted.value = true
  
  // Reset form after submission (optional)
  // Object.keys(form).forEach(key => {
  //   if (Array.isArray(form[key])) {
  //     form[key] = []
  //   } else if (typeof form[key] === 'boolean') {
  //     form[key] = false
  //   } else {
  //     form[key] = ''
  //   }
  // })
}
</script> 