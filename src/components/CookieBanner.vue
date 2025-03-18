<template>
  <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-6 z-50 shadow-lg">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-bold text-heading mb-2">Datenschutzhinweis</h3>
          <p class="text-sm text-gray-600 mb-2">
            Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern.
            Mit der Nutzung dieser Website stimmen Sie unserer Verwendung von Cookies gemäß unserer
            <router-link to="/privacy" class="text-primary hover:underline">Datenschutzerklärung</router-link> zu.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2">
          <button 
            @click="acceptCookies" 
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Akzeptieren
          </button>
          <button 
            @click="rejectCookies" 
            class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import cookieService from '@/services/cookie.service';

const showBanner = ref(false);

// Prüfen, ob Cookie-Präferenz bereits gesetzt wurde
const checkCookieConsent = () => {
  const cookieConsent = cookieService.getCookie('cookie-consent');
  showBanner.value = cookieConsent === '';
};

// Cookies akzeptieren
const acceptCookies = () => {
  cookieService.acceptCookies();
  showBanner.value = false;
};

// Cookies ablehnen
const rejectCookies = () => {
  cookieService.rejectCookies();
  showBanner.value = false;
};

// Bei Seitenladung Cookie-Status prüfen
onMounted(() => {
  checkCookieConsent();
});
</script> 