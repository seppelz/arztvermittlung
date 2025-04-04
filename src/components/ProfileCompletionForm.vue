<template>
  <div class="bg-white rounded-lg shadow-strong p-6">
    <div v-if="successMessage" class="p-4 bg-success bg-opacity-10 text-success rounded-lg border-2 border-success mb-4">
      <p class="font-semibold">{{ successMessage }}</p>
    </div>

    <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg border-2 border-red-200 mb-4">
      <p class="font-semibold">Fehler beim Speichern:</p>
      <p>{{ error }}</p>
    </div>

    <form v-if="!successMessage" @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Common fields for both doctor and hospital -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="name" class="block text-text-dark font-semibold mb-2">Name / Einrichtung *</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            required
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
          />
        </div>
        
        <div>
          <label for="email" class="block text-text-dark font-semibold mb-2">E-Mail *</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required 
            disabled
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700" 
          />
          <p class="text-sm text-gray-500 mt-1">E-Mail kann nicht geändert werden</p>
        </div>
      </div>

      <!-- Doctor specific fields -->
      <div v-if="userType === 'Arzt'" class="space-y-6">
        <h3 class="text-xl font-semibold text-gray-900 border-b pb-2">Arztprofil vervollständigen</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="title" class="block text-text-dark font-semibold mb-2">Titel</label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.title" 
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
              placeholder="z.B. Dr. med., Prof. Dr."
            />
          </div>
          
          <div>
            <label for="specialty" class="block text-text-dark font-semibold mb-2">Fachrichtung *</label>
            <select
              id="specialty"
              v-model="formData.specialty"
              required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
            >
              <option value="" disabled>Bitte wählen</option>
              <option value="Allgemeinmedizin">Allgemeinmedizin</option>
              <option value="Anästhesiologie">Anästhesiologie</option>
              <option value="Chirurgie">Chirurgie</option>
              <option value="Gynäkologie">Gynäkologie</option>
              <option value="Innere Medizin">Innere Medizin</option>
              <option value="Kardiologie">Kardiologie</option>
              <option value="Neurologie">Neurologie</option>
              <option value="Orthopädie">Orthopädie</option>
              <option value="Pädiatrie">Pädiatrie</option>
              <option value="Psychiatrie">Psychiatrie</option>
              <option value="Radiologie">Radiologie</option>
              <option value="Urologie">Urologie</option>
              <option value="Andere">Andere</option>
            </select>
          </div>
          
          <div>
            <label for="experience" class="block text-text-dark font-semibold mb-2">Berufserfahrung (Jahre) *</label>
            <input 
              type="number" 
              id="experience" 
              v-model="formData.experience" 
              required
              min="0"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            />
          </div>
          
          <div>
            <label for="phone" class="block text-text-dark font-semibold mb-2">Telefon</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.phone" 
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            />
          </div>
        </div>
        
        <div>
          <label class="block text-text-dark font-semibold mb-2">Verfügbarkeit *</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label for="availableFrom" class="block text-text-dark font-semibold mb-2">Verfügbar ab</label>
              <input 
                type="date" 
                id="availableFrom" 
                v-model="formData.availableFrom" 
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
              />
            </div>
            
            <div>
              <label for="federalState" class="block text-text-dark font-semibold mb-2">Bevorzugtes Bundesland</label>
              <select
                id="federalState"
                v-model="formData.federalState"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
              >
                <option value="" disabled>Bitte wählen</option>
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
                <option value="Deutschlandweit">Deutschlandweit</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <label for="qualifications" class="block text-text-dark font-semibold mb-2">Qualifikationen</label>
          <textarea 
            id="qualifications" 
            v-model="formData.qualifications" 
            rows="3"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            placeholder="Facharzt, spezielle Zertifikate, etc."
          ></textarea>
        </div>
        
        <div>
          <label for="additionalInfo" class="block text-text-dark font-semibold mb-2">Weitere Informationen</label>
          <textarea 
            id="additionalInfo" 
            v-model="formData.additionalInfo" 
            rows="4"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            placeholder="Beschreiben Sie Ihre berufliche Erfahrung, Interessen oder besondere Fähigkeiten."
          ></textarea>
        </div>
      </div>
      
      <!-- Hospital specific fields -->
      <div v-if="userType === 'Klinik'" class="space-y-6">
        <h3 class="text-xl font-semibold text-gray-900 border-b pb-2">Klinikprofil vervollständigen</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="type" class="block text-text-dark font-semibold mb-2">Art der Einrichtung *</label>
            <select
              id="type"
              v-model="formData.type"
              required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
            >
              <option value="" disabled>Bitte wählen</option>
              <option value="Krankenhaus">Krankenhaus</option>
              <option value="Universitätsklinik">Universitätsklinik</option>
              <option value="Fachklinik">Fachklinik</option>
              <option value="Rehaklinik">Rehaklinik</option>
              <option value="MVZ">Medizinisches Versorgungszentrum (MVZ)</option>
              <option value="Praxis">Praxis</option>
              <option value="Andere">Andere</option>
            </select>
          </div>
          
          <div>
            <label for="size" class="block text-text-dark font-semibold mb-2">Größe (Betten)</label>
            <input 
              type="number" 
              id="size" 
              v-model="formData.size" 
              min="0"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            />
          </div>
          
          <div>
            <label for="contact" class="block text-text-dark font-semibold mb-2">Ansprechpartner *</label>
            <input 
              type="text" 
              id="contact" 
              v-model="formData.contactPerson" 
              required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            />
          </div>
          
          <div>
            <label for="phone" class="block text-text-dark font-semibold mb-2">Telefon *</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.phone" 
              required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label class="block text-text-dark font-semibold mb-2">Adresse *</label>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="street" class="block text-text-dark font-semibold mb-2">Straße, Hausnummer</label>
                  <input 
                    type="text" 
                    id="street" 
                    v-model="formData.street" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  />
                </div>
                
                <div>
                  <label for="zipCity" class="block text-text-dark font-semibold mb-2">PLZ, Ort</label>
                  <div class="flex gap-2">
                    <input 
                      type="text" 
                      id="zip" 
                      v-model="formData.zip" 
                      required
                      class="w-1/3 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                      placeholder="PLZ"
                    />
                    <input 
                      type="text" 
                      id="city" 
                      v-model="formData.city" 
                      required
                      class="w-2/3 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                      placeholder="Ort"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label for="website" class="block text-text-dark font-semibold mb-2">Website</label>
            <input 
              type="url" 
              id="website" 
              v-model="formData.website" 
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
              placeholder="https://www.example.com"
            />
          </div>
          
          <div>
            <label for="specialties" class="block text-text-dark font-semibold mb-2">Fachrichtungen *</label>
            <textarea 
              id="specialties" 
              v-model="formData.specialties" 
              required
              rows="3"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
              placeholder="Innere Medizin, Chirurgie, Anästhesie, etc."
            ></textarea>
          </div>
          
          <div>
            <label for="description" class="block text-text-dark font-semibold mb-2">Beschreibung der Einrichtung</label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              rows="4"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
              placeholder="Beschreiben Sie Ihre Einrichtung, Besonderheiten, Arbeitsumfeld, etc."
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- Submit Button -->
      <div class="text-center">
        <button 
          type="submit" 
          class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-strong transition-colors duration-300 text-lg transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Wird gespeichert...' : 'Profil speichern' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const props = defineProps<{
  userType: 'Arzt' | 'Klinik';
  existingData?: any;
}>();

