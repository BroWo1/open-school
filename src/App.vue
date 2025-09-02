<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-base-100" data-theme="light">
    <AppHeader />
    
    <main>
      <RouterView />
    </main>
    
    <AppFooter />
  </div>
</template>

<style scoped>
/* Section spacing and transitions */
section {
  scroll-margin-top: 80px;
}

/* Smooth scroll behavior for anchor links */
html {
  scroll-behavior: smooth;
}

/* Container max width adjustments */
.container {
  max-width: 1200px;
}
</style>