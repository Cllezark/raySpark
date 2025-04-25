<script setup>
import { ref, onMounted, computed } from 'vue'
import GameSquare from './GameSquare.vue'
import TitleBar from './TitleBar.vue'
import PitcherStats from './PitcherStats.vue'

const mlbTeamMap = {
  'Arizona Diamondbacks': 'ARI',
  'Atlanta Braves': 'ATL',
  'Baltimore Orioles': 'BAL',
  'Boston Red Sox': 'BOS',
  'Chicago White Sox': 'CWS',
  'Chicago Cubs': 'CHC',
  'Cincinnati Reds': 'CIN',
  'Cleveland Guardians': 'CLE',
  'Colorado Rockies': 'COL',
  'Detroit Tigers': 'DET',
  'Houston Astros': 'HOU',
  'Kansas City Royals': 'KC',
  'Los Angeles Angels': 'LAA',
  'Los Angeles Dodgers': 'LAD',
  'Miami Marlins': 'MIA',
  'Milwaukee Brewers': 'MIL',
  'Minnesota Twins': 'MIN',
  'New York Yankees': 'NYY',
  'New York Mets': 'NYM',
  Athletics: 'ATH',
  'Philadelphia Phillies': 'PHI',
  'Pittsburgh Pirates': 'PIT',
  'San Diego Padres': 'SD',
  'San Francisco Giants': 'SF',
  'Seattle Mariners': 'SEA',
  'St. Louis Cardinals': 'STL',
  'Tampa Bay Rays': 'TB',
  'Texas Rangers': 'TEX',
  'Toronto Blue Jays': 'TOR',
  'Washington Nationals': 'WSH',
}
const games = ref([])
const containerRef = ref(null)

const fetchMLBGames = async () => {
  try {
    const res = await fetch(
      'https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=139&hydrate=probablePitcher,stats&startDate=2025-03-01&endDate=2025-06-01',
    )
    const data = await res.json()

    games.value = data.dates
      .flatMap((date) => date.games)
      .filter(
        (game) =>
          game.status.detailedState === 'Final' &&
          new Date(game.gameDate) >= new Date('2025-03-28'),
      )
      .map((game) => {
        const raysIsHome = game.teams.home.team.id === 139
        const team = raysIsHome ? game.teams.home : game.teams.away
        const opponent = raysIsHome ? game.teams.away : game.teams.home
        const raysScore = team.score
        const opponentScore = opponent.score
        const result =
          raysScore > opponentScore ? 'Win' : raysScore < opponentScore ? 'Loss' : 'Tie'

        const probablePitcher = team.probablePitcher
        const pitchingStats = probablePitcher?.stats?.find(
          (stat) => stat.group?.displayName === 'pitching' && stat.type?.displayName === 'gameLog',
        )

        const formattedDate = new Date(game.gameDate).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
        })

        const opponentAbbreviation = mlbTeamMap[opponent.team.name] || opponent.team.name

        return {
          gamePk: game.gamePk,
          date: formattedDate,
          location: raysIsHome ? 'vs.' : '@',
          opponent: opponentAbbreviation,
          result,
          score: `${raysScore}-${opponentScore}`,
          pitcher: probablePitcher?.fullName ?? 'N/A',
          inningsPitched: pitchingStats?.stats?.inningsPitched ?? 'N/A',
          strikeouts: pitchingStats?.stats?.strikeOuts ?? 'N/A',
          baseOnBalls: pitchingStats?.stats?.baseOnBalls ?? 'N/A',
          earnedRuns: pitchingStats?.stats?.earnedRuns ?? 'N/A',
        }
      })
  } catch (error) {
    console.error('Error fetching MLB games:', error)
  }
}

onMounted(() => {
  fetchMLBGames()
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

const closeModal = () => {
  isModalVisible.value = false
  selectedGame.value = null
}
</script>

<template>
  <div class="mlb-games">
    <TitleBar
      :wins="stats.wins"
      :losses="stats.losses"
      :ties="stats.ties"
      :runDifferential="stats.runDifferential"
      :games="games"
    />
    <div class="calendar-container" ref="containerRef">
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
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.mlb-games {
  margin: 2rem auto;
  max-width: 1200px;
  padding: 0 1rem;
}

.calendar-container {
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

/* Remove all transform styles since we don't need them anymore */
:deep(.game-square) {
  position: relative;
  transition: transform 0.2s ease;
}

:deep(.game-square:hover) {
  transform: scale(1.05);
  z-index: 2;
}

/* Customize scrollbar appearance */
.calendar-container::-webkit-scrollbar {
  height: 8px;
}

.calendar-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.calendar-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.calendar-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 768px) {
  .mlb-games {
    padding: 0;
  }

  .game-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }
}
</style>
