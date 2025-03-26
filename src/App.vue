<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth state from localStorage
  authStore.initAuth()
})
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow main-content">
      <RouterView />
    </main>
    <AppFooter />
    <ToastNotification />
    <CookieBanner />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
