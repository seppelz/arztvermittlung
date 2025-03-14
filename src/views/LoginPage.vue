<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Anmelden bei MedMatch
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Oder
        <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          registrieren Sie sich für ein neues Konto
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
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
        
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              E-Mail-Adresse
            </label>
            <div class="mt-1">
              <input 
                id="email" 
                v-model="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': v$.email.$error }"
              >
            </div>
            <p v-if="v$.email.$error" class="mt-1 text-sm text-red-600">{{ v$.email.$errors[0].$message }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Passwort
            </label>
            <div class="mt-1">
              <input 
                id="password" 
                v-model="password" 
                name="password" 
                type="password" 
                autocomplete="current-password" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': v$.password.$error }"
              >
            </div>
            <p v-if="v$.password.$error" class="mt-1 text-sm text-red-600">{{ v$.password.$errors[0].$message }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
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
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Wird angemeldet...' : 'Anmelden' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Oder melden Sie sich an als
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a 
                href="#" 
                @click.prevent="handleLoginAs('guest@example.com', 'guest123')"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Gast-Zugang
              </a>
            </div>
            <div>
              <a 
                href="#" 
                @click.prevent="handleLoginAs('user@example.com', 'password123')"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Test-Benutzer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email as emailValidator, helpers } from '@vuelidate/validators';
import authService from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const { showToast } = useToast();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const error = ref('');
const isSubmitting = ref(false);

const rules = {
  email: { 
    required: helpers.withMessage('E-Mail-Adresse ist erforderlich', required),
    email: helpers.withMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein', emailValidator)
  },
  password: { 
    required: helpers.withMessage('Passwort ist erforderlich', required)
  }
};

const v$ = useVuelidate(rules, { email, password });

const handleLogin = async () => {
  error.value = '';
  
  // Form validation
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  
  isSubmitting.value = true;
  
  try {
    const response = await authService.login({
      email: email.value,
      password: password.value
    });
    
    const userData = response.data;
    
    // Store user data in Pinia store
    authStore.setAuth(userData);
    
    // Show success toast
    showToast('Erfolgreich angemeldet!', 'success');
    
    // Redirect based on role
    if (userData.user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/profile');
    }
    
  } catch (err) {
    console.error('Login error:', err);
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
      showToast(err.response.data.message, 'error');
    } else {
      error.value = 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.';
      showToast('Anmeldung fehlgeschlagen', 'error');
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleLoginAs = async (testEmail, testPassword) => {
  email.value = testEmail;
  password.value = testPassword;
  await handleLogin();
};
</script> 