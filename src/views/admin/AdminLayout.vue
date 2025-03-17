<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin-Header -->
    <header class="bg-primary-700 text-white shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <router-link :to="{ name: 'AdminDashboard' }" class="font-bold text-xl">
            MedMatch Admin
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <span v-if="user" class="hidden md:inline-block">
            Angemeldet als {{ user.username }}
          </span>
          <button 
            @click="logout" 
            class="px-3 py-1 bg-primary-800 hover:bg-primary-900 rounded text-sm font-medium"
          >
            Abmelden
          </button>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-md h-screen fixed">
        <nav class="p-4">
          <div class="mb-6">
            <h3 class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
              Dashboard
            </h3>
            <ul class="space-y-2">
              <li>
                <router-link 
                  :to="{ name: 'AdminDashboard' }" 
                  class="flex items-center px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg"
                  :class="{ 'bg-primary-50 text-primary-700': isActive('AdminDashboard') }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </router-link>
              </li>
            </ul>
          </div>
          
          <div class="mb-6">
            <h3 class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
              Verwaltung
            </h3>
            <ul class="space-y-2">
              <li>
                <router-link 
                  :to="{ name: 'AdminBulletin' }" 
                  class="flex items-center px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg"
                  :class="{ 'bg-primary-50 text-primary-700': isActive('AdminBulletin') }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Pinnwand-Einträge
                </router-link>
              </li>
              <li>
                <router-link 
                  :to="{ name: 'AdminJobs' }" 
                  class="flex items-center px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg"
                  :class="{ 'bg-primary-50 text-primary-700': isActive('AdminJobs') }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Stellenbörse
                </router-link>
              </li>
              <li>
                <router-link 
                  :to="{ name: 'AdminUsers' }" 
                  class="flex items-center px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg"
                  :class="{ 'bg-primary-50 text-primary-700': isActive('AdminUsers') }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Benutzer
                </router-link>
              </li>
              <li>
                <router-link 
                  :to="{ name: 'AdminContacts' }" 
                  class="flex items-center px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg"
                  :class="{ 'bg-primary-50 text-primary-700': isActive('AdminContacts') }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Kontaktanfragen
                </router-link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
              System
            </h3>
            <ul class="space-y-2">
              <li>
                <router-link 
                  :to="{ name: 'AdminSettings' }" 
                  class="flex items-center px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg"
                  :class="{ 'bg-primary-50 text-primary-700': isActive('AdminSettings') }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Einstellungen
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64">
        <div class="container mx-auto px-4 py-6">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Mock-Daten für den angemeldeten Benutzer
// Später wird dies aus dem Store oder API geladen
const user = ref({
  username: 'admin',
  role: 'admin'
});

// Prüft, ob eine Route aktiv ist
const isActive = (routeName) => {
  return route.name === routeName;
};

// Abmelden
const logout = () => {
  // Später wird hier die Abmelde-Logik implementiert
  console.log('Abmelden');
  router.push({ name: 'AdminLogin' });
};
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style> 