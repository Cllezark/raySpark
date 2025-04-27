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

/** Add resize observer to update width*/
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
/** let's step through how I made this sparkline work */
const drawSparkline = () => {
  /* step one: check if svgRef, games, and containerWidth are available */
  if (!svgRef.value || !props.games.length || !containerWidth.value) return

  /* step two: clear existing content in the SVG (it's always good to start fresh!) */
  d3.select(svgRef.value).selectAll('*').remove()

  /* step three: transform the games data into a (date, 1/-1) object
   *** values with a positive result are 1, negative results are -1, and ties are 0.
   *** ties only come up in spring training, so I'm ignoring them for now.
   */
  const data = props.games.map((game) => ({
    date: new Date(game.date),
    value: game.result === 'Win' ? 1 : game.result === 'Loss' ? -1 : 0,
  }))
  /** step four (a): set our x axis to be a band scale, with the date as the domain */
  const x = d3
    .scaleBand()
    .range([0, containerWidth.value])
    .padding(0.1)
    .domain(data.map((d) => d.date))

  /** step four (b): set our y axis to be a linear scale, with a domain of -1.2 to 1.2
   *  *** this is slightly larger than -1 to 1 for visual padding
   */
  const y = d3
    .scaleLinear()
    .domain([-1.2, 1.2]) // Slightly larger than -1 to 1 for visual padding
    .range([props.height - 0.5, 0.5])

  /** step five: select the SVG element and append a group for the bars */
  const svg = d3.select(svgRef.value)

  /** step six (a): append the bars to the group, setting their x, y, fill, height, and width
   * step six (b): set the fill color based on the value (0 = gray, 1 = green, -1 = blue)
   * step six (c): set the height of the bars based on the value
   * step six (d): set the width of the bars based on the x scale
   */
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
}

/* Watch for changes in games data */
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

/* My D3 sparkline does not render properly in Firefox, so I'm hiding it. */
/* Oh my, it also fails to render in Safari. Listen, I promise you I'm not a bum.  */

@-moz-document url-prefix() {
  svg {
    display: none;
  }
  .sparkline-container::before {
    content: "🦊 Firefox said you can't see this D3 graphic. If I had more time I would fix this first.";
  }
}
</style>
