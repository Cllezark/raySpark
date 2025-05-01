<script setup>
import StatsDrawer from './StatsDrawer.vue'

defineProps({
  title: {
    type: String,
    default: 'Tampa Bay Rays 2025 Season',
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  runDifferential: {
    type: Number,
    default: 0,
  },
  games: {
    type: Array,
    required: true,
  },
  pitcherStats: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div>
    <div class="title-bar">
      <div class="title-content">
        <h1 class="season-title">{{ title }}</h1>
        <!-- maybe this could be configurable one day? -->
      </div>
    </div>
    <StatsDrawer
      :wins="wins"
      :losses="losses"
      :runDifferential="runDifferential"
      :games="games"
      :pitcher-stats="pitcherStats"
    />
  </div>
</template>

<style scoped>
.title-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 1rem;
  border-bottom: 3px solid #7fff00;
}

.title-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.season-title {
  text-align: center;
  flex: 1;
  margin: 0 1rem;
  background: linear-gradient(to right, #4b0082, #00bfff, #7fff00);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
  /* Fallback for browsers that don't support gradient text */
  @supports not (background-clip: text) {
    color: var(--gradient-middle);
  }
}

.win-ratio {
  text-align: left;
}

.record {
  text-align: right;
}
</style>
