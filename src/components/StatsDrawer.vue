<script setup>
import { ref } from 'vue'
import TufteSparkline from './TufteSparkline.vue'
defineProps({
  wins: {
    type: Number,
    required: true,
  },
  losses: {
    type: Number,
    required: true,
  },
  runDifferential: {
    type: Number,
    default: 0,
  },
  games: {
    type: Array,
    required: true,
  },
})

const isExpanded = ref(false)

const toggleDrawer = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="stats-drawer" :class="{ expanded: isExpanded }">
    <div class="drawer-content" v-show="isExpanded">
      <div class="stats-grid">
        <div class="stat-item">
          <h1 class="win-ratio">
            Win %:
            <span
              :class="{
                'above-500': wins / (wins + losses) >= 0.5,
                'below-500': wins / (wins + losses) < 0.5,
              }"
            >
              {{ (wins / (wins + losses)).toPrecision(3) }}
            </span>
          </h1>
        </div>
        <div class="stat-item">
          <h1 class="runDifferential">
            Runs:
            <span :class="{ positive: runDifferential > 0, negative: runDifferential < 0 }">
              {{ runDifferential > 0 ? '+' : '' }}{{ runDifferential }}
            </span>
          </h1>
        </div>
        <div class="stat-item">
          <h1 class="record">
            Record:
            <span :class="{ winning: wins > losses, losing: wins < losses }">
              {{ wins }} - {{ losses }}
            </span>
          </h1>
        </div>
        <div class="stat-item sparkline">
          <TufteSparkline :games="games" height="100" />
        </div>
      </div>
    </div>
    <button class="pull-tab" @click="toggleDrawer" :class="{ expanded: isExpanded }">
      <span class="arrow" :class="{ expanded: isExpanded }">▼</span>
    </button>
  </div>
</template>

<style scoped>
/* Layout */
.stats-drawer {
  position: fixed;
  top: 4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1200px;
  background: rgba(0, 0, 0, 0.85); /* Increased opacity from 0.4 to 0.85 */
  transition: transform 0.3s ease;
  z-index: 99;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
}

.sparkline {
  grid-column: 1 / -1;
}

/* Pull Tab */
.pull-tab {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  background: black;
  border: 1px solid #7fff00;
  border-top: none;
  border-radius: 0 0 30px 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 98;
}

.pull-tab .arrow {
  color: #7fff00;
  font-size: 12px;
  transition: transform 0.3s ease;
  display: block;
  line-height: 30px;
}

.stats-drawer.expanded {
  transform: translateX(-50%) translateY(0);
}

.stats-drawer:not(.expanded) {
  transform: translateX(-50%) translateY(-100%);
}

/* Stats Styling */
.win-ratio span,
.record span,
.runDifferential span {
  transition: color 0.3s ease;
}

/* Winning States */
.win-ratio span.above-500,
.record span.winning,
.runDifferential span.positive {
  color: #7fff00;
}

/* Losing States */
.win-ratio span.below-500,
.record span.losing,
.runDifferential span.negative {
  color: #00bfff;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1rem;
  }

  .stat-item {
    padding: 1rem;
  }
}
</style>
