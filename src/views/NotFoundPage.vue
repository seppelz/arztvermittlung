<template>
  <div class="min-h-screen flex items-center justify-center bg-light">
    <div class="max-w-md w-full p-6 text-center">
      <div class="text-primary mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">Seite nicht gefunden</h2>
      <p class="text-gray-600 mb-8">
        Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
      </p>
      <router-link to="/" class="inline-block bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-dark transition-colors duration-300">
        Zurück zur Startseite
      </router-link>
    </div>
  </div>
</template> 