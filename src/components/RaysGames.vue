<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchMLBSchedule } from '../services/mlbApi'
import { filterFinalGames, transformGameData } from '../utils/gameTransformer'
import { transformPitchersData } from '../utils/pitchersTransformer'
import { RAYS_TEAM_ID } from '../constants/mlb'
import remainingGames from '../data/remainingGames2025.json'
import TitleBar from './TitleBar.vue'
import BaseballSparkline from './BaseballSparkline.vue'
import GameCard from './GameCard.vue'

/** This component is the workspace for the rest of the application's workload.
 * I didn't put my top-level logic in App.vue out of superstition.
 */

const games = ref([])
const isLoading = ref(false)
const error = ref(null)
const selectedGame = ref(null)
const isGameCardVisible = ref(false) // New ref for visibility control

const loadAllGames = async () => {
  isLoading.value = true
  error.value = null

  try {
    // 1. Get historical games from MLB API
    const mlbSchedule = await fetchMLBSchedule(RAYS_TEAM_ID, '2025-03-01', '2025-06-01')

    /** Transformation steps
     * step one: filter out all unfinished games
     * step two: trim the data down to the fields we care about
     * if something fails, thrown an error
     */
    const historicalGames = filterFinalGames(mlbSchedule)
    const transformedHistorical = historicalGames.map(transformGameData)

    // 2. Get mock future games and add gameNumber
    const futureGames = remainingGames.games.map((game, index) => ({
      ...game,
      gameNumber: transformedHistorical.length + index + 1, // Continue numbering from historical games
      gamePk: `mock-${game.date}`, // Add unique identifier
      dateTime: `${game.date}/2025T19:10:00Z`, // Add standard game time
      teams: {
        away: { team: { name: game.opponent }, score: game.score.split('-')[1] },
        home: { team: { name: 'Rays' }, score: game.score.split('-')[0] },
      },
    }))

    // 3. Merge both datasets
    games.value = [
      ...transformedHistorical, // Past games from MLB API
      ...futureGames, // Future mock games
    ].sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
  } catch (err) {
    error.value = err.message
    console.error('Error loading games data:', err)
  } finally {
    isLoading.value = false
  }
}

/** I decided I wanted to count the baseball game number well after building gameTransformer.js
 * So I did it in the component, just so I could see how it looks.
 * A better way to do this would be to add a gameNumber field to the game object during transformation
 * I might even do that later, but for now, this works.
 */
const getGameNumber = (gameDate) => {
  return games.value.filter((g) => new Date(g.date) <= new Date(gameDate)).length
}

/** "SVG interactivity is so cool! I bet the Rays would it if that sparkline was the interactive!"
 *  Nothing says "2 hour take-home project" quite like manually syncing
 * D3 event handlers with Vue's reactivity system. Who needs simple click events
 * when you can spend 3 days debugging event propagation?
 */

const handleGameSelect = (game) => {
  if (!game) {
    /** Clicking off - hide card and clear selection */
    isGameCardVisible.value = false
    selectedGame.value = null
    return
  }

  if (selectedGame.value?.gamePk === game.gamePk) {
    /**Clicking same game - hide card and clear selection */
    isGameCardVisible.value = false
    selectedGame.value = null
  } else {
    /** New game selected - show card with new game */
    selectedGame.value = {
      ...game,
      gameNumber: getGameNumber(game.date),
    }
    isGameCardVisible.value = true
  }
}

/** when this mega component loads,
 * let's do that baseball */

onMounted(() => {
  loadAllGames()
})

/** Breaking down the game stats for use in the StatsDrawer.
 * Ties only come up in Spring Training, but I kept them in case we wanna try adding those later
 */
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

/**This project is cool because it affords the author an opportunity to balance
 * data vizualization across timescales.
 * The sparkline distills team performance into a single stat,
 * the game card gives a snapshot of a single game's team and pitcher performance,
 * but how do we show how the pitchers are doing over time?
 * my idea: track the starting rotation's performance over time in the stats drawer
 */

const pitcherStats = computed(() => {
  return transformPitchersData(games.value)
})
</script>

<template>
  <div class="rays-games">
    <TitleBar v-bind="stats" :pitcher-stats="pitcherStats" />

    <!-- error message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- loading spinner -->
    <div v-else-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <span class="loading-text">Loading games...</span>
    </div>

    <!--  Ahe hell yeah, we made the sparkline big -->
    <BaseballSparkline
      :games="games"
      :height="100"
      @game-selected="handleGameSelect"
      @game-deselected="() => handleGameSelect(null)"
    />
    <!-- GameCard shows details on the game represented by a given tick mark -->
    <!-- It gets hidden if no tick mark is active -->
    <GameCard v-if="selectedGame" :game="selectedGame" :isVisible="isGameCardVisible" />
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(127, 255, 0, 0.1);
  border-left-color: #7fff00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #7fff00;
  font-size: 1.2rem;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
