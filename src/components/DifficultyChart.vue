<template>
  <div class="chart">
    <div class="chart__header">
      <h3 class="chart__title">Trudność</h3>
      <div class="chart__value">
        {{ getMostCommonDifficulty(lesson) }}
      </div>
    </div>
    <div class="chart__content">
      <div class="bar-chart">
        <Bar :data="getDifficultyData(lesson)" :options="barOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

defineProps({
  lesson: Object,
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#4f46e5',
      borderWidth: 1,
      cornerRadius: 8,
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      callbacks: {
        title: function (context) {
          return `Poziom trudności: ${context[0].label}`
        },
        label: function (context) {
          const count = context.parsed.y
          return count === 1 ? '1 ocena' : `${count} ocen`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#6b7280',
        font: { size: 12, weight: '500' },
      },
      title: {
        display: true,
        text: 'Poziom trudności (1-łatwe, 5-trudne)',
        font: { size: 12 },
        color: '#6b7280',
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6',
        lineWidth: 1,
      },
      ticks: {
        precision: 0,
        color: '#6b7280',
        font: { size: 12, weight: '500' },
      },
      title: {
        display: true,
        text: 'Liczba ocen',
        font: { size: 12 },
        color: '#6b7280',
      },
    },
  },
}

function getDifficultyData(lesson) {
  const levels = ['1', '2', '3', '4', '5']

  return {
    labels: levels,
    datasets: [
      {
        data: levels.map((lvl) => lesson.difficulty[lvl] || 0),
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }
}

function getMostCommonDifficulty(lesson) {
  const levels = ['1', '2', '3', '4', '5']
  let maxCount = 0
  let mostCommon = '1'

  levels.forEach((level) => {
    const count = lesson.difficulty[level] || 0
    if (count > maxCount) {
      maxCount = count
      mostCommon = level
    }
  })

  return mostCommon
}
</script>

<style scoped lang="scss">
.chart {
  width: 320px;
  height: 300px;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
}

.bar-chart {
  width: 100%;
  height: 180px;
  position: relative;

  canvas {
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .chart {
    width: 100%;
    max-width: 350px;
  }
}
</style>