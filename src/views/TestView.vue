<template>
  <TestStartingScreen v-if="testState === 'not_started'" :tasks="tasks" @start="startTest" />
  <TestSummary
    v-else-if="testState === 'finished'"
    :testAnswers="testAnswers"
    :analysisResults="analysisResults"
  />

  <div v-else-if="testState === 'in_progress'" class="test-container">
    <div v-if="currentTask" class="test-wrapper">
      <div class="test-header">
        <div class="test-header__info">
          <span class="test-header__level">TEST {{ props.level }}</span>
          <span class="test-header__progress"
            >Zadanie {{ currentIndex + 1 }}/{{ tasks.length }}</span
          >
        </div>
        <div class="test-header__timer">
          <svg
            class="test-header__timer-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <span class="test-header__time">
            {{ Math.floor(timeLeft / 60) }}:{{ (timeLeft % 60).toString().padStart(2, '0') }}
          </span>
        </div>
      </div>

      <div class="test-progress">
        <div
          class="test-progress__bar"
          :style="{ width: (currentIndex / tasks.length) * 100 + '%' }"
        ></div>
      </div>

      <div class="test-content">
        <div class="task-question">
          <h2 class="task-question__title">{{ currentTask.question }}</h2>
        </div>

        <div class="task-body">
          <FillInTask
            v-if="currentTask.task_type === TASK_TYPES.FILL_IN"
            :currentTask="currentTask"
            @submit="handleSubmitAnswers"
            @noAnswers="noAnswersAlert"
            ref="componentRef"
          />

          <SelectionTask
            v-else-if="currentTask.task_type === TASK_TYPES.SELECTION"
            :currentTask="currentTask"
            @submit="handleSubmitAnswers"
            @noAnswers="noAnswersAlert"
            ref="componentRef"
          />

          <CorrectionTask
            v-else-if="currentTask.task_type === TASK_TYPES.CORRECTION"
            :currentTask="currentTask"
            @submit="handleSubmitAnswers"
            @noAnswers="noAnswersAlert"
            ref="componentRef"
          />

          <CorrectionWordTask
            v-else-if="currentTask.task_type === TASK_TYPES.CORRECTION_WORD"
            :currentTask="currentTask"
            @submit="handleSubmitAnswers"
            @noAnswers="noAnswersAlert"
            ref="componentRef"
          />

          <div v-else class="task-error">
            <em>Nieobsługiwany typ zadania: {{ currentTask.task_type }}</em>
          </div>
        </div>

        <div class="difficulty-section">
          <h3 class="difficulty-section__title">Jak trudne było to zadanie?</h3>
          <div class="difficulty-rating">
            <div class="difficulty-scale">
              <button
                v-for="level in 5"
                :key="level"
                @click="rateDifficulty(level)"
                class="difficulty-star"
                :class="{
                  'difficulty-star--selected': taskDifficulty === level,
                  'difficulty-star--hover': taskDifficulty >= level,
                }"
              >
                {{ level }}
              </button>
            </div>
            <div class="difficulty-labels">
              <span class="difficulty-labels__start">Bardzo łatwe</span>
              <span class="difficulty-labels__end">Bardzo trudne</span>
            </div>
            <div v-if="taskDifficulty" class="difficulty-feedback">
              <span class="difficulty-feedback__emoji">{{
                difficultyLevels[taskDifficulty - 1].emoji
              }}</span>
              <span class="difficulty-feedback__text">{{
                difficultyLevels[taskDifficulty - 1].text
              }}</span>
            </div>
          </div>
        </div>

        <div class="test-actions">
          <button
            v-if="currentIndex < tasks.length - 1"
            @click="goToNextTask"
            class="test-action-btn test-action-btn--primary"
          >
            <span>Następne zadanie</span>
            <svg
              class="test-action-btn__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
          <button
            v-else
            @click="finishTestManually"
            class="test-action-btn test-action-btn--finish"
          >
            <span>Zakończ test</span>
            <svg
              class="test-action-btn__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

