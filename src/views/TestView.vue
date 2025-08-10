<template>
  <TestStartingScreen v-if="testState === 'not_started'" :tasks="tasks" @start="startTest" />
  <TestSummary
    v-else-if="testState === 'finished'"
    :testAnswers="testAnswers"
    :analysisResults="analysisResults"
  />

  <div v-else-if="testState === 'in_progress'" class="test-container">
    <div v-if="currentTask" class="test-wrapper">
      <!-- Header z informacjami o teście -->
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

      <!-- Progress bar -->
      <div class="test-progress">
        <div
          class="test-progress__bar"
          :style="{ width: (currentIndex / tasks.length) * 100 + '%' }"
        ></div>
      </div>

      <!-- Główna zawartość zadania -->
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
            v-else-if="currentTask.task_type === 'correction'"
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

        <!-- Ocena trudności -->
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

        <!-- Przyciski nawigacji -->
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
import { handleApiError } from '@/composables/errorHandling'
import axios from 'axios'
import { storeToRefs } from 'pinia'
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

import { useAuthStore } from '../stores/auth'
import { useLoadingStore } from '../stores/loading'

const { token } = storeToRefs(useAuthStore())

const router = useRouter()

const alert = {
  icon: 'error',
  confirmButtonText: 'OK',
  background: '#ffffff',
  confirmButtonColor: '#4f46e5',
  color: '#1f2937',
}

const props = defineProps(['level'])
const loadingStore = useLoadingStore()

const tasks = ref([])
const currentIndex = ref(0)
const seconds = ref(0)
const timeLeft = ref(0) // będzie obliczany dynamicznie
const testAnswers = ref({
  level: props.level,
  answers: [],
  totalPoints: 0,
  totalErrors: 0,
  totalUncertainty: 0,
  totalTime: 0,
})

// 🆕 NOWA ZMIENNA NA WYNIKI ANALIZY
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

// Obliczanie czasu testu na podstawie liczby zadań
const estimatedTime = computed(() => {
  if (!tasks.value.length) return 0
  const totalSubtasks = tasks.value.reduce(
    (acc, task) => acc + (task.subtasks?.length || task.task_items?.length || 1),
    0,
  )
  const baseTime = Math.ceil(totalSubtasks * 1.5) // 1.5 minuty na pytanie
  const bufferTime = 5 // 5 minut buforu
  return Math.min(baseTime + bufferTime, 60) // maksymalnie 60 minut
})

