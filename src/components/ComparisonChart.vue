<template>
  <div class="comparison-chart" :class="`comparison-chart--${size}`">
    <div v-if="title || showHeaderValue" class="comparison-chart__header">
      <h3 v-if="title" class="comparison-chart__title">{{ title }}</h3>
      <div v-if="showHeaderValue" class="comparison-chart__value" :class="percentageClass">
        {{ displayPercentage }}
      </div>
    </div>

    <div class="comparison-chart__content">
      <template v-if="displayMode === 'progress'">
        <div class="comparison-display">
          <div class="comparison-display__values">
            <div class="comparison-display__item">
              <span class="comparison-display__value">{{ formattedActual }}</span>
              <span class="comparison-display__label">{{ actualLabel }}</span>
            </div>
            <div class="comparison-display__separator">/</div>
            <div class="comparison-display__item">
              <span class="comparison-display__value">{{ formattedExpected }}</span>
              <span class="comparison-display__label">{{ expectedLabel }}</span>
            </div>
          </div>
          <div class="progress-container">
            <div class="progress-bar">
              <div
                class="progress-bar__fill"
                :class="progressBarClass"
                :style="{ width: Math.min(100, percentage) + '%' }"
              ></div>
              <div
                v-if="showMarker && percentage > 100"
                class="progress-bar__marker"
                :style="{ left: '100%' }"
              >
                <span class="progress-bar__marker-label">{{ markerLabel }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="displayMode === 'radial'">
        <div class="radial-display">
          <svg :width="radialSize" :height="radialSize" class="radial-display__svg">
            <circle
              :cx="radialCenter"
              :cy="radialCenter"
              :r="outerRadius"
              fill="none"
              :stroke-width="strokeWidth"
              stroke="#e2e8f0"
            />

            <circle
              :cx="radialCenter"
              :cy="radialCenter"
              :r="outerRadius"
              fill="none"
              :stroke-width="strokeWidth"
              :stroke="getColorByPercentage()"
              :stroke-dasharray="outerCircumference"
              :stroke-dashoffset="outerOffset"
              transform-origin="center"
              :transform="`rotate(-90 ${radialCenter} ${radialCenter})`"
            />

            <circle
              :cx="radialCenter"
              :cy="radialCenter"
              :r="innerRadius"
              fill="none"
              :stroke-width="strokeWidth"
              stroke="#e2e8f0"
            />

            <circle
              :cx="radialCenter"
              :cy="radialCenter"
              :r="innerRadius"
              fill="none"
              :stroke-width="strokeWidth"
              stroke="#94a3b8"
              :stroke-dasharray="innerCircumference"
              :stroke-dashoffset="0"
              transform-origin="center"
              :transform="`rotate(-90 ${radialCenter} ${radialCenter})`"
            />
          </svg>
          <div class="radial-display__center">
            <div class="radial-display__percentage">{{ displayPercentage }}</div>
            <div class="radial-display__labels">
              <span class="radial-display__actual">{{ formattedActual }}</span>
              <span class="radial-display__divider">/</span>
              <span class="radial-display__expected">{{ formattedExpected }}</span>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="displayMode === 'bars'">
        <div class="bars-display">
          <div class="bars-display__item">
            <div
              class="bars-display__bar"
              :style="{
                height: Math.min(100, percentage) + '%',
                backgroundColor: getColorByPercentage(),
              }"
            ></div>
            <span class="bars-display__value">{{ formattedActual }}</span>
            <span class="bars-display__label">{{ actualLabel }}</span>
          </div>
          <div class="bars-display__item">
            <div class="bars-display__bar bars-display__bar--expected" style="height: 100%"></div>
            <span class="bars-display__value">{{ formattedExpected }}</span>
            <span class="bars-display__label">{{ expectedLabel }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  actual: {
    type: Number,
    required: true,
  },
  expected: {
    type: Number,
    required: true,
  },

  unit: {
    type: String,
    default: '',
  },
  formatter: {
    type: Function,
    default: null,
  },

  title: {
    type: String,
    default: '',
  },
  actualLabel: {
    type: String,
    default: 'Rzeczywisty',
  },
  expectedLabel: {
    type: String,
    default: 'Oczekiwany',
  },
  markerLabel: {
    type: String,
    default: '100%',
  },

  displayMode: {
    type: String,
    default: 'progress',
    validator: (v) => ['progress', 'radial', 'bars'].includes(v),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v),
  },
  showHeaderValue: {
    type: Boolean,
    default: true,
  },
  showMarker: {
    type: Boolean,
    default: true,
  },

  thresholds: {
    type: Object,
    default: () => ({
      good: { max: 100, color: '#10b981' },
      warning: { max: 120, color: '#eab308' },
      danger: { color: '#dc2626' },
    }),
  },
})

const percentage = computed(() => (props.actual / props.expected) * 100)

const displayPercentage = computed(() => `${Math.round(percentage.value)}%`)

const formatValue = (value) => {
  if (props.formatter) {
    return props.formatter(value)
  }

  switch (props.unit) {
    case 'time':
      return formatTime(value)
    case 'currency':
      return `${value.toFixed(2)} zł`
    case 'number':
      return value.toString()
    default:
      return value.toString()
  }
}

const formatTime = (seconds) => {
  const rounded = Math.round(seconds)
  if (rounded < 60) return `${rounded}s`
  const minutes = Math.floor(rounded / 60)
  const secs = rounded % 60
  return secs === 0 ? `${minutes}min` : `${minutes}min ${secs}s`
}

const formattedActual = computed(() => formatValue(props.actual))
const formattedExpected = computed(() => formatValue(props.expected))

const getColorByPercentage = () => {
  const pct = percentage.value
  if (pct <= props.thresholds.good.max) return props.thresholds.good.color
  if (props.thresholds.warning?.max && pct <= props.thresholds.warning.max) {
    return props.thresholds.warning.color
  }
  return props.thresholds.danger.color
}

const percentageClass = computed(() => {
  const pct = percentage.value
  if (pct <= props.thresholds.good.max) return 'comparison-chart__value--good'
  if (props.thresholds.warning?.max && pct <= props.thresholds.warning.max) {
    return 'comparison-chart__value--warning'
  }
  return 'comparison-chart__value--danger'
})

const progressBarClass = computed(() => {
  const pct = percentage.value
  if (pct <= props.thresholds.good.max) return 'progress-bar__fill--good'
  if (props.thresholds.warning?.max && pct <= props.thresholds.warning.max) {
    return 'progress-bar__fill--warning'
  }
  return 'progress-bar__fill--danger'
})

const radialSizes = {
  small: 120,
  medium: 160,
  large: 200,
}

const radialSize = computed(() => radialSizes[props.size])
const radialCenter = computed(() => radialSize.value / 2)
const strokeWidth = props.size === 'small' ? 8 : props.size === 'large' ? 12 : 10
const outerRadius = computed(() => radialCenter.value - strokeWidth - 2)
const innerRadius = computed(() => outerRadius.value - strokeWidth - 4)

const outerCircumference = computed(() => 2 * Math.PI * outerRadius.value)
const innerCircumference = computed(() => 2 * Math.PI * innerRadius.value)

const outerOffset = computed(() => {
  const pct = Math.min(percentage.value, 100) / 100
  return outerCircumference.value * (1 - pct)
})
</script>
