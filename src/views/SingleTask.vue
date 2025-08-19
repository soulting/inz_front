<template>
  <div class="single-task-container">
    <div v-if="task" class="single-task-wrapper">
      <!-- Header z informacjami o zadaniu -->
      <div class="single-task-header">
        <div class="single-task-header__timer">
          <span class="single-task-header__time">
            {{ Math.floor(timeSpent / 60) }}:{{ (timeSpent % 60).toString().padStart(2, '0') }}
          </span>
        </div>
      </div>

      <!-- Główna zawartość zadania -->
      <div class="single-task-content">
        <div class="single-task-question">
          <h2 class="single-task-question__title">{{ task.question }}</h2>
        </div>

        <div class="single-task-body">
          <FillInTask
            v-if="task.task_type === TASK_TYPES.FILL_IN"
            :currentTask="task"
            @submit="handleSubmitAnswers"
            @noAnswers="noAnswersAlert"
            ref="componentRef"
          />

          <SelectionTask
            v-else-if="task.task_type === TASK_TYPES.SELECTION"
            :currentTask="task"
            @submit="handleSubmitAnswers"
            @noAnswers="noAnswersAlert"
            ref="componentRef"
          />

          <CorrectionTask
            v-else-if="task.task_type === TASK_TYPES.CORRECTION"
            :currentTask="task"
            @submit="handleSubmitAnswers"
            @noAnswers="noAnswersAlert"
            ref="componentRef"
          />

          <CorrectionWordTask
            v-else-if="task.task_type === TASK_TYPES.CORRECTION_WORD"
            :currentTask="task"
            @submit="handleSubmitAnswers"
            @noAnswers="noAnswersAlert"
            ref="componentRef"
          />

          <div v-else class="single-task-error">
            <em>Nieobsługiwany typ zadania: {{ task.task_type }}</em>
          </div>
        </div>

        <!-- Ocena trudności -->
        <div class="single-difficulty-section">
          <h3 class="single-difficulty-section__title">Jak trudne było to zadanie?</h3>
          <div class="single-difficulty-rating">
            <div class="single-difficulty-scale">
              <button
                v-for="level in 5"
                :key="level"
                @click="rateDifficulty(level)"
                class="single-difficulty-star"
                :class="{
                  'single-difficulty-star--selected': taskDifficulty === level,
                  'single-difficulty-star--hover': taskDifficulty >= level,
                }"
              >
                {{ level }}
              </button>
            </div>
            <div class="single-difficulty-labels">
              <span class="single-difficulty-labels__start">Bardzo łatwe</span>
              <span class="single-difficulty-labels__end">Bardzo trudne</span>
            </div>
            <div v-if="taskDifficulty" class="single-difficulty-feedback">
              <span class="single-difficulty-feedback__emoji">{{
                difficultyLevels[taskDifficulty - 1].emoji
              }}</span>
              <span class="single-difficulty-feedback__text">{{
                difficultyLevels[taskDifficulty - 1].text
              }}</span>
            </div>
          </div>
        </div>

        <!-- Przycisk zakończenia -->
        <div class="single-task-actions">
          <button
            @click="submitTask"
            :disabled="isSubmitting"
            class="single-task-action-btn single-task-action-btn--submit"
          >
            <span v-if="!isSubmitting">Zakończ zadanie</span>
            <span v-else>Wysyłanie...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { handleApiError } from '@/composables/errorHandling'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

import { onMounted, onUnmounted, ref } from 'vue'

import { TASK_TYPES, URL } from '@/enums'

import CorrectionTask from '@/components/CorrectionTask.vue'
import CorrectionWordTask from '@/components/CorrectionWordTask.vue'
import FillInTask from '@/components/FillInTask.vue'
import SelectionTask from '@/components/SelectionTask.vue'

import { useAuthStore } from '../stores/auth'

const { token } = storeToRefs(useAuthStore())
const router = useRouter()

const alert = {
  icon: 'error',
  confirmButtonText: 'OK',
  background: '#ffffff',
  confirmButtonColor: '#4f46e5',
  color: '#1f2937',
}

const props = defineProps({
  taskId: {
    type: [String, Number],
    required: true,
  },
  classId: {
    type: [String, Number],
    required: true,
  },
})

const task = ref(null)
const timeSpent = ref(0)
const taskDifficulty = ref(null)
const componentRef = ref(null)
const isSubmitting = ref(false)

let timer = null

const difficultyLevels = [
  { emoji: '😄', text: 'Bardzo łatwe' },
  { emoji: '🙂', text: 'Łatwe' },
  { emoji: '😐', text: 'Neutralne' },
  { emoji: '😕', text: 'Trudne' },
  { emoji: '😫', text: 'Bardzo trudne' },
]

function noAnswersAlert() {
  Swal.fire({
    icon: 'error',
    confirmButtonText: 'OK',
    background: '#ffffff',
    confirmButtonColor: '#4f46e5',
    color: '#1f2937',
    title: 'Wszystkie pola wymagane',
    text: 'Musisz wypełnić to zadanie oraz ocenić jego trudność przed zakończeniem.',
  })
}

function rateDifficulty(difficulty) {
  taskDifficulty.value = difficulty
}

function getTotalPoints(scoredAnswers) {
  return scoredAnswers.reduce((sum, answerObj) => {
    const key = Object.keys(answerObj)[0]
    return sum + answerObj[key].point
  }, 0)
}

function getTotalErrors(scoredAnswers) {
  return scoredAnswers.reduce((sum, answerObj) => {
    const key = Object.keys(answerObj)[0]
    return sum + answerObj[key].error
  }, 0)
}

