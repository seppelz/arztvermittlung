<template>
  <footer class="bg-gradient-banner text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <img
              src="/Med-MATCH.png"
              alt="MedMatch Logo"
              class="h-12 w-auto"
            />
            <span class="text-xl font-bold text-white">Med-Match</span>
          </div>
          <p class="text-white mb-6 max-w-md">
            Die Plattform für ärztliche Fachkräfte und medizinische Einrichtungen.
            Wir verbinden qualifizierte Ärzte mit passenden Stellen in ganz Deutschland.
          </p>
          
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-xl font-bold mb-4 border-b border-white/50 pb-2 text-white">Schnellzugriff</h3>
          <ul class="space-y-2">
            <li>
              <router-link :to="{ name: 'Home' }" class="footer-link">
                Startseite
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'Profile', query: { userType: 'doctor' }}" class="footer-link">
                Für Ärzte
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'Profile', query: { userType: 'hospital' }}" class="footer-link">
                Für Kliniken / Einrichtungen
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'BulletinBoard' }" class="footer-link">
                Pinnwand
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'About' }" class="footer-link">
                Über uns
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Legal Links -->
        <div>
          <h3 class="text-xl font-bold mb-4 border-b border-white/50 pb-2 text-white">Rechtliches</h3>
          <ul class="space-y-2">
            <li>
              <router-link :to="{ name: 'Privacy' }" class="footer-link">
                Datenschutz
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'Terms' }" class="footer-link">
                AGB
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'Imprint' }" class="footer-link">
                Impressum
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'Contact' }" class="footer-link">
                Kontakt
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-white/30">
        <p class="text-center text-white text-sm">
          &copy; {{ new Date().getFullYear() }} MedMatch. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Component for application footer
// Uses Vue Router for navigation links
</script>

<style scoped>
.footer-link {
  @apply text-white hover:text-white/90 transition-colors duration-300 block;
  @apply no-underline hover:no-underline;
  @apply hover:translate-x-1 transition-transform;
}

.social-icon {
  @apply flex items-center justify-center h-10 w-10 rounded-full bg-white/20;
  @apply hover:bg-white/30 transition-colors duration-300 text-white;
  @apply no-underline hover:no-underline;
}
</style>