<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as d3 from 'd3'

/** I put validators here while I was experimenting with games in-progress
 * Mocking up test data got squirrely, so I added a validator for sanity
 */
const props = defineProps({
  games: {
    type: Array,
    required: true,
    validator: (value) =>
      value.every(
        (game) => 'date' in game && 'opponent' in game && 'result' in game && 'pitcher' in game,
      ),
  },
  height: {
    type: Number,
    default: 100,
  },
})

const svgRef = ref(null)
const containerWidth = ref(0)
const selectedGame = ref(null)
const hoveredGame = ref(null)

let cleanup = null
/** when the component loads in, we need to track the state of the tick marks.
 * we track their state because we have animations, hover events, and other components
 *  that depend on knowing about these state changes.
 */
onMounted(() => {
  /**
   * Handles click events outside of the selected game marker.
   * If a game is currently selected and the click occurs outside the SVG element:
   * 1. Deselects the currently selected game
   * 2. Resets the scale of the marker rectangle to original size
   * 3. Returns markers to their original positions
   * 4. Fades out the tooltip
   */
  const handleOutsideClick = (event) => {
    if (selectedGame.value && !svgRef.value?.contains(event.target)) {
      const svg = d3.select(svgRef.value)
      const markers = svg.selectAll('.game-marker')

      selectedGame.value = null

      /* Reset all markers*/
      markers.select('rect').transition().duration(200).attr('transform', 'scale(1, 1)')

      markers
        .transition()
        .duration(200)
        .attr('transform', (d, i) => `translate(${x(i)},0)`)

      markers.select('.tooltip-group').transition().duration(200).attr('opacity', 0)
    }
  }

  document.addEventListener('click', handleOutsideClick)
  cleanup = () => document.removeEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  if (cleanup) cleanup()
})

