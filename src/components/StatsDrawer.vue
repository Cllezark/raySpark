<script setup>
import { ref, watch } from 'vue'
// import BaseballSparkline from './BaseballSparkline.vue'
import PitcherCard from './PitcherCard.vue'

const props = defineProps({
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
  pitcherStats: {
    type: Array,
    default: () => [],
  },
})

// Add watcher to debug incoming data
watch(
  () => props.pitcherStats,
  (newVal) => {
    console.log('Pitcher stats in drawer:', newVal)
  },
  { immediate: true },
)

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
            <span :class="{ winning: wins >= losses, losing: wins < losses }">
              {{ wins }} - {{ losses }}
            </span>
          </h1>
        </div>
        <!-- <div class="stat-item sparkline">
          <BaseballSparkline :games="games" :height="100" @showPitcherStats="handlePitcherStats" />
        </div> -->

        <!-- Pitcher Stats Section -->
        <div class="pitchers-section">
          <h2 class="section-title">Starting Rotation</h2>
          <div class="pitchers-grid">
            <div v-if="pitcherStats.length === 0" class="no-stats">No pitcher stats available</div>
            <PitcherCard
              v-else
              v-for="pitcher in pitcherStats"
              :key="pitcher.name"
              :pitcher="pitcher"
            />
          </div>
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
  background: rgba(0, 0, 0, 0.85);
  transition: transform 0.3s ease;
  z-index: 99;
}

/* Layout adjustments for stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem; /* Reduced from 1.5rem */
  padding: 1rem 1.5rem; /* Reduced from 2rem, kept horizontal breathing room */
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem; /* Reduced from 1.5rem */
  border-radius: 8px;
}

.sparkline {
  grid-column: 1 / -1;
}

/* Adjusted spacing for pitcher section */
.pitchers-section {
  grid-column: 1 / -1;
  margin-top: 1rem; /* Reduced from 2rem */
}

.section-title {
  color: #7fff00;
  font-size: 1.5rem;
  margin-bottom: 0.75rem; /* Reduced from 1rem */
  text-align: center;
}

.pitchers-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Reduced from 0.75rem */
  max-width: 800px;
  margin: 0 auto;
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

/* Pitcher Stats Section */
.no-stats {
  color: #00bfff;
  text-align: center;
  grid-column: 1 / -1;
  padding: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    padding: 0.75rem; /* Further reduced for mobile */
    gap: 0.75rem;
  }

  .stat-item {
    padding: 0.75rem;
  }
}
</style>
