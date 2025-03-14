<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          MedMatch Admin
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Bitte melden Sie sich an, um fortzufahren
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span class="block sm:inline">{{ error }}</span>
        </div>
        
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">E-Mail-Adresse</label>
            <input 
              id="email" 
              v-model="credentials.email" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
              placeholder="E-Mail-Adresse"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Passwort</label>
            <input 
              id="password" 
              v-model="credentials.password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
              placeholder="Passwort"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              v-model="credentials.rememberMe"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" 
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Angemeldet bleiben
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              Passwort vergessen?
            </a>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            :disabled="loading"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Loading Spinner -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Lock Icon -->
              <svg class="h-5 w-5 text-primary-500 group-hover:text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            {{ loading ? 'Anmeldung läuft...' : 'Anmelden' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../../services/auth.service';

const router = useRouter();
const error = ref('');
const loading = ref(false);
const credentials = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const login = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Verwende den Auth-Service für den Login
    const response = await authService.login(credentials);
    
    console.log('Login erfolgreich:', response);
    
    // Überprüfen, ob der Benutzer ein Admin ist
    if (response.user && response.user.role === 'admin') {
      // Weiterleitung zum Dashboard
      router.push({ name: 'AdminDashboard' });
    } else {
      // Benutzer ist kein Admin
      error.value = 'Sie haben keine Administratorberechtigungen';
      authService.logout(); // Token und Benutzer entfernen
    }
  } catch (err) {
    console.error('Login error:', err);
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style> 