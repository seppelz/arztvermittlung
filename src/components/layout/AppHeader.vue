<template>
  <header
    class="fixed top-0 left-0 right-0 w-full z-50 bg-gradient-banner text-text-light shadow-header transition-all duration-300"
    :class="{ 'shadow-lg': isScrolled }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-[var(--nav-height)]">
        <!-- Logo -->
        <div class="flex">
          <router-link
            :to="{ name: 'Home' }"
            class="flex items-center gap-2 font-bold text-2xl no-underline hover:no-underline"
          >
            <img
              src="@/assets/logo.svg"
              alt="MedMatch Logo"
              class="h-9 w-auto"
            />
            <span class="hidden md:block">MedMatch</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-1">
          <router-link
            :to="{ name: 'Home' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            Startseite
          </router-link>
          <router-link
            :to="{ name: 'ForDoctors' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            Für Ärzte
          </router-link>
          <router-link
            :to="{ name: 'ForHospitals' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            Für Kliniken
          </router-link>
          <router-link
            :to="{ name: 'BulletinBoard' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            Pinnwand
          </router-link>
          <router-link
            :to="{ name: 'About' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            Über uns
          </router-link>
          <router-link
            :to="{ name: 'Team' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            Team
          </router-link>
          <router-link
            :to="{ name: 'Contact' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            Kontakt
          </router-link>
        </nav>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button
            class="p-2 rounded-full text-text-light hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="Toggle menu"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-class="transform opacity-0 -translate-y-4"
      enter-to-class="transform opacity-100 translate-y-0"
      enter-active-class="transition ease-out duration-300"
      leave-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-4"
      leave-active-class="transition ease-in duration-300"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-primary-800 shadow-lg"
      >
        <div class="p-4 space-y-1">
          <router-link
            :to="{ name: 'Home' }"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
          >
            Startseite
          </router-link>
          <router-link
            :to="{ name: 'ForDoctors' }"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
          >
            Für Ärzte
          </router-link>
          <router-link
            :to="{ name: 'ForHospitals' }"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
          >
            Für Kliniken
          </router-link>
          <router-link
            :to="{ name: 'BulletinBoard' }"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
          >
            Pinnwand
          </router-link>
          <router-link
            :to="{ name: 'About' }"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
          >
            Über uns
          </router-link>
          <router-link
            :to="{ name: 'Team' }"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
          >
            Team
          </router-link>
          <router-link
            :to="{ name: 'Contact' }"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
          >
            Kontakt
          </router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const mobileMenuOpen = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.nav-link {
  @apply block px-3 py-2 text-lg font-medium rounded-lg text-white no-underline;
  @apply transition-all duration-300 hover:bg-white/10 hover:shadow-inner;
  @apply hover:no-underline hover:text-white;
}

.nav-link-active {
  @apply bg-white/15 shadow-inner;
  @apply border-b-2 border-secondary-400;
}

.mobile-nav-link {
  @apply block px-4 py-3 text-lg font-medium rounded-lg text-white no-underline;
  @apply transition-all duration-200 hover:bg-white/10;
  @apply hover:no-underline hover:text-white;
}

.mobile-nav-link-active {
  @apply bg-white/15 shadow-inner;
  @apply border-l-4 border-secondary-400 pl-3;
}
</style> 