const drawSparkline = () => {
  /** step one: validate our requirements
   * we need the svg reference and a container width to draw anything
   */
  if (!svgRef.value || !containerWidth.value) return

  /** step two: clear existing content
   * this ensures we're working with a clean slate each redraw
   */
  d3.select(svgRef.value).selectAll('*').remove()

  /** step three: transform the games data
   * we create an array of objects with:
   * - date: converted to Date object
   * - value: 1 for wins, -1 for losses, 0 for unplayed/ties
   * - original: keep reference to original game data for interactions
   */
  const data = props.games.map((game) => ({
    date: new Date(game.date),
    value: game.result === 'Win' ? 1 : game.result === 'Loss' ? -1 : 0,
    original: game,
  }))

  /** step four: create our scales
   * (a) x scale: band scale for discrete game positions
   * (b) y scale: linear scale for win/loss values with padding
   */
  const x = d3
    .scaleBand()
    .range([0, containerWidth.value])
    .padding(0.1)
    .domain(data.map((_, i) => i))

  const y = d3
    .scaleLinear()
    .domain([-1.2, 1.2])
    .range([props.height - 0.5, 0.5])

  /** step five: select our SVG element
   * this is our canvas for drawing
   */
  const svg = d3.select(svgRef.value)

  /** step six: add the center line
   * this provides visual reference for wins/losses
   */
  svg
    .append('line')
    .attr('x1', 0)
    .attr('x2', containerWidth.value)
    .attr('y1', y(0))
    .attr('y2', y(0))
    .attr('stroke', '#4B0082')
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.3)

  /** step seven: create our game markers group */
  const markers = svg
    .selectAll('.game-marker')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'game-marker')
    .attr('transform', (d, i) => `translate(${x(i)},0)`)

  /** step eight: add the rectangles to each marker group */
  markers
    .append('rect')
    .attr('y', (d) => y(Math.max(0, d.value)))
    .attr('fill', (d) => (d.value === 0 ? '#707070' : d.value > 0 ? '#7FFF00' : '#00BFFF'))
    .attr('height', (d) => Math.abs(y(d.value) - y(0)))
    .attr('width', x.bandwidth())
    .style('cursor', 'pointer')

  /** step nine: update tooltip group with single line */
  markers
    .append('g')
    .attr('class', 'tooltip-group')
    .attr('opacity', 0)
    .call((g) => {
      /** tooltip position tracking */
      const getTooltipY = (d) => {
        const height = Math.abs(y(d.value) - y(0))
        const baseY = y(Math.max(0, d.value))
        return d.value > 0
          ? baseY - 25 // Position above wins
          : baseY + height + 25 // Position below losses
      }

      /** tooltip background */
      g.append('rect')
        .attr('class', 'tooltip-bg')
        .attr('x', x.bandwidth() / 2 - 60) // Wider to fit all text
        .attr('y', (d) => getTooltipY(d) - 10)
        .attr('width', 120)
        .attr('height', 20) // Single line height
        .attr('fill', 'rgba(0, 0, 0, 0.8)')
        .attr('rx', 4)
        .attr('ry', 4)
        .style('stroke', '#4B0082')
        .style('stroke-width', '1px')

      /** tooltip text */
      g.append('text')
        .attr('class', 'tooltip-text')
        .attr('x', x.bandwidth() / 2)
        .attr('y', getTooltipY)
        .attr('text-anchor', 'middle')
        .attr('fill', '#7FFF00')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text((d) => `${d.original.date} ${d.original.location} ${d.original.opponent}`)
    })

  /** step ten: modify hover interactions */
  markers
    /* mouseenter: Handles hover state
     * - Scales up the hovered marker vertically (1.4x)
     * - Shows tooltip above/below marker depending on if it's a win/loss
     * - Updates hoveredGame reactive reference
     */
    .on('mouseenter', (event, d) => {
      if (selectedGame.value !== d.original) {
        hoveredGame.value = d.original
        const marker = d3.select(event.currentTarget)
        const rect = marker.select('rect')
        const tooltip = marker.select('.tooltip-group')
        const transformOrigin = d.value > 0 ? 'bottom' : 'top'

        rect
          .style('transform-origin', transformOrigin)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1, 1.4)')

        /* Move tooltip with the scaled tick mark*/
        tooltip
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('transform', d.value > 0 ? 'translate(0, -8)' : 'translate(0, 8)') // Shift tooltip up/down based on win/loss
      }
    })

    /* mouseleave: Handles exit from hover state
     * - Resets marker scale to normal
     * - Hides tooltip
     * - Clears hoveredGame reactive reference
     */
    .on('mouseleave', (event, d) => {
      if (selectedGame.value !== d.original) {
        hoveredGame.value = null
        const marker = d3.select(event.currentTarget)
        const rect = marker.select('rect')
        const tooltip = marker.select('.tooltip-group')

        rect.transition().duration(200).attr('transform', 'scale(1, 1)')

        tooltip.transition().duration(200).attr('opacity', 0).attr('transform', 'translate(0, 0)') // Reset tooltip position
      }
    })
    /* click: Handles selection state
     * - Expands clicked marker (5x width, 2x height)
     * - Shifts adjacent markers outward to make room
     * - Handles deselection and switching between selections
     * - Updates selectedGame reactive reference */
    .on('click', (event, d) => {
      const marker = d3.select(event.currentTarget)
      const rect = marker.select('rect')
      const currentIndex = data.indexOf(d)
      const bandWidth = x.bandwidth()
      const expandedWidth = bandWidth * 5
      const shiftDistance = (expandedWidth - bandWidth) / 2
      const transformOrigin = d.value > 0 ? 'bottom' : 'top'

      if (selectedGame.value === d.original) {
        selectedGame.value = null

        /* Reset clicked marker */
        rect.transition().duration(200).attr('transform', 'scale(1, 1)')

        /* Reset all marker positions */
        markers
          .transition()
          .duration(200)
          .attr('transform', (d, i) => `translate(${x(i)},0)`)

        marker.select('.tooltip-group').transition().duration(200).attr('opacity', 0)
      } else if (selectedGame.value && selectedGame.value !== d.original) {
        const previousMarker = svg
          .selectAll('.game-marker')
          .filter((d) => d.original === selectedGame.value)

        /* Reset previous marker*/
        previousMarker.select('rect').transition().duration(200).attr('transform', 'scale(1, 1)')

        previousMarker.select('.tooltip-group').transition().duration(200).attr('opacity', 0)

        /* Reset positions then apply new selection*/
        markers
          .transition()
          .duration(200)
          .attr('transform', (d, i) => `translate(${x(i)},0)`)
          .end()
          .then(() => {
            selectedGame.value = d.original

            rect
              .style('transform-origin', transformOrigin)
              .transition()
              .duration(200)
              .attr('transform', 'scale(5, 2)')

            /* Apply new shifts*/
            markers.each(function (otherD, i) {
              if (i !== currentIndex) {
                const shift = i < currentIndex ? -shiftDistance : shiftDistance
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr('transform', `translate(${x(i) + shift},0)`)
              }
            })
          })
      } else {
        selectedGame.value = d.original

        rect
          .style('transform-origin', transformOrigin)
          .transition()
          .duration(200)
          .attr('transform', 'scale(5, 2)')

        /* Shift other markers*/
        markers.each(function (otherD, i) {
          if (i !== currentIndex) {
            const shift = i < currentIndex ? -shiftDistance : shiftDistance
            d3.select(this)
              .transition()
              .duration(200)
              .attr('transform', `translate(${x(i) + shift},0)`)
          }
        })
      }
    })
}

