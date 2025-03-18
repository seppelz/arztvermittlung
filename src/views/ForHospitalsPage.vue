<template>
  <div>
    <section class="bg-dark text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Für Kliniken/Einrichtungen</h1>
        <p class="text-xl max-w-2xl">
          Finden Sie qualifizierte Ärzte ohne teure Vermittlungsagenturen. 
          Bei MedMatch zahlen Sie nur bei erfolgreicher Vermittlung eine faire Gebühr.
        </p>
      </div>
    </section>

    <section class="py-12 bg-light">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-strong p-8">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center text-heading">Stellengesuch aufgeben</h2>
          
          <form @submit.prevent="submitForm" class="space-y-8">
            <!-- Hospital Information -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Informationen zur Einrichtung</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label for="hospitalName" class="block text-text-dark font-semibold mb-2">Name der Einrichtung/Klinik (Ansprechpartner) *</label>
                  <input 
                    type="text" 
                    id="hospitalName" 
                    v-model="form.hospitalName"
                    required 
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  />
                </div>
                
                <!-- Email field -->
                <div class="md:col-span-2">
                  <label for="contactEmail" class="block text-text-dark font-semibold mb-2">E-Mail-Adresse *</label>
                  <input 
                    type="email" 
                    id="contactEmail" 
                    v-model="form.contactEmail" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                    placeholder="Ihre E-Mail-Adresse für Rückmeldungen"
                  />
                </div>

                <!-- Federal State field -->
                <div class="md:col-span-2">
                  <label for="federalState" class="block text-text-dark font-semibold mb-2">Bundesland *</label>
                  <select 
                    id="federalState" 
                    v-model="form.federalState" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  >
                    <option value="">Bitte wählen Sie</option>
                    <option value="Baden-Württemberg">Baden-Württemberg</option>
                    <option value="Bayern">Bayern</option>
                    <option value="Berlin">Berlin</option>
                    <option value="Brandenburg">Brandenburg</option>
                    <option value="Bremen">Bremen</option>
                    <option value="Hamburg">Hamburg</option>
                    <option value="Hessen">Hessen</option>
                    <option value="Mecklenburg-Vorpommern">Mecklenburg-Vorpommern</option>
                    <option value="Niedersachsen">Niedersachsen</option>
                    <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
                    <option value="Rheinland-Pfalz">Rheinland-Pfalz</option>
                    <option value="Saarland">Saarland</option>
                    <option value="Sachsen">Sachsen</option>
                    <option value="Sachsen-Anhalt">Sachsen-Anhalt</option>
                    <option value="Schleswig-Holstein">Schleswig-Holstein</option>
                    <option value="Thüringen">Thüringen</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Position Information -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Informationen zur Stellenanfrage</h3>
              <div class="space-y-6">
                <div>
                  <label for="specialty" class="block text-text-dark font-semibold mb-2">Gesuchte Fachrichtung *</label>
                  <input 
                    type="text" 
                    id="specialty" 
                    v-model="form.specialty"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                    placeholder="Gewünschte Fachrichtung des Arztes" 
                  />
                </div>
                
                <div>
                  <label for="requiredQualifications" class="block text-text-dark font-semibold mb-2">Erforderliche Qualifikationen</label>
                  <textarea id="requiredQualifications" v-model="form.requiredQualifications" rows="3" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"></textarea>
                </div>
                
                <div>
                  <label for="jobDescription" class="block text-text-dark font-semibold mb-2">Stellenbeschreibung *</label>
                  <textarea 
                    id="jobDescription" 
                    v-model="form.jobDescription"
                    required
                    rows="4" 
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  ></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="startDate" class="block text-text-dark font-semibold mb-2">Startdatum *</label>
                    <input 
                      type="date" 
                      id="startDate" 
                      v-model="form.startDate"
                      required
                      class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                    />
                  </div>
                  
                  <div>
                    <label for="salary" class="block text-text-dark font-semibold mb-2">Gehalt/Vergütung (optional)</label>
                    <input type="text" id="salary" v-model="form.salary" placeholder="z.B. nach Tarif oder VB" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Privacy -->
            <div class="space-y-4">
              <div class="flex items-start">
                <input type="checkbox" id="privacyPolicy" v-model="form.privacyPolicyAccepted" required class="mt-1 mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" />
                <label for="privacyPolicy" class="text-sm text-gray-700">
                  Ich habe die <router-link to="/privacy" class="text-primary hover:underline font-medium">Datenschutzerklärung</router-link> gelesen und akzeptiere diese.*
                </label>
              </div>
              
              <div class="flex items-start">
                <input type="checkbox" id="terms" v-model="form.termsAccepted" required class="mt-1 mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" />
                <label for="terms" class="text-sm text-gray-700">
                  Ich akzeptiere die <router-link to="/terms" class="text-primary hover:underline font-medium">Allgemeinen Geschäftsbedingungen</router-link> und bin damit einverstanden, dass bei erfolgreicher Vermittlung eine Gebühr anfällt.*
                </label>
              </div>
            </div>
            
            <div class="text-center">
              <button 
                type="submit" 
                class="bg-dark hover:bg-primary-dark text-white font-bold py-3 px-10 rounded-lg shadow-strong transition-colors duration-300 text-lg transform hover:scale-105"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Wird gesendet...' : 'Anfrage absenden' }}
              </button>
            </div>
            
            <p class="text-sm text-gray-500 text-center">* Pflichtfelder</p>
          </form>
          
          <div v-if="formSubmitted" class="mt-8 p-6 bg-success bg-opacity-10 text-success rounded-lg border-2 border-success">
            <p class="font-semibold text-lg">Vielen Dank für Ihre Anfrage!</p>
            <p>Wir haben Ihre Daten erhalten und werden uns umgehend um Ihre Anfrage kümmern.</p>
          </div>
          
          <div v-if="submitError" class="mt-8 p-6 bg-red-100 text-red-700 rounded-lg border-2 border-red-300">
            <p class="font-semibold text-lg">Fehler bei der Übermittlung</p>
            <p>{{ submitError }}</p>
            <p class="mt-2 text-sm">Bitte versuchen Sie es später erneut oder kontaktieren Sie unseren Support.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import bulletinService from '@/services/bulletin.service'

