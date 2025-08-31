<template>
  <div class="progress-container">
    <svg class="progress-ring" :width="size" :height="size">
      <circle class="progress-ring__background" :r="radius" :cx="center" :cy="center" />
      <circle
        class="progress-ring__circle"
        :r="radius"
        :cx="center"
        :cy="center"
        :style="circleStyle"
      />
    </svg>
    <div class="progress-text">{{ progress }}%</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0,
  },
  size: {
    type: Number,
    default: 220,
  },
  stroke: {
    type: Number,
    default: 12,
  },
  color: {
    type: String,
    default: '#2a3dc3',
  },
})

const radius = computed(() => (props.size - props.stroke) / 2)
const center = computed(() => props.size / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value - (props.progress / 100) * circumference.value)

const circleStyle = computed(() => ({
  strokeDasharray: `${circumference.value} ${circumference.value}`,
  strokeDashoffset: offset.value,
  stroke: props.color,
}))
</script>
