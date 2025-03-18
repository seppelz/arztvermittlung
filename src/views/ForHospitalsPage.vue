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
                  <label for="hospitalName" class="block text-text-dark font-semibold mb-2">Name der Einrichtung/Klinik (Ansprechpartner)</label>
                  <input type="text" id="hospitalName" v-model="form.hospitalName" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
                </div>
                
                <!-- Add email field -->
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
              </div>
            </div>
            
            <!-- Position Information -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Informationen zur Stellenanfrage</h3>
              <div class="space-y-6">
                <div>
                  <label for="specialty" class="block text-text-dark font-semibold mb-2">Gesuchte Fachrichtung</label>
                  <input type="text" id="specialty" v-model="form.specialty" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" placeholder="Gewünschte Fachrichtung des Arztes" />
                </div>
                
                <div>
                  <label for="requiredQualifications" class="block text-text-dark font-semibold mb-2">Erforderliche Qualifikationen</label>
                  <textarea id="requiredQualifications" v-model="form.requiredQualifications" rows="3" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"></textarea>
                </div>
                
                <div>
                  <label for="jobDescription" class="block text-text-dark font-semibold mb-2">Stellenbeschreibung</label>
                  <textarea id="jobDescription" v-model="form.jobDescription" rows="4" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="startDate" class="block text-text-dark font-semibold mb-2">Startdatum</label>
                    <input type="date" id="startDate" v-model="form.startDate" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" />
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
  requiredQualifications: '',
  jobDescription: '',
  startDate: '',
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
      startDate: form.startDate || new Date().toISOString().split('T')[0],
      federalState: '', // Optional field
      requiredQualifications: form.requiredQualifications,
      salary: form.salary,
      privacyPolicyAccepted: form.privacyPolicyAccepted,
      status: 'pending', // New entries start as pending for moderation
      timestamp: new Date()
    }
    
    // Send the data to the backend
    await bulletinService.createBulletin(bulletinData)
    
    // Show success message
    formSubmitted.value = true
    
    // Optional: Reset form after submission
    Object.keys(form).forEach(key => {
      if (typeof form[key] === 'boolean') {
        form[key] = false
      } else {
        form[key] = ''
      }
    })
    
    // Set a default start date
    form.startDate = new Date().toISOString().split('T')[0]
    
  } catch (error) {
    console.error('Error submitting form:', error)
    submitError.value = 'Fehler beim Speichern Ihrer Anfrage. Bitte versuchen Sie es später erneut.'
  } finally {
    isSubmitting.value = false
  }
}
</script> 