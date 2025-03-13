<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center">
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo.svg" alt="MedMatch Logo" class="h-10 w-auto mr-2" />
          <span class="text-2xl font-bold text-primary">MedMatch</span>
        </router-link>
      </div>
      <nav class="hidden md:flex space-x-6">
        <router-link to="/" class="text-gray-700 hover:text-primary">Home</router-link>
        <router-link to="/for-doctors" class="text-gray-700 hover:text-primary">Für Ärzte</router-link>
        <router-link to="/for-hospitals" class="text-gray-700 hover:text-primary">Für Kliniken</router-link>
        <router-link to="/about" class="text-gray-700 hover:text-primary">Über uns</router-link>
        <router-link to="/team" class="text-gray-700 hover:text-primary">Team</router-link>
        <router-link to="/contact" class="text-gray-700 hover:text-primary">Kontakt</router-link>
      </nav>
      <div class="md:hidden">
        <button @click="isMenuOpen = !isMenuOpen" class="text-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-white px-4 py-2 shadow-inner">
      <div class="flex flex-col space-y-3 pb-3">
        <router-link to="/" class="text-gray-700 hover:text-primary" @click="isMenuOpen = false">Home</router-link>
        <router-link to="/for-doctors" class="text-gray-700 hover:text-primary" @click="isMenuOpen = false">Für Ärzte</router-link>
        <router-link to="/for-hospitals" class="text-gray-700 hover:text-primary" @click="isMenuOpen = false">Für Kliniken</router-link>
        <router-link to="/about" class="text-gray-700 hover:text-primary" @click="isMenuOpen = false">Über uns</router-link>
        <router-link to="/team" class="text-gray-700 hover:text-primary" @click="isMenuOpen = false">Team</router-link>
        <router-link to="/contact" class="text-gray-700 hover:text-primary" @click="isMenuOpen = false">Kontakt</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script> 