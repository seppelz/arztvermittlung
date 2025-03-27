<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full mx-auto space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Registrieren Sie sich bei MedMatch
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Treten Sie unserer Plattform für Arztvermittlung bei
        </p>
      </div>
      
      <div v-if="successMessage" class="rounded-md bg-green-50 p-4 mt-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
          </div>
        </div>
      </div>
      
      <form v-if="!successMessage" class="mt-8 space-y-6 bg-white p-8 shadow rounded-lg" @submit.prevent="handleSubmit">
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>
        
        <!-- Benutzertyp -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ich bin ein/e</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="formData.userType" value="Arzt" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" required>
              <span class="ml-2 text-gray-700">Arzt/Ärztin</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="formData.userType" value="Klinik" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300">
              <span class="ml-2 text-gray-700">Klinik/Praxis</span>
            </label>
          </div>
          <p v-if="v$.formData.userType.$error" class="mt-1 text-sm text-red-600">{{ v$.formData.userType.$errors[0].$message }}</p>
        </div>
        
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <div class="mt-1">
            <input 
              id="name" 
              v-model="formData.name" 
              name="name" 
              type="text" 
              required 
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              :class="{ 'border-red-500': v$.formData.name.$error }"
            >
          </div>
          <p v-if="v$.formData.name.$error" class="mt-1 text-sm text-red-600">{{ v$.formData.name.$errors[0].$message }}</p>
        </div>
        
        <!-- E-Mail -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
          <div class="mt-1">
            <input 
              id="email" 
              v-model="formData.email" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              :class="{ 'border-red-500': v$.formData.email.$error }"
            >
          </div>
          <p v-if="v$.formData.email.$error" class="mt-1 text-sm text-red-600">{{ v$.formData.email.$errors[0].$message }}</p>
        </div>
        
        <!-- Benutzername -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Benutzername</label>
          <div class="mt-1">
            <input 
              id="username" 
              v-model="formData.username" 
              name="username" 
              type="text" 
              required 
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              :class="{ 'border-red-500': v$.formData.username.$error }"
            >
          </div>
          <p v-if="v$.formData.username.$error" class="mt-1 text-sm text-red-600">{{ v$.formData.username.$errors[0].$message }}</p>
        </div>
        
        <!-- Passwort -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Passwort</label>
          <div class="mt-1">
            <input 
              id="password" 
              v-model="formData.password" 
              name="password" 
              type="password" 
              required 
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              :class="{ 'border-red-500': v$.formData.password.$error }"
            >
          </div>
          <p v-if="v$.formData.password.$error" class="mt-1 text-sm text-red-600">{{ v$.formData.password.$errors[0].$message }}</p>
          <p class="mt-1 text-xs text-gray-500">Mindestens 8 Zeichen, mit Groß- und Kleinbuchstaben und Zahlen</p>
        </div>
        
        <div class="mt-4">
          <button 
            type="submit" 
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            :disabled="isSubmitting"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Registrierung läuft...' : 'Registrieren' }}
          </button>
        </div>
        
        <div class="text-sm text-center">
          <p class="text-gray-600">
            Sie können Ihr Profil später vervollständigen.
          </p>
        </div>
      </form>
      
      <div v-if="successMessage" class="text-center">
        <button 
          @click="router.push('/login')" 
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Zum Login
        </button>
        <button 
          @click="router.push('/')" 
          class="mt-4 ml-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Zur Startseite
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';
import authService from '@/services/auth.service';
import { useToast } from '@/composables/useToast';

interface FormData {
  userType: string;
  name: string;
  email: string;
  username: string;
  password: string;
}

interface RegisterUserData extends FormData {
  role: 'user' | 'admin' | 'doctor' | 'hospital';
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
const { showToast } = useToast();

const formData = reactive<FormData>({
  userType: '',
  name: '',
  email: '',
  username: '',
  password: ''
});

const rules = {
  formData: {
    userType: { required: helpers.withMessage('Bitte wählen Sie einen Benutzertyp aus', required) },
    name: { required: helpers.withMessage('Name ist erforderlich', required) },
    email: { 
      required: helpers.withMessage('E-Mail-Adresse ist erforderlich', required),
      email: helpers.withMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein', email)
    },
    username: { required: helpers.withMessage('Benutzername ist erforderlich', required) },
    password: { 
      required: helpers.withMessage('Passwort ist erforderlich', required),
      minLength: helpers.withMessage('Passwort muss mindestens 8 Zeichen lang sein', minLength(8))
    }
  }
};

const v$ = useVuelidate(rules, { formData });
const error = ref<string>('');
const successMessage = ref<string>('');
const isSubmitting = ref<boolean>(false);

const handleSubmit = async (): Promise<void> => {
  error.value = '';
  
  // Form validation
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  
  isSubmitting.value = true;
  
  try {
    // Add role based on userType
    const userData: RegisterUserData = {
      ...formData,
      role: 'user'  // Keep using 'user' as role since backend only accepts this enum value
    };
    
    await authService.register(userData);
    
    // Show success message
    successMessage.value = 'Registrierung erfolgreich! Sie können sich jetzt anmelden.';
    showToast('Registrierung erfolgreich!', 'success');
    
    // Reset form
    v$.value.$reset();
    Object.keys(formData).forEach(key => {
      (formData as any)[key] = '';
    });
    
  } catch (err: unknown) {
    console.error('Registration error:', err);
    const error_obj = err as RegisterError;
    if (error_obj.response?.data?.message) {
      error.value = error_obj.response.data.message;
      showToast(error_obj.response.data.message, 'error');
    } else {
      error.value = 'Ein Fehler ist bei der Registrierung aufgetreten. Bitte versuchen Sie es später erneut.';
      showToast('Registrierungsfehler', 'error');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script> 