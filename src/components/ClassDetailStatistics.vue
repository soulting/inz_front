<template>
  <div class="lesson-stats">
    <div v-if="performanceData">
      <ClassPerformance :performance-data="performanceData" />
    </div>
    <div v-else class="lesson-stats__no-performance">
      Ta klasa nie ma jeszcze żadnych zapisanych uczniów.
    </div>

    <div v-if="lessonStatistics?.lessons?.length">
      <LessonStatisticCard
        v-for="lesson in lessonStatistics.lessons"
        :key="lesson.lesson_id"
        :lesson="lesson"
        :is-expanded="expandedLessons.includes(lesson.lesson_id)"
        @toggle-expanded="toggleExpanded"
      />
    </div>
    <div
      v-else-if="
        lessonStatistics && (!lessonStatistics.lessons || lessonStatistics.lessons.length === 0)
      "
      class="lesson-stats__no-lessons"
    >
      <p>Ta klasa nie ma jeszcze żadnych wykonanych lekcji.</p>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

import ClassPerformance from './ClassPerformance.vue'
// Poprawiona nazwa
import LessonStatisticCard from './LessonStatisticCard.vue'

const props = defineProps({
  className: String,
  classId: String,
})

const lessonStatistics = ref(null)
const expandedLessons = ref([])
const performanceData = ref(null)

function toggleExpanded(lessonId) {
  if (expandedLessons.value.includes(lessonId)) {
    expandedLessons.value = expandedLessons.value.filter((l) => l !== lessonId)
  } else {
    expandedLessons.value.push(lessonId)
  }
}

onMounted(async () => {
  const response = await useApi().get(`${URL.ANALYTICS}/get_class_analytics/${props.classId}`)
  lessonStatistics.value = response

  const performanceResponse = await useApi().get(
    `${URL.ANALYTICS}/get_class_performance_analysis/${props.classId}/A1`,
  )
  performanceData.value = performanceResponse
})
</script>

<style scoped lang="scss">
.lesson-stats {
  font-family: system-ui, sans-serif;
  color: #1f2937;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  &__title {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 2.5rem;
    text-align: center;
  }

  &__loading {
    text-align: center;
    padding: 4rem 2rem;
    font-style: italic;
    color: #6b7280;
    font-size: 1.1rem;
  }
}

// Responsive design
@media (max-width: 768px) {
  .lesson-stats {
    padding: 1rem;
  }
}
</style>
