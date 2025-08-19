<!-- PieChart.vue - Uniwersalny komponent wykresu kołowego -->
<template>
  <div class="pie-chart">
    <h3 v-if="title" class="pie-chart__title">{{ title }}</h3>
    <div class="pie-chart__content">
      <div class="pie-chart__wrapper">
        <Doughnut :data="chartData" :options="chartOptions" />
        <div class="pie-chart__overlay">
          <div class="pie-chart__value">{{ displayValue }}</div>
          <div v-if="label" class="pie-chart__label">{{ label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArcElement, Chart as ChartJS } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

import { computed } from 'vue'

ChartJS.register(ArcElement)

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  unit: {
    type: String,
    default: '%',
  },
  colors: {
    type: Array,
    default: () => ['#4f46e5', '#e2e8f0'],
  },
  threshold: {
    type: Number,
    default: null,
  },
  lowColor: {
    type: String,
    default: '#dc2626',
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v),
  },
})

const displayValue = computed(() => `${Math.round(props.value)}${props.unit}`)

const chartData = computed(() => ({
  datasets: [
    {
      data: [props.value, 100 - props.value],
      backgroundColor: [
        props.threshold !== null && props.value < props.threshold
          ? props.lowColor
          : props.colors[0],
        props.colors[1],
      ],
      borderWidth: 0,
      cutout: '75%',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
}

const sizeClasses = {
  small: { width: '240px', height: '220px', chart: '120px' },
  medium: { width: '320px', height: '300px', chart: '160px' },
  large: { width: '400px', height: '380px', chart: '200px' },
}

const currentSize = computed(() => sizeClasses[props.size])
</script>

<style scoped lang="scss">
.pie-chart {
  width: v-bind('currentSize.width');
  height: v-bind('currentSize.height');
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  &__wrapper {
    position: relative;
    width: v-bind('currentSize.chart');
    height: v-bind('currentSize.chart');
  }

  &__overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &__value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #374151;
  }

  &__label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
    margin-top: 0.25rem;
  }
}

@media (max-width: 768px) {
  .pie-chart {
    width: 100%;
    max-width: 350px;
  }
}
</style>