/* Resize observer */
onMounted(() => {
  /**
   * Sets up a ResizeObserver to monitor changes in the parent element's width
   * and updates the sparkline visualization accordingly.
   *
   * Creates a ResizeObserver that:
   * - Updates containerWidth ref when parent element size changes
   * - Triggers redraw of sparkline on resize
   * - Starts observing parent element if it exists
   * - Returns cleanup function to disconnect observer when component unmounts
   */
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerWidth.value = entry.contentRect.width
    }
    drawSparkline()
  })

  if (svgRef.value?.parentElement) {
    resizeObserver.observe(svgRef.value.parentElement)
  }

  return () => resizeObserver.disconnect()
})

/* Watch for data changes */
watch(() => props.games, drawSparkline, { deep: true })
watch(
  () => selectedGame.value,
  (game) => {
    /* Trigger pitcher stats modal when a game is selected */
    if (game) {
      emit('showPitcherStats', game)
    }
  },
)

const emit = defineEmits(['showPitcherStats', 'game-selected'])

/* Modify click handler */
watch(
  () => selectedGame.value,
  (game) => {
    emit('game-selected', game) // Emit null when unselected
  },
)
</script>

<template>
  <div class="sparkline-wrapper">
    <div class="sparkline-container">
      <svg :width="containerWidth" ref="svgRef" :height="height" overflow="visible"></svg>
    </div>
  </div>
</template>

<style scoped>
.sparkline-wrapper {
  width: 100%;
  padding: 20px;
  overflow: visible;
  position: relative;
}

.sparkline-container {
  width: 100%;
  position: relative;
  overflow: visible;
}

.hover-info {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  pointer-events: none;
  z-index: 10;
}

:deep(svg) {
  overflow: visible;
  position: relative;
  z-index: 1;
}

:deep(.game-marker) {
  cursor: pointer;
  overflow: visible;
}

:deep(.tooltip) {
  transition: opacity 0.2s ease;
}

:deep(.game-marker:hover .tooltip) {
  opacity: 1;
}

:deep(rect) {
  transform-origin: bottom; /* Default, will be overridden by JS */
  transform-box: fill-box;
  transition: transform 0.2s ease;
  position: relative;
  z-index: 1;
  will-change: transform; /* Optimize transform performance */
}

:deep(.game-marker:hover) {
  z-index: 100; /* Increased z-index to ensure hover state appears above everything */
}

:deep(.tooltip-text) {
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  font-weight: bold;
}

:deep(.tooltip-group) {
  transition: transform 0.2s ease;
  will-change: transform;
  pointer-events: none;
  filter: drop-shadow(0 0 8px rgba(75, 0, 130, 0.4));
}

:deep(.tooltip-bg) {
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.2);
}
</style>
