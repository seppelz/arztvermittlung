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
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center text-heading">Gesuch aufgeben</h2>
          
          <form @submit.prevent="submitForm" class="space-y-8">
            <!-- Personal Information -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Persönliche Informationen</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="specialty" class="block text-text-dark font-semibold mb-2">Fachrichtung *</label>
                  <input 
                    type="text" 
                    id="specialty" 
                    v-model="form.specialty" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                    placeholder="Ihre Fachrichtung" 
                  />
                </div>
                
                <div>
                  <label for="name" class="block text-text-dark font-semibold mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name" 
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  />
                </div>
                
                <div>
                  <label for="email" class="block text-text-dark font-semibold mb-2">E-Mail *</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="form.email" 
                    required 
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  />
                </div>
                
                <div>
                  <label for="phone" class="block text-text-dark font-semibold mb-2">Telefon</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="form.phone" 
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  />
                </div>
                
                <div>
                  <label for="federalState" class="block text-text-dark font-semibold mb-2">Bevorzugtes Bundesland</label>
                  <select 
                    id="federalState" 
                    v-model="form.federalState" 
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
                  >
                    <option value="">Bitte wählen Sie (optional)</option>
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
            
            <!-- Professional Information -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Berufliche Informationen</h3>
              <div class="space-y-6">
                <div>
                  <label class="block text-text-dark font-semibold mb-2">Qualifikationen und Zusatzbezeichnungen</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="(qualification, index) in qualifications" :key="index" class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="'qualification-' + index" 
                        v-model="form.qualifications" 
                        :value="qualification" 
                        class="mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" 
                      />
                      <label :for="'qualification-' + index" class="cursor-pointer text-text-dark">{{ qualification }}</label>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Weitere Qualifikationen" 
                    v-model="form.otherQualifications" 
                    class="w-full px-4 py-3 mt-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  />
                </div>
              </div>
            </div>
            
            <!-- Availability -->
            <div>
              <h3 class="text-xl font-bold mb-6 pb-2 border-b-2 border-accent text-heading">Verfügbarkeit</h3>
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="availableFrom" class="block text-text-dark font-medium mb-2">Verfügbar ab *</label>
                    <input 
                      type="date" 
                      id="availableFrom" 
                      v-model="form.availableFrom" 
                      required 
                      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" 
                    />
                  </div>
                </div>
                
                <div>
                  <label for="additionalInfo" class="block text-text-dark font-medium mb-2">Weitere Informationen *</label>
                  <textarea 
                    id="additionalInfo" 
                    v-model="form.additionalInfo" 
                    required
                    rows="4" 
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- Privacy -->
            <div class="space-y-4">
              <div class="flex items-start">
                <input 
                  type="checkbox" 
                  id="privacyPolicy" 
                  v-model="form.privacyPolicyAccepted" 
                  required 
                  class="mt-1 mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" 
                />
                <label for="privacyPolicy" class="text-sm text-gray-700">
                  Ich habe die <router-link to="/privacy" class="text-primary hover:underline font-medium">Datenschutzerklärung</router-link> gelesen und akzeptiere diese.*
                </label>
              </div>
              
              <div class="flex items-start">
                <input 
                  type="checkbox" 
                  id="terms" 
                  v-model="form.termsAccepted" 
                  required 
                  class="mt-1 mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" 
                />
                <label for="terms" class="text-sm text-gray-700">
                  Ich akzeptiere die <router-link to="/terms" class="text-primary hover:underline font-medium">Allgemeinen Geschäftsbedingungen</router-link>.*
                </label>
              </div>
              
              <div class="flex items-start">
                <input 
                  type="checkbox" 
                  id="marketing" 
                  v-model="form.marketingAccepted" 
                  class="mt-1 mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" 
                />
                <label for="marketing" class="text-sm text-gray-700">
                  Ich möchte über passende Stellenangebote per E-Mail informiert werden.
                </label>
              </div>
            </div>
            
            <div class="text-center">
              <button 
                type="submit" 
                class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-10 rounded-lg shadow-strong transition-colors duration-300 text-lg"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Wird gesendet...' : 'Gesuch aufgeben' }}
              </button>
            </div>
            
            <p class="text-sm text-gray-500 text-center">* Pflichtfelder</p>
          </form>
          
          <div v-if="formSubmitted" class="mt-8 p-6 bg-success bg-opacity-10 text-success rounded-lg border-2 border-success">
            <p class="font-semibold text-lg">Vielen Dank für Ihre Anfrage!</p>
            <p>Wir haben Ihre Daten erhalten und Sie können Ihr Gesuch jetzt in der Stellenbörse einsehen.</p>
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