const emit = defineEmits<{
  (e: 'update:doctor', profile: any): void;
  (e: 'update:hospital', profile: any): void;
}>();

const authStore = useAuthStore();

// Form data structure that changes based on userType
const formData = reactive(initializeFormData());

const error = ref<string>('');
const successMessage = ref<string>('');
const isSubmitting = ref<boolean>(false);

// Initialize form data based on user type and existing data
function initializeFormData() {
  const baseData = {
    name: '',
    email: ''
  };
  
  if (props.userType === 'Arzt') {
    return {
      ...baseData,
      title: '',
      specialty: '',
      experience: null,
      phone: '',
      availableFrom: new Date().toISOString().split('T')[0],
      federalState: '',
      qualifications: '',
      additionalInfo: ''
    };
  } else {
    return {
      ...baseData,
      type: '',
      size: null,
      contactPerson: '',
      phone: '',
      street: '',
      zip: '',
      city: '',
      website: '',
      specialties: '',
      description: ''
    };
  }
}

// Populate form with existing data if available
onMounted(() => {
  if (authStore.user) {
    formData.email = authStore.user.email || '';
    
    // If existing data was passed, populate the form
    if (props.existingData) {
      Object.keys(formData).forEach(key => {
        if (props.existingData[key] !== undefined) {
          // Handle nested properties if necessary
          if (key === 'federalState' && props.existingData.availability) {
            formData[key] = props.existingData.availability.federalState;
          } else if (key === 'street' && props.existingData.address) {
            formData[key] = props.existingData.address.street;
          } else if (key === 'zip' && props.existingData.address) {
            formData[key] = props.existingData.address.zip;
          } else if (key === 'city' && props.existingData.address) {
            formData[key] = props.existingData.address.city;
          } else {
            formData[key] = props.existingData[key];
          }
        }
      });
    }
  }
});

const handleSubmit = async (): Promise<void> => {
  error.value = '';
  isSubmitting.value = true;
  
  try {
    let profileData: any;
    let endpoint: string;
    
    if (props.userType === 'Arzt') {
      profileData = {
        name: formData.name,
        title: formData.title,
        specialty: formData.specialty,
        experience: formData.experience,
        contact: {
          phone: formData.phone,
          email: formData.email
        },
        availability: {
          from: formData.availableFrom,
          federalState: formData.federalState
        },
        qualifications: formData.qualifications,
        additionalInfo: formData.additionalInfo
      };
      endpoint = '/doctor/profile';
    } else {
      profileData = {
        name: formData.name,
        type: formData.type,
        size: formData.size,
        contact: {
          person: formData.contactPerson,
          phone: formData.phone,
          email: formData.email
        },
        address: {
          street: formData.street,
          zip: formData.zip,
          city: formData.city
        },
        website: formData.website,
        specialties: formData.specialties.split(',').map(s => s.trim()),
        description: formData.description
      };
      endpoint = '/hospital/profile';
    }
    
    // Make API request with axios to ensure credentials are properly sent
    const response = await api.post(endpoint, profileData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response && response.data) {
      // Show success message
      successMessage.value = 'Profil erfolgreich gespeichert!';
      
      // Emit the updated profile to parent component
      if (props.userType === 'Arzt') {
        emit('update:doctor', response.data);
      } else {
        emit('update:hospital', response.data);
      }
    }
  } catch (err: any) {
    console.error('Profile update error:', err);
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
