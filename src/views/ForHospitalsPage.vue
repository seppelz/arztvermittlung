<template>
  <div>
    <section class="bg-dark text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Für Kliniken</h1>
        <p class="text-xl max-w-2xl">
          Finden Sie qualifizierte Ärzte ohne teure Vermittlungsagenturen. 
          Bei MedMatch zahlen Sie nur bei erfolgreicher Vermittlung eine faire Gebühr.
        </p>
      </div>
    </section>

    <section class="py-12 bg-light">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-strong p-8">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center text-heading">Klinik-Anfrage stellen</h2>
          
          <form @submit.prevent="submitForm" class="space-y-8">
            <!-- Hospital Information -->
            <div>
              <h3 class="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Informationen zur Einrichtung</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label for="hospitalName" class="block text-gray-700 mb-2">Name der Klinik/Einrichtung*</label>
                  <input type="text" id="hospitalName" v-model="form.hospitalName" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div class="md:col-span-2">
                  <label for="hospitalType" class="block text-gray-700 mb-2">Art der Einrichtung*</label>
                  <select id="hospitalType" v-model="form.hospitalType" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Bitte wählen</option>
                    <option value="Universitätsklinikum">Universitätsklinikum</option>
                    <option value="Krankenhaus der Maximalversorgung">Krankenhaus der Maximalversorgung</option>
                    <option value="Krankenhaus der Schwerpunktversorgung">Krankenhaus der Schwerpunktversorgung</option>
                    <option value="Krankenhaus der Grundversorgung">Krankenhaus der Grundversorgung</option>
                    <option value="Fachklinik">Fachklinik</option>
                    <option value="Rehabilitationsklinik">Rehabilitationsklinik</option>
                    <option value="Medizinisches Versorgungszentrum (MVZ)">Medizinisches Versorgungszentrum (MVZ)</option>
                    <option value="Praxis">Praxis</option>
                    <option value="Sonstige">Sonstige</option>
                  </select>
                </div>
                
                <div>
                  <label for="street" class="block text-gray-700 mb-2">Straße und Hausnummer*</label>
                  <input type="text" id="street" v-model="form.street" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 md:col-span-1 gap-4">
                  <div class="md:col-span-1">
                    <label for="zip" class="block text-gray-700 mb-2">PLZ*</label>
                    <input type="text" id="zip" v-model="form.zip" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div class="md:col-span-2">
                    <label for="city" class="block text-gray-700 mb-2">Ort*</label>
                    <input type="text" id="city" v-model="form.city" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                
                <div>
                  <label for="website" class="block text-gray-700 mb-2">Webseite</label>
                  <input type="url" id="website" v-model="form.website" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>
            
            <!-- Contact Person -->
            <div>
              <h3 class="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Ansprechpartner</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="contactFirstName" class="block text-gray-700 mb-2">Vorname*</label>
                  <input type="text" id="contactFirstName" v-model="form.contactFirstName" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="contactLastName" class="block text-gray-700 mb-2">Nachname*</label>
                  <input type="text" id="contactLastName" v-model="form.contactLastName" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="position" class="block text-gray-700 mb-2">Position*</label>
                  <input type="text" id="position" v-model="form.position" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="department" class="block text-gray-700 mb-2">Abteilung</label>
                  <input type="text" id="department" v-model="form.department" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="contactEmail" class="block text-gray-700 mb-2">E-Mail*</label>
                  <input type="email" id="contactEmail" v-model="form.contactEmail" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                
                <div>
                  <label for="contactPhone" class="block text-gray-700 mb-2">Telefon*</label>
                  <input type="tel" id="contactPhone" v-model="form.contactPhone" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>
            
            <!-- Position Information -->
            <div>
              <h3 class="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Informationen zur Stellenanfrage</h3>
              <div class="space-y-6">
                <div>
                  <label for="specialty" class="block text-gray-700 mb-2">Gesuchte Fachrichtung*</label>
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
                  <label for="positionType" class="block text-gray-700 mb-2">Art der Position*</label>
                  <select id="positionType" v-model="form.positionType" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Bitte wählen</option>
                    <option value="Chefarzt">Chefarzt</option>
                    <option value="Oberarzt">Oberarzt</option>
                    <option value="Facharzt">Facharzt</option>
                    <option value="Assistenzarzt">Assistenzarzt</option>
                    <option value="Honorararzt">Honorararzt</option>
                  </select>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="employmentType" class="block text-gray-700 mb-2">Beschäftigungsart*</label>
                    <select id="employmentType" v-model="form.employmentType" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="">Bitte wählen</option>
                      <option value="Vollzeit">Vollzeit</option>
                      <option value="Teilzeit">Teilzeit</option>
                      <option value="Honorararzt">Honorararzt</option>
                      <option value="Vertretung">Vertretung</option>
                      <option value="Wochenend-/Nachtdienst">Wochenend-/Nachtdienst</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="duration" class="block text-gray-700 mb-2">Dauer*</label>
                    <select id="duration" v-model="form.duration" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="">Bitte wählen</option>
                      <option value="Unbefristet">Unbefristet</option>
                      <option value="Befristet mit Aussicht auf Entfristung">Befristet mit Aussicht auf Entfristung</option>
                      <option value="Befristet">Befristet</option>
                      <option value="Kurzfristig / Einmalig">Kurzfristig / Einmalig</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label for="requiredQualifications" class="block text-gray-700 mb-2">Erforderliche Qualifikationen</label>
                  <textarea id="requiredQualifications" v-model="form.requiredQualifications" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                </div>
                
                <div>
                  <label for="jobDescription" class="block text-gray-700 mb-2">Stellenbeschreibung*</label>
                  <textarea id="jobDescription" v-model="form.jobDescription" required rows="4" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="startDate" class="block text-gray-700 mb-2">Startdatum*</label>
                    <input type="date" id="startDate" v-model="form.startDate" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  
                  <div>
                    <label for="salary" class="block text-gray-700 mb-2">Gehalt/Vergütung (optional)</label>
                    <input type="text" id="salary" v-model="form.salary" placeholder="z.B. nach Tarif oder VB" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
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
                <input type="checkbox" id="terms" v-model="form.termsAccepted" required class="mt-1 mr-2" />
                <label for="terms" class="text-sm text-gray-600">
                  Ich akzeptiere die <router-link to="/terms" class="text-primary hover:underline">Allgemeinen Geschäftsbedingungen</router-link> und bin damit einverstanden, dass bei erfolgreicher Vermittlung eine Gebühr anfällt.*
                </label>
              </div>
            </div>
            
            <div class="text-center">
              <button type="submit" class="bg-dark text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-primary transition-colors duration-300">
                Anfrage absenden
              </button>
            </div>
            
            <p class="text-sm text-gray-500 text-center">* Pflichtfelder</p>
          </form>
          
          <div v-if="formSubmitted" class="mt-8 p-4 bg-green-100 text-green-800 rounded-lg">
            <p class="font-semibold">Vielen Dank für Ihre Anfrage!</p>
            <p>Wir haben Ihre Daten erhalten und werden uns umgehend um Ihre Anfrage kümmern.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  hospitalName: '',
  hospitalType: '',
  street: '',
  zip: '',
  city: '',
  website: '',
  contactFirstName: '',
  contactLastName: '',
  position: '',
  department: '',
  contactEmail: '',
  contactPhone: '',
  specialty: '',
  positionType: '',
  employmentType: '',
  duration: '',
  requiredQualifications: '',
  jobDescription: '',
  startDate: '',
  salary: '',
  privacyPolicyAccepted: false,
  termsAccepted: false
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