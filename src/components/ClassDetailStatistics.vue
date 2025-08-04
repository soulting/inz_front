<template>
  <div v-if="lessonStatistics" class="lesson-stats">
    <h1 class="lesson-stats__title">{{ lessonStatistics.class_name }}</h1>

    <LessonStatisticCard
      v-for="lesson in lessonStatistics.lessons"
      :key="lesson.lesson_id"
      :lesson="lesson"
      :is-expanded="expandedLessons.includes(lesson.lesson_id)"
      @toggle-expanded="toggleExpanded"
    />
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

import LessonStatisticCard from './LessonStatisticCard.vue'

const props = defineProps({
  classId: String,
})

const lessonStatistics = ref(null)
const expandedLessons = ref([])

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
})
</script>

<style scoped lang="scss">
.lesson-stats {
  font-family: system-ui, sans-serif;
  color: #1f2937;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

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
