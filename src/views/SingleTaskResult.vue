<template>
  <div v-if="task && task_result" class="task-result">
    <h2 class="task-result__title">Wyniki zadania</h2>

    <div class="task-result__meta">
      <p class="task-result__meta-item">
        <span>Poziom trudności:</span> {{ task_result.task_items.difficulty }}
      </p>
      <p class="task-result__meta-item">
        <span>Czas:</span> {{ task_result.task_items.time_spent }} sek.
      </p>
      <p class="task-result__meta-item">
        <span>Liczba błędów:</span> {{ task_result.task_items.task_error }}
      </p>
      <p class="task-result__meta-item">
        <span>Niepewność:</span> {{ task_result.task_items.task_uncertainty }}
      </p>
      <p class="task-result__meta-item">
        <span>Uzyskane punkty:</span> {{ task_result.task_items.task_points }}
      </p>
    </div>
    <div class="single-task-content">
      <div class="single-task-question">
        <h2 class="single-task-question__title">{{ task.question }}</h2>
      </div>

      <div class="single-task-body">
        <FillInTask
          v-if="task.task_type === TASK_TYPES.FILL_IN"
          :currentTask="task"
          :anwsers="task_result.task_items.answers"
          @submit="handleSubmitAnswers"
          @noAnswers="noAnswersAlert"
          ref="componentRef"
        />

        <SelectionTask
          v-else-if="task.task_type === TASK_TYPES.SELECTION"
          :currentTask="task"
          :anwsers="task_result.task_items.answers"
          @submit="handleSubmitAnswers"
          @noAnswers="noAnswersAlert"
          ref="componentRef"
        />

        <CorrectionTask
          v-else-if="task.task_type === TASK_TYPES.CORRECTION"
          :currentTask="task"
          :anwsers="task_result.task_items.answers"
          @submit="handleSubmitAnswers"
          @noAnswers="noAnswersAlert"
          ref="componentRef"
        />

        <CorrectionWordTask
          v-else-if="task.task_type === TASK_TYPES.CORRECTION_WORD"
          :currentTask="task"
          :anwsers="task_result.task_items.answers"
          @submit="handleSubmitAnswers"
          @noAnswers="noAnswersAlert"
          ref="componentRef"
        />

        <div v-else class="single-task-error">
          <em>Nieobsługiwany typ zadania: {{ task.task_type }}</em>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'

import { TASK_TYPES, URL } from '@/enums'

import CorrectionTask from '@/components/CorrectionTask.vue'
import CorrectionWordTask from '@/components/CorrectionWordTask.vue'
import FillInTask from '@/components/FillInTask.vue'
import SelectionTask from '@/components/SelectionTask.vue'

const router = useRouter()
const props = defineProps({
  resultId: {
    type: [String, Number],
    required: true,
  },
  taskId: {
    type: [String, Number],
    required: true,
  },
})

const task = ref(null)
const task_result = ref(null)

onMounted(async () => {
  const [task_result_response, task_response] = await Promise.all([
    useApi().get(`${URL.TASKS}/singular_task_result/${props.resultId}`, router),
    useApi().get(`${URL.TASKS}/task/${props.taskId}`, router),
  ])
  task_result.value = task_result_response
  task.value = task_response
})
</script>

<style lang="scss" scoped>
.task-result {
  background-color: #ffffff;
  color: #1f2937;
  border-radius: 1rem;
  padding: 2.5rem;
  max-width: 1100px;
  margin: 2rem auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  font-family: 'Inter', system-ui, sans-serif;

  &__title {
    font-size: 2rem;
    margin: 2rem 0 1.5rem;
    text-align: center;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.5px;
  }

  &__meta {
    margin-top: 2rem;
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    background-color: #fafafa;
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;

    &-item {
      font-size: 1rem;
      color: #374151;
      display: flex;
      justify-content: space-between;

      span {
        color: #6b7280;
        font-weight: 600;
        margin-right: 0.5rem;
      }
    }
  }
}
</style>
