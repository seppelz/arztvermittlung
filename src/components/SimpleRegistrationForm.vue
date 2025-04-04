<template>
  <div class="bg-white rounded-lg shadow-strong p-6">
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
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

// Define the registration data interface
interface RegistrationData {
  name: string;
  email: string;
  password: string;
  privacyPolicyAccepted: boolean;
  termsAccepted: boolean;
  role: 'user' | 'admin' | 'doctor' | 'hospital';
  userType: 'Arzt' | 'Klinik';
  username: string;
}

const props = defineProps<{
  userType: 'Arzt' | 'Klinik';
}>();

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
    const userData: RegistrationData = {
      ...formData,
      role: props.userType === 'Arzt' ? 'doctor' : 'hospital', // Set the correct role based on userType
      userType: props.userType,
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