import { computed, onMounted, onUnmounted, ref } from 'vue'

import { TASK_TYPES, URL } from '@/enums'

import CorrectionWordTask from '@/components/CorrectionWordTask.vue'
import FillInTask from '@/components/FillInTask.vue'
import CorrectionTask from '@/components/MultiTask.vue'
import SelectionTask from '@/components/SelectionTask.vue'
import TestStartingScreen from '@/components/TestStartingScreen.vue'
import TestSummary from '@/components/TestSummary.vue'

const router = useRouter()

const alert = {
  icon: 'error',
  confirmButtonText: 'OK',
  background: '#ffffff',
  confirmButtonColor: '#4f46e5',
  color: '#1f2937',
}

const props = defineProps(['level'])

const tasks = ref([])
const currentIndex = ref(0)
const seconds = ref(0)
const timeLeft = ref(0)
const testAnswers = ref({
  level: props.level,
  answers: [],
  totalPoints: 0,
  totalErrors: 0,
  totalUncertainty: 0,
  totalTime: 0,
})

const analysisResults = ref(null)

const taskDifficulty = ref(null)
const componentRef = ref(null)
const testState = ref('not_started')

const difficultyLevels = [
  { emoji: '😄', text: 'Bardzo łatwe' },
  { emoji: '🙂', text: 'Łatwe' },
  { emoji: '😐', text: 'Neutralne' },
  { emoji: '😕', text: 'Trudne' },
  { emoji: '😫', text: 'Bardzo trudne' },
]

const estimatedTime = computed(() => {
  if (!tasks.value.length) return 0
  const totalSubtasks = tasks.value.reduce(
    (acc, task) => acc + (task.subtasks?.length || task.task_items?.length || 1),
    0,
  )
  const baseTime = Math.ceil(totalSubtasks * 1.5)
  const bufferTime = 5
  return Math.min(baseTime + bufferTime, 60)
})

async function finishTest() {
  analysisResults.value = await useApi().post(
    `${URL.PLACEMENT_TEST}/submit_test`,
    {
      answers: testAnswers.value,
    },
    router,
  )

  testState.value = 'finished'
  clearInterval(timer)
  timer = null
}

let timer = null

const currentTask = computed(() => tasks.value[currentIndex.value] || null)

function noAnswersAlert() {
  Swal.fire({
    ...alert,
    title: 'Wszystkie pola wymagane',
    text: 'Musisz wypełnić to zadanie oraz ocenić jego trudność przed przejściem dalej.',
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
    const correctAnswer = currentTask.value.task_items[index].correct_answer
    return {
      [currentTask.value.task_items[index].id]: {
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

  testAnswers.value.answers.push({
    taskId: currentTask.value.id,
    scoredAnswers,
    taskPoints,
    taskError,
    taskUncertainty,
    main_category: currentTask.value.main_category,
    sub_category: currentTask.value.sub_category,
    second_category: currentTask.value.second_category,
    question: currentTask.value.question,
    difficulty: taskDifficulty.value,
    timeSpent: seconds.value,
    completionDate: new Date().toISOString(),
  })

  testAnswers.value.totalPoints += taskPoints
  testAnswers.value.totalErrors += taskError
  testAnswers.value.totalUncertainty += taskUncertainty
  testAnswers.value.totalTime += seconds.value

  console.log('Answers submitted:', testAnswers.value)

  taskDifficulty.value = null
  seconds.value = 0
  currentIndex.value++
}

function goToNextTask() {
  componentRef.value.submitAnswers()
}

function finishTestManually() {
  componentRef.value.submitAnswers()
  finishTest()
}

function startTest() {
  testState.value = 'in_progress'
  timeLeft.value = estimatedTime.value * 60

  timer = setInterval(() => {
    seconds.value++
    timeLeft.value--

    if (timeLeft.value <= 0) {
      finishTest()
    }
  }, 1000)
}

onMounted(async () => {
  tasks.value = await useApi().get(`${URL.PLACEMENT_TEST}/get_test/${props.level}`, router)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
