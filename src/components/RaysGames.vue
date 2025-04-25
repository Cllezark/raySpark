<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchMLBSchedule } from '../services/mlbApi'
import { filterFinalGames, transformGameData } from '../utils/gameTransformer'
import { RAYS_TEAM_ID } from '../constants/mlb'
import GameSquare from './GameSquare.vue'
import TitleBar from './TitleBar.vue'
import PitcherStats from './PitcherStats.vue'

const games = ref([])
const isLoading = ref(false)
const error = ref(null)

const fetchRaysGames = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Extract
    const mlbGames = await fetchMLBSchedule(RAYS_TEAM_ID, '2025-03-01', '2025-06-01')

    // Transform
    const finalGames = filterFinalGames(mlbGames)
    games.value = finalGames.map(transformGameData)
  } catch (err) {
    error.value = err.message
    console.error('Error fetching MLB games:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRaysGames()
})

const stats = computed(() => {
  const wins = games.value.filter((game) => game.result === 'Win').length
  const losses = games.value.filter((game) => game.result === 'Loss').length
  const ties = games.value.filter((game) => game.result === 'Tie').length
  const runDifferential = games.value.reduce((diff, game) => {
    const [raysScore, opponentScore] = game.score.split('-').map(Number)
    return diff + (raysScore - opponentScore)
  }, 0)

  return { wins, losses, ties, runDifferential }
})

const selectedGame = ref(null)
const isModalVisible = ref(false)

const showPitcherStats = (game) => {
  selectedGame.value = game
  isModalVisible.value = true
}

const closePitcherStats = () => {
  isModalVisible.value = false
  selectedGame.value = null
}
</script>

<template>
  <div class="rays-games">
    <TitleBar v-bind="stats" :games="games" />

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="isLoading" class="loading-state">Loading games...</div>

    <div v-else class="game-grid-container">
      <div class="game-grid">
        <GameSquare
          v-for="game in games"
          :key="game.gamePk"
          :date="game.date"
          :location="game.location"
          :opponent="game.opponent"
          :result="game.result"
          :score="game.score"
          :data-game-pk="game.gamePk"
          v-bind="game"
          @showStats="showPitcherStats(game)"
        />
      </div>
    </div>

    <PitcherStats
      v-if="selectedGame"
      v-bind="selectedGame"
      :isVisible="isModalVisible"
      @close="closePitcherStats"
    />
  </div>
</template>

<style scoped>
.rays-games {
  margin: 2rem auto;
  max-width: 1200px;
  padding: 0 1rem;
}

.game-grid-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  padding: 1rem 0;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

:deep(.game-square) {
  position: relative;
  transition: transform 0.2s ease;
}

:deep(.game-square:hover) {
  transform: scale(1.05);
  z-index: 2;
}

/* Customize scrollbar appearance */
.game-grid-container::-webkit-scrollbar {
  height: 8px;
}

.game-grid-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.game-grid-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.game-grid-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 768px) {
  .rays-games {
    padding: 0;
  }

  .game-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }
}
</style>