const form = reactive({
  hospitalName: '',
  contactEmail: '',
  federalState: '',
  specialty: '',
  requiredQualifications: '',
  jobDescription: '',
  startDate: new Date().toISOString().split('T')[0], // Heutiges Datum als Standard
  salary: '',
  privacyPolicyAccepted: false,
  termsAccepted: false
})

const formSubmitted = ref(false)
const submitError = ref(null)
const isSubmitting = ref(false)

async function submitForm() {
  isSubmitting.value = true
  submitError.value = null
  
  try {
    // Check required fields
    if (!form.hospitalName || !form.contactEmail || !form.jobDescription || !form.specialty || !form.federalState || !form.startDate) {
      submitError.value = 'Bitte füllen Sie alle erforderlichen Felder aus.'
      isSubmitting.value = false
      return
    }
    
    if (!form.privacyPolicyAccepted) {
      submitError.value = 'Bitte akzeptieren Sie die Datenschutzerklärung, um fortzufahren.'
      isSubmitting.value = false
      return
    }
    
    // Generate a title based on specialty and start date
    const formattedDate = form.startDate ? new Date(form.startDate).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : 'flexibel'
    
    const generatedTitle = `Klinik sucht ab ${formattedDate}${form.specialty ? ' Arzt der Fachrichtung ' + form.specialty : ' Arzt'}`
    
    // Prepare the bulletin data
    const bulletinData = {
      title: generatedTitle,
      name: form.hospitalName,
      email: form.contactEmail,
      content: form.jobDescription,
      specialty: form.specialty,
      userType: 'Klinik',
      messageType: 'Angebot',
      startDate: form.startDate,
      federalState: form.federalState,
      phone: '',
      requiredQualifications: form.requiredQualifications || '',
      salary: form.salary || '',
      privacyPolicyAccepted: form.privacyPolicyAccepted,
      status: 'pending',
      timestamp: new Date()
    }
    
    console.log('Submitting data to backend:', bulletinData)
    
    // Send the data to the backend
    const response = await bulletinService.createBulletin(bulletinData)
    console.log('Response from backend:', response)
    
    // Show success message
    formSubmitted.value = true
    
    // Reset form after submission
    Object.keys(form).forEach(key => {
      if (typeof form[key] === 'boolean') {
        form[key] = false
      } else if (key === 'startDate') {
        form[key] = new Date().toISOString().split('T')[0] // Reset to today's date
      } else {
        form[key] = ''
      }
    })
    
  } catch (error) {
    console.error('Error submitting form:', error)
    
    // Extract detailed error message if available
    let errorMessage = 'Fehler beim Speichern Ihrer Anfrage.'
    
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error
      }
      
      // Check for validation errors
      if (error.response.data.errors) {
        const validationErrors = error.response.data.errors
        errorMessage = 'Validierungsfehler: ' + Object.values(validationErrors).join(', ')
      }
    }
    
    submitError.value = errorMessage + ' Bitte versuchen Sie es später erneut.'
  } finally {
    isSubmitting.value = false
  }
}
</script> 