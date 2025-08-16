<!-- LessonCard.vue -->
<template>
  <div class="lesson-card">
    <!-- Nagłówek lekcji -->
    <div class="lesson-card__header">
      <h2 class="lesson-card__title">{{ lesson.lesson_name }}</h2>
      <button
        class="lesson-card__toggle-button"
        @click="toggleExpanded"
        :title="isExpanded ? 'Ukryj szczegóły' : 'Pokaż szczegóły'"
      >
        <img v-if="isExpanded" class="lesson-card__arrow" src="@/assets/up-arrow.png" alt="ukryj" />
        <img v-else class="lesson-card__arrow" src="@/assets/down-arrow.png" alt="pokaż" />
      </button>
    </div>

    <!-- Wykresy - zawsze widoczne -->
    <div class="lesson-card__charts">
      <!-- Wykres czasu - używa ComparisonChart -->
      <ComparisonChart
        :actual="lesson.time_on_page"
        :expected="lesson.expected_time"
        title="Czas spędzony"
        unit="time"
        displayMode="progress"
        actualLabel="Rzeczywisty"
        expectedLabel="Oczekiwany"
        :thresholds="{
          good: { max: 100, color: '#10b981' },
          warning: { max: 120, color: '#eab308' },
          danger: { color: '#dc2626' },
        }"
      />

      <!-- Wykres zaangażowania - używa PieChart -->
      <PieChart
        :value="lesson.engagement_score"
        title="Zaangażowanie"
        label="uczniów"
        :threshold="50"
        lowColor="#dc2626"
        :colors="['#4f46e5', '#e2e8f0']"
      />

      <!-- Wykres trudności - używa BarChart -->
      <BarChart
        :data="lesson.difficulty"
        :labels="['1', '2', '3', '4', '5']"
        title="Trudność"
        xAxisTitle="Poziom trudności (1-łatwe, 5-trudne)"
        yAxisTitle="Liczba ocen"
        :showHeaderValue="true"
        :headerValue="getMostCommonDifficulty"
        headerValueMode="custom"
        :tooltipLabels="{ singular: 'ocena', plural: 'ocen' }"
      />
    </div>

    <!-- Rozwijana tabela szczegółów -->
    <ExpandableDetails :lesson="lesson" :is-expanded="isExpanded" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import BarChart from './BarChart.vue'
import ComparisonChart from './ComparisonChart.vue'
import ExpandableDetails from './ExpandableDetails.vue'
import PieChart from './PieChart.vue'

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
})

// Computed property do obliczania najczęstszego poziomu trudności
const getMostCommonDifficulty = computed(() => {
  const levels = ['1', '2', '3', '4', '5']
  let maxCount = 0
  let mostCommon = '1'

  levels.forEach((level) => {
    const count = props.lesson.difficulty?.[level] || 0
    if (count > maxCount) {
      maxCount = count
      mostCommon = level
    }
  })

  return mostCommon
})

const isExpanded = ref(false) // Domyślnie zwinięte

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped lang="scss">
.lesson-card {
  display: flex;
  flex-direction: column;
  margin: 12px 0;
  padding: 20px;
  border-radius: 16px;
  background: white;
  border: 0.5px solid rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  &__toggle-button {
    width: 42px;
    height: 42px;
    border: 0.5px solid #333;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    transition: background 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #f0f0f0;
    }
  }

  &__arrow {
    height: 13px;
    width: 13px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center;
  }

  &__charts {
    display: flex;
    justify-content: flex-start;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
}

// Responsive design
@media (max-width: 768px) {
  .lesson-card {
    &__charts {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
