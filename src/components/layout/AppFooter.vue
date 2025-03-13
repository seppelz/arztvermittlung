<template>
  <footer class="bg-dark text-white">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between">
        <div class="mb-6 md:mb-0">
          <div class="flex items-center mb-4">
            <span class="text-xl font-bold">MedMatch.de</span>
          </div>
          <p class="text-accent text-sm max-w-xs">
            Die direkte Vermittlungsplattform für Ärzte und Kliniken. Ohne hohe Gebühren, einfach und effizient.
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-3">Plattform</h3>
            <ul class="space-y-2">
              <li><router-link to="/" class="text-accent hover:text-white">Home</router-link></li>
              <li><router-link to="/for-doctors" class="text-accent hover:text-white">Für Ärzte</router-link></li>
              <li><router-link to="/for-hospitals" class="text-accent hover:text-white">Für Kliniken</router-link></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-3">Unternehmen</h3>
            <ul class="space-y-2">
              <li><router-link to="/about" class="text-accent hover:text-white">Über uns</router-link></li>
              <li><router-link to="/team" class="text-accent hover:text-white">Team</router-link></li>
              <li><router-link to="/contact" class="text-accent hover:text-white">Kontakt</router-link></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-3">Rechtliches</h3>
            <ul class="space-y-2">
              <li><router-link to="/privacy" class="text-accent hover:text-white">Datenschutz</router-link></li>
              <li><router-link to="/terms" class="text-accent hover:text-white">AGB</router-link></li>
              <li><router-link to="/imprint" class="text-accent hover:text-white">Impressum</router-link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="border-t border-accent/30 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-accent">&copy; {{ new Date().getFullYear() }} MedMatch.de - Alle Rechte vorbehalten</p>
        <div class="flex space-x-4 mt-4 md:mt-0">
          <a href="#" class="text-accent hover:text-white">
            <span class="sr-only">LinkedIn</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="#" class="text-accent hover:text-white">
            <span class="sr-only">Twitter</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.383 4.482 13.995 13.995 0 01-10.162-5.159 4.92 4.92 0 001.522 6.574 4.869 4.869 0 01-2.228-.616v.061a4.914 4.914 0 003.941 4.822 4.9 4.9 0 01-2.2.082 4.957 4.957 0 004.616 3.437 9.89 9.89 0 01-6.114 2.107c-.398 0-.79-.022-1.175-.068a13.909 13.909 0 007.548 2.214c9.057 0 14.01-7.503 14.01-14.01 0-.213-.003-.425-.012-.636A10.115 10.115 0 0024 4.59z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template> 