async function finishTest() {
  try {
    loadingStore.startLoading()

    console.log('Submitting test data:', testAnswers.value)

    const response = await axios.post(
      `${URL.PLACEMENT_TEST}/submit_test`,
      {
        answers: testAnswers.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    )

    console.log('Test submitted successfully:', response.data)

    // 🆕 ZAPISZ WYNIKI ANALIZY
    if (response.data.analysis) {
      analysisResults.value = response.data.analysis
      console.log('Analysis results received:', analysisResults.value)
    } else {
      console.warn('No analysis data received from server')
      // Fallback - podstawowa analiza po stronie klienta
      analysisResults.value = {
        overall_stats: {
          total_tasks: testAnswers.value.answers.length,
          total_points: testAnswers.value.totalPoints,
          total_errors: testAnswers.value.totalErrors,
          total_uncertainty: testAnswers.value.totalUncertainty,
          total_time: testAnswers.value.totalTime,
          overall_score_percentage: Math.round(
            (testAnswers.value.totalPoints /
              (testAnswers.value.totalPoints +
                testAnswers.value.totalErrors +
                testAnswers.value.totalUncertainty)) *
              100,
          ),
        },
        best_subcategories: [],
        worst_subcategories: [],
        main_categories_summary: [],
        recommendations: ['Analiza wyników zostanie dostarczona wkrótce.'],
      }
    }
  } catch (error) {
    console.error('Error submitting test:', error)
    handleApiError(error, router)

    // W przypadku błędu, nie blokuj przejścia do wyników
    analysisResults.value = {
      overall_stats: {
        total_tasks: testAnswers.value.answers.length,
        total_points: testAnswers.value.totalPoints,
        total_errors: testAnswers.value.totalErrors,
        total_uncertainty: testAnswers.value.totalUncertainty,
        total_time: testAnswers.value.totalTime,
        overall_score_percentage: Math.round(
          (testAnswers.value.totalPoints /
            (testAnswers.value.totalPoints +
              testAnswers.value.totalErrors +
              testAnswers.value.totalUncertainty)) *
            100,
        ),
      },
      best_subcategories: [],
      worst_subcategories: [],
      main_categories_summary: [],
      recommendations: ['Wystąpił błąd podczas analizy wyników. Spróbuj ponownie później.'],
    }
  } finally {
    loadingStore.stopLoading()
  }

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

  // 🔢 aktualizuj statystyki zbiorcze
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
  timeLeft.value = estimatedTime.value * 60 // konwersja minut na sekundy

  timer = setInterval(() => {
    seconds.value++
    timeLeft.value--

    if (timeLeft.value <= 0) {
      finishTest()
    }
  }, 1000)
}

onMounted(async () => {
  try {
    loadingStore.startLoading()

    const response = await axios.get(`${URL.PLACEMENT_TEST}/get_test`, {
      params: { id: props.level },
    })

    console.log('Tasks fetched successfully:', response.data)

    tasks.value = response.data
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.test-container {
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.test-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.test-header {
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

  &__level {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffd700;
  }

  &__progress {
    font-size: 1rem;
    opacity: 0.9;
  }

  &__timer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  &__timer-icon {
    width: 24px;
    height: 24px;
  }
}

.test-progress {
  height: 4px;
  background: #e5e7eb;

  &__bar {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    transition: width 0.3s ease;
  }
}

.test-content {
  padding: 2.5rem 3rem;
}

.task-question {
  margin-bottom: 2rem;

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.4;
    margin: 0;
  }
}

.task-body {
  margin-bottom: 3rem;
}

.task-error {
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  text-align: center;
  color: #dc2626;
  font-style: italic;
}

.difficulty-section {
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

.difficulty-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.difficulty-scale {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.difficulty-star {
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

.difficulty-labels {
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

.difficulty-feedback {
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

.difficulty-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.difficulty-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    border-color: #4f46e5;
    background: #f0f0ff;
  }

  &--selected {
    border-color: #4f46e5;
    background: #4f46e5;
    color: white;

    .difficulty-button__text {
      color: white;
    }
  }

  &__emoji {
    font-size: 1.25rem;
  }

  &__text {
    font-weight: 500;
    color: #374151;
  }
}

.test-actions {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.test-action-btn {
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

  &--primary {
    background: #4f46e5;
    color: white;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);

    &:hover {
      background: #4338ca;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
  }

  &--finish {
    background: #059669;
    color: white;
    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);

    &:hover {
      background: #047857;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    }
  }

  &:active {
    transform: translateY(0);
  }

  &__icon {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  &:hover &__icon {
    transform: translateX(2px);
  }
}

// Responsive design
@media (max-width: 768px) {
  .test-wrapper {
    margin: 0;
    box-shadow: none;
  }

  .test-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;

    &__timer {
      justify-content: center;
    }
  }

  .test-content {
    padding: 2rem;
  }

  .task-question__title {
    font-size: 1.25rem;
  }

  .difficulty-section {
    padding: 1.5rem;
  }

  .difficulty-buttons {
    grid-template-columns: 1fr;
  }

  .difficulty-button {
    justify-content: center;
    padding: 0.875rem;
  }

  .test-action-btn {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .test-content {
    padding: 1rem;
  }

  .difficulty-section {
    padding: 1rem;
  }
}
</style>
