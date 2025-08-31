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

    const response = await useApi().post(`${URL.TASKS}/submit_task`, taskResult, router)

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

  const response = await useApi().get(`${URL.TASKS}/task/${props.taskId}`)

  task.value = response

  console.log(task.value)

  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>
