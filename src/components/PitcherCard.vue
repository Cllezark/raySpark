<script setup>
/** Pitcher Cards are part of the data density effort.
 * All the stats inside StatsDrawer were cumulative team stats,
 * meanwhile all the stats inside GameCard were individual team and pitcher stats.
 * I figured it would be nice to have cumulative pitcher stats shown somewhere,
 * and the StatsDrawer was a natural home, so I built this component
 * to be compact, visually striking, and informative.
 * Even on the widest viewport setting, the PitcherCard component stays tight.
 */
defineProps({
  pitcher: {
    type: Object,
    required: true,
    validator: (value) =>
      'name' in value &&
      'gamesStarted' in value &&
      'inningsPitched' in value &&
      'era' in value &&
      'k9' in value &&
      'bb9' in value &&
      'whip' in value,
  },
})
</script>

<template>
  <div class="pitcher-card">
    <div class="name-column">
      <h3 class="pitcher-name">{{ pitcher.name }}</h3>
    </div>
    <div class="stats-column">
      <div class="stats-row">
        <span class="stat-item">
          <span class="stat-label">GS</span>
          <span class="stat-value">{{ pitcher.gamesStarted }}</span>
        </span>
        <span class="stat-item">
          <span class="stat-label">IP</span>
          <span class="stat-value">{{ pitcher.inningsPitched }}</span>
        </span>
        <span class="stat-item">
          <span class="stat-label">ERA</span>
          <span class="stat-value">{{ pitcher.era }}</span>
        </span>
      </div>
      <div class="stats-row">
        <span class="stat-item">
          <span class="stat-label">BB/9</span>
          <span class="stat-value">{{ pitcher.bb9 }}</span>
        </span>
        <span class="stat-item">
          <span class="stat-label">K/9</span>
          <span class="stat-value">{{ pitcher.k9 }}</span>
        </span>
        <span class="stat-item">
          <span class="stat-label">WHIP</span>
          <span class="stat-value">{{ pitcher.whip }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pitcher-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #4b0082;
  border-radius: 8px;
  height: 50px;
  transition: all 0.2s ease;
}

.pitcher-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 191, 255, 0.2);
}

.name-column {
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #4b0082;
  padding: 0 0.5rem;
}

.pitcher-name {
  color: #7fff00;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stats-column {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0.25rem 0.5rem;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.stat-label {
  color: #00bfff;
  font-size: 0.7rem;
  font-weight: 500;
}

.stat-value {
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 480px) {
  .pitcher-card {
    grid-template-columns: 150px 1fr;
  }

  .pitcher-name {
    font-size: 0.8rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }

  .stat-value {
    font-size: 0.75rem;
  }
}
</style>
