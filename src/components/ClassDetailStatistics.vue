<template>
  <div class="lesson-stats">
    <!-- Class Performance Section -->
    <div v-if="performanceData">
      <ClassPerformance :performance-data="performanceData" />
    </div>
    <div v-else class="lesson-stats__no-performance">
      Ta klasa nie ma jeszcze żadnych zapisanych uczniów.
    </div>

    <!-- Lesson Statistics Section -->
    <div class="lesson-statistics-section">
      <div class="section-header" @click="toggleSection('lessons')">
        <h3 class="lesson-statistics__title">Statystyki lekcji</h3>
        <span class="chevron" :class="{ open: openSections.lessons }">⌄</span>
      </div>

      <transition name="fade-slide">
        <div v-show="openSections.lessons">
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
              lessonStatistics &&
              (!lessonStatistics.lessons || lessonStatistics.lessons.length === 0)
            "
            class="lesson-statistics__empty"
          >
            <p>Ta klasa nie ma jeszcze żadnych wykonanych lekcji.</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Task Analytics Section -->
    <div class="task-analytics-section">
      <div class="section-header" @click="toggleSection('tasks')">
        <h3 class="lesson-tasks__title">Analiza zadań</h3>
        <span class="chevron" :class="{ open: openSections.tasks }">⌄</span>
      </div>

      <transition name="fade-slide">
        <div v-show="openSections.tasks">
          <div v-if="taskAnalytics?.tasks?.length" class="tasks-container">
            <TaskAnalyticsCard
              v-for="task in taskAnalytics.tasks"
              :key="task.task_id"
              :task="task"
            />
          </div>
          <div v-else class="lesson-tasks__empty">
            <p>Ta klasa nie ma jeszcze wykonanych zadań do analizy.</p>
          </div>
        </div>
      </transition>
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
  className: {
    type: String,
    required: true,
  },
  classId: {
    type: String,
    required: true,
  },
})

const lessonStatistics = ref(null)
const performanceData = ref(null)
const taskAnalytics = ref(null)

const openSections = ref({
  lessons: true, // domyślnie otwarte
  tasks: true,
})

function toggleSection(section) {
  openSections.value[section] = !openSections.value[section]
}

onMounted(async () => {
  // Pobieranie statystyk lekcji
  lessonStatistics.value = await useApi().get(
    `${URL.ANALYTICS}/get_class_analytics/${props.classId}`,
  )

  // Pobieranie danych o wydajności klasy
  performanceData.value = await useApi().get(
    `${URL.ANALYTICS}/get_class_performance_analysis/${props.classId}/A1`,
  )

  // Pobieranie analityki zadań
  taskAnalytics.value = await useApi().get(`${URL.ANALYTICS}/get_task_analytics/${props.classId}`)
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

  &__no-lessons {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem 2rem;
  }

  &__no-performance {
    @extend .empty-state;
    background: #fef3c7;
    border-color: #fbbf24;
    color: #92400e;
  }
}

.lesson-container {
  margin-bottom: 2rem;
}

/* 🔹 Sekcje analityczne i statystyczne */
.section-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.task-analytics-section,
.lesson-statistics-section,
.lesson-tasks {
  @extend .section-box;
}

.lessons-container,
.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 🔹 Tytuły sekcji */
.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.lesson-statistics__title,
.lesson-tasks__title {
  @extend .section-title;
}

/* 🔹 Header z toggle */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #2563eb;
  }
}

.chevron {
  transition: transform 0.3s ease;
  font-size: 1.2rem;

  &.open {
    transform: rotate(180deg);
  }
}

/* 🔹 Empty states */
.empty-state {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #6b7280;

  p {
    margin: 0;
    font-size: 1rem;
  }
}

.lesson-statistics__empty,
.lesson-tasks__empty {
  @extend .empty-state;
}

/* 🔹 Animacja rozwijania */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  max-height: 2000px;
}

/* 🔹 Responsive */
@media (max-width: 768px) {
  .lesson-stats {
    padding: 1rem;

    &__no-lessons {
      padding: 2rem 1rem;
    }
  }

  .empty-state {
    padding: 1.5rem;
  }

  .section-box {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }
}
</style>
