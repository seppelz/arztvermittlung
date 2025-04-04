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
          <div v-if="isDoctorFormData(formData)">
            <label for="title" class="block text-text-dark font-semibold mb-2">Titel</label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.title" 
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
              placeholder="z.B. Dr. med., Prof. Dr."
            />
          </div>
          
          <div v-if="isDoctorFormData(formData)">
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
          
          <div v-if="isDoctorFormData(formData)">
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
        
        <div v-if="isDoctorFormData(formData)">
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
        
        <div v-if="isDoctorFormData(formData)">
          <label for="qualifications" class="block text-text-dark font-semibold mb-2">Qualifikationen</label>
          <textarea 
            id="qualifications" 
            v-model="formData.qualifications" 
            rows="3"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            placeholder="Facharzt, spezielle Zertifikate, etc."
          ></textarea>
        </div>
        
        <div v-if="isDoctorFormData(formData)">
          <label for="additionalInfo" class="block text-text-dark font-semibold mb-2">Zusätzliche Informationen</label>
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
          <div v-if="isHospitalFormData(formData)">
            <label for="type" class="block text-text-dark font-semibold mb-2">Art der Einrichtung *</label>
            <select
              id="type"
              v-model="formData.type"
              required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm"
            >
              <option value="" disabled>Bitte wählen</option>
              <option value="Krankenhaus">Krankenhaus</option>
              <option value="Klinik">Klinik</option>
              <option value="MVZ">MVZ</option>
              <option value="Praxis">Praxis</option>
              <option value="Andere">Andere</option>
            </select>
          </div>
          
          <div v-if="isHospitalFormData(formData)">
            <label for="size" class="block text-text-dark font-semibold mb-2">Anzahl der Betten</label>
            <input 
              type="number" 
              id="size" 
              v-model="formData.size" 
              min="0"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            />
          </div>
          
          <div v-if="isHospitalFormData(formData)">
            <label for="contactPerson" class="block text-text-dark font-semibold mb-2">Ansprechpartner</label>
            <input 
              type="text" 
              id="contactPerson" 
              v-model="formData.contactPerson" 
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            />
          </div>
        </div>
        
        <div v-if="isHospitalFormData(formData)">
          <label class="block text-text-dark font-semibold mb-2">Adresse</label>
          <div class="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label for="street" class="block text-text-dark font-semibold mb-2">Straße und Hausnummer *</label>
              <input 
                type="text" 
                id="street" 
                v-model="formData.street" 
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="zip" class="block text-text-dark font-semibold mb-2">PLZ *</label>
                <input 
                  type="text" 
                  id="zip" 
                  v-model="formData.zip" 
                  required
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  placeholder="PLZ"
                />
              </div>
              
              <div>
                <label for="city" class="block text-text-dark font-semibold mb-2">Ort *</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="formData.city" 
                  required
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  placeholder="Ort"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="isHospitalFormData(formData)">
          <label for="website" class="block text-text-dark font-semibold mb-2">Website</label>
          <input 
            type="url" 
            id="website" 
            v-model="formData.website" 
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            placeholder="https://www.example.com"
          />
        </div>
        
        <div v-if="isHospitalFormData(formData)">
          <label for="specialties" class="block text-text-dark font-semibold mb-2">Fachrichtungen *</label>
          <input 
            type="text" 
            id="specialties" 
            v-model="formData.specialties" 
            required
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            placeholder="Innere Medizin, Chirurgie, Anästhesie, etc."
          />
        </div>
        
        <div v-if="isHospitalFormData(formData)">
          <label for="description" class="block text-text-dark font-semibold mb-2">Beschreibung</label>
          <textarea 
            id="description" 
            v-model="formData.description" 
            rows="4"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
            placeholder="Beschreiben Sie Ihre Einrichtung, Besonderheiten, Arbeitsumfeld, etc."
          ></textarea>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Wird gespeichert...' : 'Profil speichern' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const authStore = useAuthStore();
const emit = defineEmits(['update:doctor', 'update:hospital']);

const props = defineProps({
  userType: {
    type: String,
    required: true,
    validator: (value: string) => ['Arzt', 'Klinik'].includes(value)
  },
  existingData: {
    type: Object,
    default: () => ({})
  }
});

// Define interfaces for form data
interface DoctorFormData {
  name: string;
  email: string;
  title: string;
  specialty: string;
  experience: number | null;
  phone: string;
  availableFrom: string;
  federalState: string;
  qualifications: string;
  additionalInfo: string;
}

