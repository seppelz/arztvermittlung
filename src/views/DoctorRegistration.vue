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
        <!-- Benefits section -->
        <div class="max-w-5xl mx-auto mb-16">
          <h2 class="text-3xl font-bold mb-8 text-center text-heading">Ihre Vorteile als registrierter Arzt</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-heading">Stellengesuche erstellen</h3>
              <p class="text-gray-600">Veröffentlichen Sie Ihre Stellengesuche und werden Sie von passenden Kliniken gefunden.</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-heading">Stellenangebote ansehen</h3>
              <p class="text-gray-600">Durchsuchen Sie aktuelle Stellenangebote von Kliniken und nehmen Sie direkt Kontakt auf.</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-heading">Profil vervollständigen</h3>
              <p class="text-gray-600">Vervollständigen Sie Ihr Profil nach der Registrierung und erhöhen Sie Ihre Chancen auf Vermittlung.</p>
            </div>
          </div>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="mb-8 p-5 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 mb-3">So funktioniert's nach der Registrierung:</h3>
            <ol class="list-decimal pl-5 space-y-2 text-blue-700">
              <li><strong>Login:</strong> Melden Sie sich nach der Registrierung mit Ihren Zugangsdaten an</li>
              <li><strong>Profil vervollständigen:</strong> Ergänzen Sie Ihre Fachrichtung, Qualifikationen und Verfügbarkeit</li>
              <li><strong>Stellengesuch erstellen:</strong> Erstellen Sie ein neues Gesuch auf der Stellenbörse oder dem Schwarzen Brett</li>
              <li><strong>Kontakte knüpfen:</strong> Reagieren Sie auf Angebote von Kliniken und finden Sie Ihre neue Stelle</li>
            </ol>
          </div>
          
          <div class="bg-white rounded-lg shadow-strong p-8">
            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center text-heading">Als Arzt registrieren</h2>
            <p class="text-center text-gray-600 mb-8">Erstellen Sie Ihr Konto in wenigen Schritten - Sie können Ihr Profil später vervollständigen.</p>

            <div v-if="successMessage" class="p-4 bg-success bg-opacity-10 text-success rounded-lg border-2 border-success mb-4">
              <p class="font-semibold">{{ successMessage }}</p>
              <div class="mt-4 text-center">
                <router-link to="/login" class="inline-block bg-success text-white font-medium py-2 px-6 rounded-lg hover:bg-success-dark transition-colors">
                  Zum Login
                </router-link>
              </div>
            </div>

            <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg border-2 border-red-200 mb-4">
              <p class="font-semibold">Fehler bei der Registrierung:</p>
              <p>{{ error }}</p>
            </div>

            <form v-if="!successMessage" @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name field -->
              <div>
                <label for="name" class="block text-text-dark font-semibold mb-2">Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="formData.name" 
                  required
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  placeholder="Ihr vollständiger Name" 
                />
              </div>
              
              <!-- Email field -->
              <div>
                <label for="email" class="block text-text-dark font-semibold mb-2">E-Mail *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email" 
                  required 
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  placeholder="Ihre E-Mail-Adresse"
                />
              </div>
              
              <!-- Password field -->
              <div>
                <label for="password" class="block text-text-dark font-semibold mb-2">Passwort *</label>
                <input 
                  type="password" 
                  id="password" 
                  v-model="formData.password" 
                  required 
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-dark bg-white shadow-sm" 
                  placeholder="Mindestens 8 Zeichen"
                />
                <p class="text-sm text-gray-500 mt-1">Mindestens 8 Zeichen mit Groß- und Kleinbuchstaben und mindestens einer Zahl</p>
              </div>

              <!-- Privacy Policy acceptance -->
              <div class="flex items-start mt-6">
                <input 
                  type="checkbox" 
                  id="privacyPolicy" 
                  v-model="formData.privacyPolicyAccepted" 
                  required 
                  class="mt-1 mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" 
                />
                <label for="privacyPolicy" class="text-sm text-gray-700">
                  Ich habe die <router-link to="/privacy" class="text-primary hover:underline font-medium">Datenschutzerklärung</router-link> gelesen und akzeptiere diese.*
                </label>
              </div>
              
              <!-- Terms acceptance -->
              <div class="flex items-start">
                <input 
                  type="checkbox" 
                  id="termsAccepted" 
                  v-model="formData.termsAccepted" 
                  required 
                  class="mt-1 mr-2 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary" 
                />
                <label for="termsAccepted" class="text-sm text-gray-700">
                  Ich akzeptiere die <router-link to="/terms" class="text-primary hover:underline font-medium">Allgemeinen Geschäftsbedingungen</router-link>.*
                </label>
              </div>
              
              <!-- Submit Button -->
              <div class="text-center">
                <button 
                  type="submit" 
                  class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-strong transition-colors duration-300 text-lg transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Wird registriert...' : 'Jetzt registrieren' }}
                </button>
              </div>
              
              <p class="text-sm text-gray-500 text-center">* Pflichtfelder</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service';

interface FormData {
  name: string;
  email: string;
  password: string;
  privacyPolicyAccepted: boolean;
  termsAccepted: boolean;
}

interface RegisterError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const router = useRouter();

const formData = reactive<FormData>({
  name: '',
  email: '',
  password: '',
  privacyPolicyAccepted: false,
  termsAccepted: false
});

const error = ref<string>('');
const successMessage = ref<string>('');
const isSubmitting = ref<boolean>(false);

const handleSubmit = async (): Promise<void> => {
  error.value = '';
  isSubmitting.value = true;
  
  try {
    // Map userType properly according to backend expectations
    const userData = {
      ...formData,
      role: 'user',
      userType: 'Arzt',
      username: formData.email.split('@')[0] // Generate a username from email
    };
    
    await authService.register(userData);
    
    // Show success message
    successMessage.value = 'Registrierung erfolgreich! Sie können sich jetzt anmelden und Ihr Profil vervollständigen.';
    
    // Reset form
    Object.keys(formData).forEach(key => {
      (formData as any)[key] = '';
    });
    
  } catch (err: unknown) {
    console.error('Registration error:', err);
    const error_obj = err as RegisterError;
    if (error_obj.response?.data?.message) {
      error.value = error_obj.response.data.message;
    } else {
      error.value = 'Ein Fehler ist bei der Registrierung aufgetreten. Bitte versuchen Sie es später erneut.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
