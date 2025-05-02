<script setup>
import { computed } from 'vue'

/** The devil is in the details of the GameCard component
 * This component is responsible for displaying the details of a single game,
 * listening for that single game to be selected,
 * and re-rendering game data as new games are selected.
 *
 * I want the GameCard to look pretty and use the window space well.
 * That's why I have it set up with two "columns" that can become two "rows" as screen width shrinks.
 *
 * I'm not super good at animations, but I gave this a whirl and felt pretty good about the result.
 */
const props = defineProps({
  game: {
    type: Object,
    required: true,
    validator: (value) =>
      'date' in value &&
      'location' in value &&
      'opponent' in value &&
      'result' in value &&
      'score' in value &&
      'pitcher' in value &&
      'gameNumber' in value,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const contentKey = computed(() => props.game?.date || 'no-game')
</script>

<template>
  <Transition name="slide" appear>
    <div v-show="isVisible" class="game-card">
      <Transition name="fade" mode="out-in">
        <div :key="contentKey" class="game-content">
          <div class="game-summary">
            <div class="summary-row">
              <span class="date">{{ game.date }}</span>
              <span class="game-number">Game {{ game.gameNumber }} of 162</span>
            </div>
            <div class="summary-row">
              <span class="matchup">TB {{ game.location }} {{ game.opponent }}</span>
            </div>
            <div class="summary-row">
              <span :class="['result', game.result.toLowerCase()]">{{ game.result }}</span>
              <span class="score">{{ game.score }}</span>
            </div>
          </div>
          <div class="pitcher-details">
            <div class="pitcher-row">
              <span class="pitcher-name">Starting Pitcher: {{ game.pitcher }}</span>
            </div>
            <div class="pitcher-row">
              <span class="stat">IP: {{ game.inningsPitched }}</span>
              <span class="stat">K: {{ game.strikeouts }}</span>
            </div>
            <div class="pitcher-row">
              <span class="stat">BB: {{ game.baseOnBalls }}</span>
              <span class="stat">ER: {{ game.earnedRuns }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.game-card {
  margin-top: 1rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #4b0082;
  border-radius: 8px;
  color: white;
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.2);
}

.game-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
}

.game-summary,
.pitcher-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-row,
.pitcher-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.date,
.game-number {
  font-size: 1.1rem;
  font-weight: 500;
}

.matchup {
  font-size: 1.2rem;
  font-weight: 600;
}

.result {
  font-weight: bold;
  font-size: 1.2rem;
}

.result.win {
  color: #7fff00;
}

.result.loss {
  color: #00bfff;
}

.score {
  font-size: 1.2rem;
  font-weight: 500;
}

.pitcher-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #7fff00;
}

.stat {
  font-size: 1.1rem;
  font-weight: 500;
  color: #00bfff;
}

/* Refined transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 500px;
  opacity: 1;
  margin-top: 1rem;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive layout */
@media (max-width: 768px) {
  .game-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .game-summary {
    border-bottom: 1px solid rgba(75, 0, 130, 0.5);
    padding-bottom: 1rem;
  }

  .pitcher-details {
    padding-top: 0.5rem;
  }
}

/* Additional responsive adjustments */
@media (max-width: 480px) {
  .summary-row,
  .pitcher-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .game-card {
    padding: 1rem;
  }
}
</style>
