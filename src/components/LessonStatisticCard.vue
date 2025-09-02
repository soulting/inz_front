<template>
  <div class="lesson-card">
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

    <div class="lesson-card__charts">
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

      <PieChart
        :value="lesson.engagement_score"
        title="Zaangażowanie"
        :threshold="50"
        lowColor="#dc2626"
        :colors="['#4f46e5', '#e2e8f0']"
      />

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

    <ExpandableDetails :lesson="lesson" :is-expanded="isExpanded" />
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'

import { computed, onMounted, ref } from 'vue'

import { URL } from '@/enums'

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

const isExpanded = ref(false)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

onMounted(async () => {
  await useApi().get(`${URL.ANALYTICS}/get_lesson_engagement_score/${props.lesson.lesson_id}`)
})
</script>
