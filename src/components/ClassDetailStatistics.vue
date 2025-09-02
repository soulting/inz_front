<template>
  <div class="lesson-stats">
    <div v-if="performanceData">
      <ClassPerformance :performance-data="performanceData" />
    </div>
    <div v-else class="lesson-stats__no-performance">
      Ta klasa nie ma jeszcze żadnych zapisanych uczniów.
    </div>

    <div class="lesson-statistics-section">
      <h3 class="lesson-statistics__title">Statystyki lekcji</h3>

      <div v-if="lessonStatistics?.lessons?.length" class="lessons-container">
        <div
          v-for="lesson in lessonStatistics.lessons"
          :key="lesson.lesson_id"
          class="lesson-container"
        >
          <LessonStatisticCard :lesson="lesson" />
        </div>
      </div>

      <div
        v-else-if="
          lessonStatistics && (!lessonStatistics.lessons || lessonStatistics.lessons.length === 0)
        "
        class="lesson-statistics__empty"
      >
        <p>Ta klasa nie ma jeszcze żadnych wykonanych lekcji.</p>
      </div>
    </div>

    <div class="task-analytics-section">
      <h3 class="lesson-tasks__title">Analiza zadań</h3>
      <div v-if="taskAnalytics?.tasks?.length" class="tasks-container">
        <TaskAnalyticsCard
          v-for="task in taskAnalytics.tasks"
          :key="task.task_id"
          :task="task"
          :class-id="props.classId"
        />
      </div>
      <div v-else class="lesson-tasks__empty">
        <p>Ta klasa nie ma jeszcze wykonanych zadań do analizy.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

import ClassPerformance from './ClassPerformance.vue'
import LessonStatisticCard from './LessonStatisticCard.vue'
import TaskAnalyticsCard from './TaskAnalyticsCard.vue'

const props = defineProps({
  classId: {
    type: String,
    required: true,
  },
})

const lessonStatistics = ref(null)
const performanceData = ref(null)
const taskAnalytics = ref(null)

onMounted(async () => {
  lessonStatistics.value = await useApi().get(
    `${URL.ANALYTICS}/get_class_analytics/${props.classId}`,
  )

  performanceData.value = await useApi().get(
    `${URL.ANALYTICS}/get_class_performance_analysis/${props.classId}/A1`,
  )

  taskAnalytics.value = await useApi().get(`${URL.ANALYTICS}/get_task_analytics/${props.classId}`)
})
</script>
