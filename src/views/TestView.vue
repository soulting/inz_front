<script setup>
import { handleApiError } from '@/composables/errorHandling'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

import { computed, onMounted, onUnmounted, ref } from 'vue'

import { URL } from '@/enums'

import CorrectionWordTask from '@/components/CorrectionWordTask.vue'
import FillInTask from '@/components/FillInTask.vue'
import CorrectionTask from '@/components/MultiTask.vue'
import SelectionTask from '@/components/SelectionTask.vue'
import TestStartingScreen from '@/components/TestStartingScreen.vue'
import TestSummary from '@/components/TestSummary.vue'

import { useAuthStore } from '../stores/auth'
import { useLoadingStore } from '../stores/loading'

const { jwtToken } = storeToRefs(useAuthStore())

const router = useRouter()

const alert = {
  icon: 'error',
  confirmButtonText: 'OK',
  background: '#00000',
  confirmButtonColor: '#3b4bdc',
  color: '#000000',
}

const props = defineProps(['level'])
const loadingStore = useLoadingStore()

const tasks = ref([])
const currentIndex = ref(0)
const seconds = ref(0)
const timeLeft = ref(5400)
const testAnswers = ref({
  level: props.level,
  answers: [],
  totalPoints: 0,
  totalErrors: 0,
  totalUncertainty: 0,
  totalTime: 0,
})

const taskDifficulty = ref(null)
const componentRef = ref(null)
const testState = ref('not_started')

async function finishTest() {
  try {
    loadingStore.startLoading()
    const response = await axios.post(
      `${URL.PLACEMENT_TEST}/submit_test`,
      {
        answers: testAnswers.value,
      },

      {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`,
        },
      },
    )
    console.log('Test submitted successfully:', response.data)
  } catch (error) {
    handleApiError(error, router)
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
    title: 'Błąd',
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

<template>
  <TestStartingScreen v-if="testState === 'not_started'" :tasks="tasks" @start="startTest" />
  <TestSummary v-else-if="testState === 'finished'" :testAnswers="testAnswers" />

  <div v-else-if="testState === 'in_progress'">
    <div v-if="currentTask" class="task-container">
      <div class="task-header">
        <div>
          <strong>TEST {{ props.level }}</strong>
        </div>
        <div>
          <strong>
            Czas: {{ Math.floor(timeLeft / 60) }}:{{ (timeLeft % 60).toString().padStart(2, '0') }}
          </strong>
        </div>
        <div>
          <strong>Zadanie {{ currentIndex + 1 }}/{{ tasks.length }}</strong>
        </div>
      </div>

      <div class="task-body">
        <h2>{{ currentTask.question }}</h2>

        <FillInTask
          v-if="currentTask.task_type === 'fill_in'"
          :currentTask="currentTask"
          @submit="handleSubmitAnswers"
          @noAnswers="noAnswersAlert"
          ref="componentRef"
        />

        <SelectionTask
          v-else-if="currentTask.task_type === 'selection'"
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
          v-else-if="currentTask.task_type === 'correction_word'"
          :currentTask="currentTask"
          @submit="handleSubmitAnswers"
          @noAnswers="noAnswersAlert"
          ref="componentRef"
        />

        <div v-else>
          <em>Nieobsługiwany typ zadania: {{ currentTask.task_type }}</em>
        </div>

        <div class="difficulty-rating">
          <p>Jak trudne było to zadanie?</p>
          <div class="difficulty-buttons">
            <button
              v-for="level in 5"
              :key="level"
              @click="rateDifficulty(level)"
              :style="{
                backgroundColor: taskDifficulty === level ? '#3b4bdc' : '#e0e0e0',
                color: taskDifficulty === level ? '#ffd700' : 'black',
              }"
            >
              {{
                ['😄 Bardzo łatwe', '🙂 Łatwe', '😐 Neutralne', '😕 Trudne', '😫 Bardzo trudne'][
                  level - 1
                ]
              }}
            </button>
          </div>
        </div>

        <button v-if="currentIndex < tasks.length - 1" @click="goToNextTask" class="task-btn">
          Dalej
        </button>
        <button v-else @click="finishTestManually" class="task-btn">Zakończ</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-container {
  background-color: #fff;
  font-family: 'Varela Round', sans-serif;
  color: black;
  padding-bottom: 3rem;
}

.task-header {
  background-color: #3b4bdc;
  color: #ffd700;
  padding: 25px 10rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;
}

.task-body {
  padding: 3rem 10rem;
}

.difficulty-rating {
  margin: 5rem 0;
  text-align: center;
}

.difficulty-buttons button {
  margin: 0.3rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 20px;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.difficulty-buttons button:hover {
  background-color: #ccc;
}

.task-btn {
  display: block;
  margin: 2rem auto;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #3b4bdc;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.task-btn:hover {
  background-color: #2a3dc3;
}
</style>
