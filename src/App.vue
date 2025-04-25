<script setup>
import RaysGames from './components/RaysGames.vue'
</script>

<template>
  <div class="app">
    <main>
      <RaysGames />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

main {
  margin-top: 4rem; /* Add space for fixed title bar */
  padding: 1rem;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}
</style>