interface HospitalFormData {
  name: string;
  email: string;
  type: string;
  size: number | null;
  contactPerson: string;
  phone: string;
  street: string;
  zip: string;
  city: string;
  website: string;
  specialties: string;
  description: string;
}

// Initialize form data based on user type
const formData = ref<DoctorFormData | HospitalFormData>(
  props.userType === 'Arzt' 
    ? {
        name: '',
        email: '',
        title: '',
        specialty: '',
        experience: null,
        phone: '',
        availableFrom: new Date().toISOString().split('T')[0],
        federalState: '',
        qualifications: '',
        additionalInfo: ''
      } 
    : {
        name: '',
        email: '',
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
      }
);

const error = ref<string>('');
const successMessage = ref<string>('');
const isSubmitting = ref<boolean>(false);

// Type guards
function isDoctorFormData(formData: DoctorFormData | HospitalFormData): formData is DoctorFormData {
  return 'availableFrom' in formData && 'federalState' in formData;
}

function isHospitalFormData(formData: DoctorFormData | HospitalFormData): formData is HospitalFormData {
  return 'contactPerson' in formData && 'street' in formData;
}

// Populate form with existing data if available
onMounted(() => {
  if (authStore.user) {
    formData.value.email = authStore.user.email || '';
    
    // If existing data was passed, populate the form
    if (props.existingData) {
      if (isDoctorFormData(formData.value)) {
        // Handle doctor form data
        const formDataDoctor = formData.value as DoctorFormData;
        if (props.existingData.title) formDataDoctor.title = props.existingData.title;
        if (props.existingData.specialty) formDataDoctor.specialty = props.existingData.specialty;
        if (props.existingData.experience) formDataDoctor.experience = props.existingData.experience;
        if (props.existingData.contact?.phone) formDataDoctor.phone = props.existingData.contact.phone;
        if (props.existingData.availability?.from) formDataDoctor.availableFrom = props.existingData.availability.from;
        if (props.existingData.availability?.federalState) formDataDoctor.federalState = props.existingData.availability.federalState;
        if (props.existingData.qualifications) formDataDoctor.qualifications = props.existingData.qualifications;
        if (props.existingData.additionalInfo) formDataDoctor.additionalInfo = props.existingData.additionalInfo;
        if (props.existingData.name) formDataDoctor.name = props.existingData.name;
      } else if (isHospitalFormData(formData.value)) {
        // Handle hospital form data
        const formDataHospital = formData.value as HospitalFormData;
        if (props.existingData.type) formDataHospital.type = props.existingData.type;
        if (props.existingData.size) formDataHospital.size = props.existingData.size;
        if (props.existingData.contact?.person) formDataHospital.contactPerson = props.existingData.contact.person;
        if (props.existingData.contact?.phone) formDataHospital.phone = props.existingData.contact.phone;
        if (props.existingData.address?.street) formDataHospital.street = props.existingData.address.street;
        if (props.existingData.address?.zip) formDataHospital.zip = props.existingData.address.zip;
        if (props.existingData.address?.city) formDataHospital.city = props.existingData.address.city;
        if (props.existingData.website) formDataHospital.website = props.existingData.website;
        if (props.existingData.specialties) {
          formDataHospital.specialties = Array.isArray(props.existingData.specialties) 
            ? props.existingData.specialties.join(', ') 
            : props.existingData.specialties;
        }
        if (props.existingData.description) formDataHospital.description = props.existingData.description;
        if (props.existingData.name) formDataHospital.name = props.existingData.name;
      }
    }
  }
});

const handleSubmit = async (): Promise<void> => {
  error.value = '';
  isSubmitting.value = true;
  
  try {
    let profileData: any;
    let endpoint: string;
    
    if (isDoctorFormData(formData.value)) {
      profileData = {
        name: formData.value.name,
        title: formData.value.title,
        specialty: formData.value.specialty,
        experience: formData.value.experience,
        contact: {
          phone: formData.value.phone,
          email: formData.value.email
        },
        availability: {
          from: formData.value.availableFrom,
          federalState: formData.value.federalState
        },
        qualifications: formData.value.qualifications,
        additionalInfo: formData.value.additionalInfo
      };
      endpoint = '/doctor/profile';
    } else {
      profileData = {
        name: formData.value.name,
        type: formData.value.type,
        size: formData.value.size,
        contact: {
          person: formData.value.contactPerson,
          phone: formData.value.phone,
          email: formData.value.email
        },
        address: {
          street: formData.value.street,
          zip: formData.value.zip,
          city: formData.value.city
        },
        website: formData.value.website,
        specialties: formData.value.specialties.split(',').map((s: string) => s.trim()),
        description: formData.value.description
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
