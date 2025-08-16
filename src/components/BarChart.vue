<!-- BarChart.vue - Uniwersalny komponent wykresu słupkowego -->
<template>
  <div class="bar-chart-container" :class="`bar-chart-container--${size}`">
    <div v-if="title || showHeaderValue" class="bar-chart-container__header">
      <h3 v-if="title" class="bar-chart-container__title">{{ title }}</h3>
      <div v-if="showHeaderValue" class="bar-chart-container__value">
        {{ headerValue || computedHeaderValue }}
      </div>
    </div>
    <div class="bar-chart-container__content">
      <div class="bar-chart-wrapper">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { Bar } from 'vue-chartjs'

import { computed } from 'vue'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  // Dane wykresu
  data: {
    type: [Array, Object],
    required: true,
  },
  labels: {
    type: Array,
    default: () => [],
  },

  // Teksty
  title: {
    type: String,
    default: '',
  },
  xAxisTitle: {
    type: String,
    default: '',
  },
  yAxisTitle: {
    type: String,
    default: '',
  },

  // Wartość w nagłówku
  showHeaderValue: {
    type: Boolean,
    default: false,
  },
  headerValue: {
    type: [String, Number],
    default: null,
  },
  headerValueMode: {
    type: String,
    default: 'max', // 'max', 'sum', 'average', 'custom'
    validator: (v) => ['max', 'sum', 'average', 'custom'].includes(v),
  },

  // Wygląd
  colors: {
    type: [String, Array],
    default: '#4f46e5',
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v),
  },

  // Opcje wykresu
  showTooltip: {
    type: Boolean,
    default: true,
  },
  tooltipLabels: {
    type: Object,
    default: () => ({
      singular: 'wartość',
      plural: 'wartości',
    }),
  },
  showGrid: {
    type: Boolean,
    default: true,
  },
  beginAtZero: {
    type: Boolean,
    default: true,
  },
})

// Przetwarzanie danych
const processedData = computed(() => {
  if (Array.isArray(props.data)) {
    return props.data
  } else if (typeof props.data === 'object') {
    // Jeśli data to obiekt, konwertuj na tablicę
    return Object.values(props.data)
  }
  return []
})

const processedLabels = computed(() => {
  if (props.labels.length > 0) {
    return props.labels
  } else if (typeof props.data === 'object' && !Array.isArray(props.data)) {
    return Object.keys(props.data)
  }
  return processedData.value.map((_, i) => `${i + 1}`)
})

// Obliczanie wartości nagłówka
const computedHeaderValue = computed(() => {
  if (props.headerValue !== null) return props.headerValue

  const values = processedData.value
  switch (props.headerValueMode) {
    case 'max':
      const maxIndex = values.indexOf(Math.max(...values))
      return processedLabels.value[maxIndex]
    case 'sum':
      return values.reduce((a, b) => a + b, 0)
    case 'average':
      return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    default:
      return ''
  }
})

// Konfiguracja wykresu
const chartData = computed(() => ({
  labels: processedLabels.value,
  datasets: [
    {
      data: processedData.value,
      backgroundColor: Array.isArray(props.colors) ? props.colors : props.colors,
      borderColor: Array.isArray(props.colors) ? props.colors : props.colors,
      borderWidth: 1,
      borderRadius: 4,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: props.showTooltip
      ? {
          backgroundColor: '#1f2937',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: Array.isArray(props.colors) ? props.colors[0] : props.colors,
          borderWidth: 1,
          cornerRadius: 8,
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: function (context) {
              const count = context.parsed.y
              const label = count === 1 ? props.tooltipLabels.singular : props.tooltipLabels.plural
              return `${count} ${label}`
            },
          },
        }
      : { enabled: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#6b7280',
        font: { size: 12, weight: '500' },
      },
      title: props.xAxisTitle
        ? {
            display: true,
            text: props.xAxisTitle,
            font: { size: 12 },
            color: '#6b7280',
          }
        : { display: false },
    },
    y: {
      beginAtZero: props.beginAtZero,
      grid: props.showGrid
        ? {
            color: '#f3f4f6',
            lineWidth: 1,
          }
        : { display: false },
      ticks: {
        precision: 0,
        color: '#6b7280',
        font: { size: 12, weight: '500' },
      },
      title: props.yAxisTitle
        ? {
            display: true,
            text: props.yAxisTitle,
            font: { size: 12 },
            color: '#6b7280',
          }
        : { display: false },
    },
  },
}))

// Rozmiary
const sizeClasses = {
  small: { width: '240px', height: '220px', chart: '140px' },
  medium: { width: '320px', height: '300px', chart: '180px' },
  large: { width: '400px', height: '380px', chart: '240px' },
}

const currentSize = computed(() => sizeClasses[props.size])
</script>

<style scoped lang="scss">
.bar-chart-container {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;

  &--small {
    width: 240px;
    height: 220px;
  }

  &--medium {
    width: 320px;
    height: 300px;
  }

  &--large {
    width: 400px;
    height: 380px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }

  &__value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #4f46e5;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
}

.bar-chart-wrapper {
  width: 100%;
  position: relative;

  .bar-chart-container--small & {
    height: 140px;
  }

  .bar-chart-container--medium & {
    height: 180px;
  }

  .bar-chart-container--large & {
    height: 240px;
  }

  canvas {
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .bar-chart-container {
    width: 100%;
    max-width: 350px;
  }
}
</style>
