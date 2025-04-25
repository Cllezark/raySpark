<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  games: {
    type: Array,
    required: true,
  },
  height: {
    type: Number,
    default: 100,
  },
})

const svgRef = ref(null)
const containerWidth = ref(0)

// Add resize observer to update width
onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerWidth.value = entry.contentRect.width * 0.9 // 90% of container width
    }
    drawSparkline()
  })

  if (svgRef.value?.parentElement) {
    resizeObserver.observe(svgRef.value.parentElement)
  }

  return () => resizeObserver.disconnect()
})

const drawSparkline = () => {
  if (!svgRef.value || !props.games.length || !containerWidth.value) return

  // Clear existing content
  d3.select(svgRef.value).selectAll('*').remove()

  // Transform games data for sparkline
  const data = props.games.map((game) => ({
    date: new Date(game.date),
    value: game.result === 'Win' ? 1 : game.result === 'Loss' ? -1 : 0,
  }))

  const x = d3
    .scaleBand()
    .range([0, containerWidth.value])
    .padding(0.1)
    .domain(data.map((d) => d.date))

  const y = d3
    .scaleLinear()
    .domain([-1.2, 1.2]) // Slightly larger than -1 to 1 for visual padding
    .range([props.height - 0.5, 0.5])

  const svg = d3.select(svgRef.value)

  // Add the bars
  svg
    .append('g')
    .attr('stroke-opacity', 0.8)
    .attr('stroke-width', 0.1)
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.date))
    .attr('y', (d) => y(Math.max(0, d.value)))
    .attr('fill', (d) => (d.value === 0 ? '#707070' : d.value > 0 ? '#7FFF00' : '#00BFFF'))
    .attr('height', (d) => Math.abs(y(d.value) - y(0)))
    .attr('width', x.bandwidth())

  // Add a center line
  svg
    .append('line')
    .attr('x1', 0)
    .attr('x2', props.width)
    .attr('y1', y(0))
    .attr('y2', y(0))
    .attr('stroke', '#4B0082')
    .attr('stroke-width', 0.5)
    .attr('stroke-opacity', 0.3)
}

// Watch for changes in games data
watch(() => props.games, drawSparkline, { deep: true })

onMounted(drawSparkline)
</script>

<template>
  <div class="sparkline-container">
    <svg :width="containerWidth" :height="height" ref="svgRef"></svg>
  </div>
</template>

<style scoped>
.sparkline-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  display: block;
}
</style>
