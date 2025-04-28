<script setup>
defineProps({
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
  isVisible: {
    type: Boolean,
    default: false,
  },
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
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const handleClickOutside = (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="handleClickOutside">
      <div class="modal-content">
        <button class="close-button" @click="handleClose">×</button>
        <div class="stats-container">
          <div class="row label-row">
            <div class="pitcher-label">
              Starting Pitcher on {{ date }} {{ location }} {{ opponent }}
            </div>
          </div>
          <div class="row pitcher-row">
            <h2>{{ pitcher }}</h2>
          </div>
          <div class="row stats-row">
            <div class="stat">
              <label>IP:</label>
              <span>{{ inningsPitched }}</span>
            </div>
            <div class="stat">
              <label>K:</label>
              <span>{{ strikeouts }}</span>
            </div>
          </div>
          <div class="row stats-row">
            <div class="stat">
              <label>BB:</label>
              <span>{{ baseOnBalls }}</span>
            </div>
            <div class="stat">
              <label>ER:</label>
              <span>{{ earnedRuns }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.stat {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.stat label {
  color: #00bfff;
  font-size: 0.9rem;
  font-weight: bold;
}

.stat span {
  color: white;
  font-size: 1.2rem;
}

.modal-content {
  background: black;
  padding: 1.5rem; /* Reduced padding */
  border-radius: 8px;
  position: relative;
  width: 90%;
  max-width: 300px; /* Reduced max-width */
  border: 1px solid #4b0082;
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.2);
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Reduced gap */
}

.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #7fff00;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.row {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.label-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pitcher-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pitcher-label {
  color: #00bfff;
  font-size: 0.9rem;
  font-weight: bold;
}

.pitcher-row h2 {
  color: #7fff00;
  margin: 0;
  font-size: 1.5rem;
}

.stats-row {
  justify-content: flex-start;
}
</style>
