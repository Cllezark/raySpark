<script setup>
import { computed } from 'vue'

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  opponent: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  'data-game-pk': {
    type: [String, Number],
    required: true,
  },
  pitcher: {
    type: String,
    required: true,
  },
  inningsPitched: {
    type: [String, Number],
    required: true,
  },
  strikeouts: {
    type: [String, Number],
    required: true,
  },
  baseOnBalls: {
    type: [String, Number],
    required: true,
  },
  earnedRuns: {
    type: [String, Number],
    required: true,
  },
})

const squareColor = computed(() => props.result?.toLowerCase() || '')
</script>

<template>
  <div
    class="game-square"
    :class="[squareColor]"
    :data-game-pk="$attrs['data-game-pk']"
    @click="$emit('showStats')"
  >
    <div class="date">{{ date }}</div>
    <div class="content">
      <div class="opponent">
        <small>{{ location }}</small>
        {{ opponent }}
      </div>
      <div class="score">
        <span>{{ result.charAt(0) }}</span> {{ score }}
      </div>
    </div>
    <div class="hover-text">🔍 Pitcher Stats</div>
  </div>
</template>

<style scoped>
.game-square {
  aspect-ratio: 1;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  color: white;
  font-family: sans-serif;
  transition: all 0.2s ease;
}

.game-square:hover {
  transform: scale(1.1);
  z-index: 1;
}

.win {
  background-color: #008000;
}

.loss {
  background-color: #bf0000;
}

.date {
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.opponent {
  font-size: 1rem;
  font-weight: bold;
}

.score {
  font-size: 0.9rem;
}

.center {
  padding: 0.5rem;
  justify-content: flex-start;
  text-align: left;
}

.center .content {
  gap: 0.5rem;
}

.center:hover {
  transform: scale(1.1);
}

.hover-text {
  position: absolute;
  bottom: 0.5rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: rgba(255, 255, 255, 0.9);
  pointer-events: none;
}

.game-square {
  position: relative;
}

.game-square:hover .hover-text {
  opacity: 1;
}
</style>
