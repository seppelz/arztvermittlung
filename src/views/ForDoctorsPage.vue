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
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center text-heading">Arzt-Profil erstellen</h2>
          
          <form @submit.prevent="submitForm" class="space-y-8">
            <!-- Personal Information -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Persönliche Informationen</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="title" class="block text-text-dark font-medium mb-2">Titel</label>
                  <select id="title" v-model="form.title" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Bitte wählen</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Dr. med.">Dr. med.</option>
                    <option value="Prof. Dr.">Prof. Dr.</option>
                    <option value="Prof. Dr. med.">Prof. Dr. med.</option>
                  </select>
                </div>
                
                <div>
                  <label for="specialty" class="block text-text-dark font-medium mb-2">Fachrichtung*</label>
                  <select id="specialty" v-model="form.specialty" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Bitte wählen</option>
                    <option value="Allgemeinmedizin">Allgemeinmedizin</option>
                    <option value="Anästhesiologie">Anästhesiologie</option>
                    <option value="Chirurgie">Chirurgie</option>
                    <option value="Innere Medizin">Innere Medizin</option>
                    <option value="Kardiologie">Kardiologie</option>
                    <option value="Neurologie">Neurologie</option>
                    <option value="Gynäkologie">Gynäkologie</option>
                    <option value="Pädiatrie">Pädiatrie</option>
                    <option value="Psychiatrie">Psychiatrie</option>
                    <option value="Radiologie">Radiologie</option>
                    <option value="Urologie">Urologie</option>
                    <option value="Sonstige">Sonstige</option>
                  </select>
                </div>
                
                <div>
                  <label for="firstName" class="block text-text-dark font-medium mb-2">Vorname*</label>
                  <input type="text" id="firstName" v-model="form.firstName" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="lastName" class="block text-text-dark font-medium mb-2">Nachname*</label>
                  <input type="text" id="lastName" v-model="form.lastName" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="email" class="block text-text-dark font-medium mb-2">E-Mail*</label>
                  <input type="email" id="email" v-model="form.email" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="phone" class="block text-text-dark font-medium mb-2">Telefon*</label>
                  <input type="tel" id="phone" v-model="form.phone" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>
            
            <!-- Professional Information -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Berufliche Informationen</h3>
              <div class="space-y-6">
                <div>
                  <label for="experience" class="block text-text-dark font-medium mb-2">Berufserfahrung in Jahren*</label>
                  <input type="number" id="experience" v-model="form.experience" required min="0" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label class="block text-text-dark font-medium mb-2">Qualifikationen und Zusatzbezeichnungen</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="(qualification, index) in qualifications" :key="index" class="flex items-center">
                      <input type="checkbox" :id="'qualification-' + index" v-model="form.qualifications" :value="qualification" class="mr-2" />
                      <label :for="'qualification-' + index" class="cursor-pointer">{{ qualification }}</label>
                    </div>
                  </div>
                  <input type="text" placeholder="Weitere Qualifikationen" v-model="form.otherQualifications" class="w-full px-4 py-2 mt-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
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
                  
                  <div>
                    <label for="employmentType" class="block text-text-dark font-medium mb-2">Gewünschte Beschäftigungsart*</label>
                    <select id="employmentType" v-model="form.employmentType" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="">Bitte wählen</option>
                      <option value="Vollzeit">Vollzeit</option>
                      <option value="Teilzeit">Teilzeit</option>
                      <option value="Honorararzt">Honorararzt</option>
                      <option value="Vertretung">Vertretung</option>
                      <option value="Wochenend-/Nachtdienst">Wochenend-/Nachtdienst</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label class="block text-text-dark font-medium mb-2">Gewünschte Regionen</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="(region, index) in regions" :key="index" class="flex items-center">
                      <input type="checkbox" :id="'region-' + index" v-model="form.regions" :value="region" class="mr-2" />
                      <label :for="'region-' + index" class="cursor-pointer">{{ region }}</label>
                    </div>
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
                Profil erstellen
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

const regions = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen'
]

const form = reactive({
  title: '',
  specialty: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  experience: '',
  qualifications: [],
  otherQualifications: '',
  availableFrom: '',
  employmentType: '',
  regions: [],
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