<script setup lang="ts">
import { ref, reactive } from 'vue'
import bulletinProxyService from '@/services/bulletinProxyService'
import { Bulletin } from '@/types'

interface DoctorForm {
  specialty: string;
  name: string;
  email: string;
  phone: string;
  federalState: string;
  qualifications: string[];
  otherQualifications: string;
  availableFrom: string;
  additionalInfo: string;
  privacyPolicyAccepted: boolean;
  termsAccepted: boolean;
  marketingAccepted: boolean;
}

const qualifications: string[] = [
  'Facharzt',
  'Oberarzt',
  'Notfallmedizin',
  'Intensivmedizin',
  'Palliativmedizin',
  'Schmerztherapie',
  'Sonographie',
  'Endoskopie'
]

const form = reactive<DoctorForm>({
  specialty: '',
  name: '',
  email: '',
  phone: '',
  federalState: '',
  qualifications: [],
  otherQualifications: '',
  availableFrom: new Date().toISOString().split('T')[0], // Heutiges Datum als Standard
  additionalInfo: '',
  privacyPolicyAccepted: false,
  termsAccepted: false,
  marketingAccepted: false
})

const formSubmitted = ref<boolean>(false)
const submitError = ref<string | null>(null)
const isSubmitting = ref<boolean>(false)

async function submitForm(): Promise<void> {
  isSubmitting.value = true
  submitError.value = null
  
  try {
    // Check required fields
    if (!form.specialty || !form.email || !form.availableFrom || !form.additionalInfo) {
      submitError.value = 'Bitte füllen Sie alle erforderlichen Felder aus.'
      isSubmitting.value = false
      return
    }
    
    if (!form.privacyPolicyAccepted || !form.termsAccepted) {
      submitError.value = 'Bitte akzeptieren Sie die Datenschutzerklärung und AGB, um fortzufahren.'
      isSubmitting.value = false
      return
    }
    
    // Prepare qualifications text
    const qualificationsText = [
      ...form.qualifications,
      form.otherQualifications ? form.otherQualifications : ''
    ].filter(Boolean).join(', ')
    
    // Generate a title based on specialty and availability date
    const formattedDate = form.availableFrom ? new Date(form.availableFrom).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : 'flexibel'
    
    const generatedTitle = `Arzt sucht ab ${formattedDate}${form.specialty ? ' Stelle als ' + form.specialty : ''}`
    
    // Prepare the bulletin data
    const bulletinData: Partial<Bulletin> = {
      title: generatedTitle,
      name: form.name || 'Arzt', // Fallback if name is not provided
      email: form.email,
      content: form.additionalInfo,
      specialty: form.specialty,
      messageType: 'Gesuch',
      startDate: new Date(form.availableFrom),
      privacyPolicyAccepted: form.privacyPolicyAccepted,
      status: 'pending'
    }
    
    // Add optional fields
    if (form.phone) {
      (bulletinData as any).phone = form.phone;
    }
    
    if (form.federalState) {
      (bulletinData as any).federalState = form.federalState;
    }
    
    if (qualificationsText) {
      (bulletinData as any).requiredQualifications = qualificationsText;
    }
    
    console.log('Submitting data to backend:', bulletinData)
    
    // Send the data to the backend
    const response = await bulletinProxyService.createBulletin(bulletinData)
    console.log('Response from backend:', response)
    
    // Show success message
    formSubmitted.value = true
    
    // Reset form
    resetForm();
    
  } catch (error: any) {
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

function resetForm(): void {
  form.specialty = '';
  form.name = '';
  form.email = '';
  form.phone = '';
  form.federalState = '';
  form.qualifications = [];
  form.otherQualifications = '';
  form.availableFrom = new Date().toISOString().split('T')[0];
  form.additionalInfo = '';
  form.privacyPolicyAccepted = false;
  form.termsAccepted = false;
  form.marketingAccepted = false;
}
</script> 