function getTotalUncertainty(scoredAnswers) {
  return scoredAnswers.reduce((sum, answerObj) => {
    const key = Object.keys(answerObj)[0]
    return sum + answerObj[key].uncertain
  }, 0)
}

function handleSubmitAnswers(answers) {
  if (!taskDifficulty.value) {
    noAnswersAlert()
    return
  }

  const trimmedAnswers = answers.map((answer) =>
    answer
      .replace(/\(.*?\)/, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/ \./g, '.')
      .trim(),
  )

  const scoredAnswers = trimmedAnswers.map((answer, index) => {
    const correctAnswer = task.value.task_items[index].correct_answer
    return {
      [task.value.task_items[index].id]: {
        point: answer === correctAnswer ? 1 : 0,
        uncertain: answer.includes('???') ? 1 : 0,
        error: answer === correctAnswer ? 0 : answer.includes('???') ? 0 : 1,
        myAnswer: answer.trim(),
        correctAnswer: correctAnswer.trim(),
      },
    }
  })

  const taskPoints = getTotalPoints(scoredAnswers)
  const taskUncertainty = getTotalUncertainty(scoredAnswers)
  const taskError = getTotalErrors(scoredAnswers)

  const taskResult = {
    taskId: task.value.id,
    classId: props.classId,
    scoredAnswers,
    taskPoints,
    taskError,
    taskUncertainty,
    main_category: task.value.main_category,
    sub_category: task.value.sub_category,
    second_category: task.value.second_category,
    question: task.value.question,
    difficulty: taskDifficulty.value,
    timeSpent: timeSpent.value,
    completionDate: new Date().toISOString(),
  }

  submitTaskToServer(taskResult)
}

async function submitTaskToServer(taskResult) {
  try {
    isSubmitting.value = true

    console.log('Submitting task data:', taskResult)

    const response = await useApi().post(`${URL.TASKS}/submit_single_task`, taskResult, router)

    console.log('Task submitted successfully:', response.data)

    // Pokazanie komunikatu o sukcesie
    await Swal.fire({
      icon: 'success',
      title: 'Zadanie wysłane!',
      text: 'Twoja odpowiedź została zapisana pomyślnie.',
      confirmButtonText: 'OK',
      background: '#ffffff',
      confirmButtonColor: '#4f46e5',
      color: '#1f2937',
    })

    // Powrót do poprzedniego widoku
    router.back()
  } catch (error) {
    console.error('Error submitting task:', error)
    handleApiError(error, router)

    await Swal.fire({
      icon: 'error',
      title: 'Błąd wysyłania',
      text: 'Nie udało się wysłać zadania. Spróbuj ponownie.',
      confirmButtonText: 'OK',
      background: '#ffffff',
      confirmButtonColor: '#dc2626',
      color: '#1f2937',
    })
  } finally {
    isSubmitting.value = false
  }
}

function submitTask() {
  if (componentRef.value && componentRef.value.submitAnswers) {
    componentRef.value.submitAnswers()
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeSpent.value++
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(async () => {
  window.scrollTo(0, 0)

  const response = await useApi().get(`${URL.TASKS}/get_task/${props.taskId}`)

  task.value = response

  console.log(task.value)

  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped lang="scss">
.single-task-container {
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.single-task-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.single-task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #4f46e5;
  color: white;
  padding: 1.5rem 2rem;

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffd700;
  }

  &__class {
    font-size: 1rem;
    opacity: 0.9;
  }

  &__timer {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.single-task-content {
  padding: 2.5rem 3rem;
}

.single-task-question {
  margin-bottom: 2rem;

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.4;
    margin: 0;
  }
}

.single-task-body {
  margin-bottom: 3rem;
}

.single-task-error {
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  text-align: center;
  color: #dc2626;
  font-style: italic;
}

.single-difficulty-section {
  margin: 3rem 0;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e5e7eb;

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1.5rem;
    text-align: center;
  }
}

.single-difficulty-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.single-difficulty-scale {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.single-difficulty-star {
  width: 50px;
  height: 50px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  background: white;
  color: #6b7280;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #4f46e5;
    background: #f0f0ff;
    transform: scale(1.05);
  }

  &--selected {
    border-color: #4f46e5;
    background: #4f46e5;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  &--hover {
    border-color: #a5b4fc;
    background: #f0f0ff;
  }
}

.single-difficulty-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;
  font-size: 0.875rem;
  color: #6b7280;

  &__start,
  &__end {
    font-weight: 500;
  }
}

.single-difficulty-feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #4f46e5;
  border-radius: 25px;
  margin-top: 0.5rem;

  &__emoji {
    font-size: 1.5rem;
  }

  &__text {
    font-weight: 600;
    color: #4f46e5;
  }
}

.single-task-actions {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.single-task-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &--submit {
    background: #059669;
    color: white;
    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);

    &:hover:not(:disabled) {
      background: #047857;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

// Responsive design
@media (max-width: 768px) {
  .single-task-wrapper {
    margin: 0;
    box-shadow: none;
  }

  .single-task-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;

    &__timer {
      justify-content: center;
    }
  }

  .single-task-content {
    padding: 2rem;
  }

  .single-task-question__title {
    font-size: 1.25rem;
  }

  .single-difficulty-section {
    padding: 1.5rem;
  }

  .single-task-action-btn {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .single-task-content {
    padding: 1rem;
  }

  .single-difficulty-section {
    padding: 1rem;
  }
}
</style>
