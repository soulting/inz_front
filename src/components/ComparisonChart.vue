<!-- ComparisonChart.vue - Uniwersalny komponent do porównań -->
<template>
  <div class="comparison-chart" :class="`comparison-chart--${size}`">
    <div v-if="title || showHeaderValue" class="comparison-chart__header">
      <h3 v-if="title" class="comparison-chart__title">{{ title }}</h3>
      <div v-if="showHeaderValue" class="comparison-chart__value" :class="percentageClass">
        {{ displayPercentage }}
      </div>
    </div>

    <div class="comparison-chart__content">
      <!-- Tryb: Progress Bar -->
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

      <!-- Tryb: Radial (koncentryczne pierścienie) -->
      <template v-else-if="displayMode === 'radial'">
        <div class="radial-display">
          <svg :width="radialSize" :height="radialSize" class="radial-display__svg">
            <!-- Tło zewnętrznego pierścienia -->
            <circle
              :cx="radialCenter"
              :cy="radialCenter"
              :r="outerRadius"
              fill="none"
              :stroke-width="strokeWidth"
              stroke="#e2e8f0"
            />
            <!-- Wypełnienie zewnętrznego pierścienia (actual) -->
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
            <!-- Tło wewnętrznego pierścienia -->
            <circle
              :cx="radialCenter"
              :cy="radialCenter"
              :r="innerRadius"
              fill="none"
              :stroke-width="strokeWidth"
              stroke="#e2e8f0"
            />
            <!-- Wypełnienie wewnętrznego pierścienia (expected - zawsze 100%) -->
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

      <!-- Tryb: Side by side bars -->
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
  // Wartości
  actual: {
    type: Number,
    required: true,
  },
  expected: {
    type: Number,
    required: true,
  },

  // Formatowanie
  unit: {
    type: String,
    default: '', // 'time', 'number', 'currency', custom
  },
  formatter: {
    type: Function,
    default: null,
  },

  // Etykiety
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

  // Wygląd
  displayMode: {
    type: String,
    default: 'progress', // 'progress', 'radial', 'bars'
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

  // Kolory progów
  thresholds: {
    type: Object,
    default: () => ({
      good: { max: 100, color: '#10b981' },
      warning: { max: 120, color: '#eab308' },
      danger: { color: '#dc2626' },
    }),
  },
})

// Obliczenia
const percentage = computed(() => (props.actual / props.expected) * 100)

const displayPercentage = computed(() => `${Math.round(percentage.value)}%`)

// Formatowanie wartości
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

// Kolory na podstawie progów
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

// Radial display calculations
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

<style scoped lang="scss">
.comparison-chart {
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

    &--good {
      color: #10b981;
    }
    &--warning {
      color: #eab308;
    }
    &--danger {
      color: #dc2626;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
}

// Progress bar mode
.comparison-display {
  width: 100%;

  &__values {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    margin-bottom: 1.5rem;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__value {
    font-size: 1.4rem;
    font-weight: 700;
    color: #374151;
  }

  &__label {
    font-size: 0.85rem;
    color: #64748b;
    margin-top: 0.25rem;
    font-weight: 500;
  }

  &__separator {
    font-size: 1.5rem;
    font-weight: 300;
    color: #94a3b8;
  }
}

.progress-container {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  overflow: visible;
  position: relative;

  &__fill {
    height: 100%;
    border-radius: 5px;
    transition: width 0.3s ease;

    &--good {
      background: #10b981;
    }
    &--warning {
      background: #eab308;
    }
    &--danger {
      background: #dc2626;
    }
  }

  &__marker {
    position: absolute;
    top: -20px;
    transform: translateX(-50%);

    &-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
      white-space: nowrap;
    }
  }
}

// Radial mode
.radial-display {
  position: relative;

  &__svg {
    transform: scale(1);
  }

  &__center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &__percentage {
    font-size: 1.75rem;
    font-weight: 700;
    color: #374151;
    line-height: 1;
  }

  &__labels {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__actual {
    font-weight: 600;
  }

  &__divider {
    color: #94a3b8;
  }

  &__expected {
    color: #94a3b8;
  }
}

// Bars mode
.bars-display {
  display: flex;
  gap: 2rem;
  align-items: flex-end;
  height: 70%;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 100%;
    justify-content: flex-end;
  }

  &__bar {
    width: 60px;
    background: #4f46e5;
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease;
    margin-bottom: 0.5rem;

    &--expected {
      background: #94a3b8;
    }
  }

  &__value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  &__label {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .comparison-chart {
    width: 100%;
    max-width: 350px;
  }
}
</style>
