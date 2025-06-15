<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import axios from 'axios'
import { useLoadingStore } from '../stores/loading'
import FillInnTask from '@/components/FillInnTask.vue'
import SelectionTask from '@/components/SelectionTask.vue'
import CorrectionTask from '@/components/CorrectionTask.vue'
import CorrectionWordTask from '@/components/CorrectionWordTask.vue'

const props = defineProps(['level'])

const loadingStore = useLoadingStore()
const tasks = ref([])
const currentIndex = ref(0)
const seconds = ref(0)
let timer = null
const testAnwsers = ref([])

const currentTask = computed(() => tasks.value[currentIndex.value] || null)

const componentRef = ref(null)

const taskDifficulty = ref(3) // Default difficulty rating

function rateDifficulty(difficulty) {
  taskDifficulty.value = difficulty
  console.log(`Task difficulty rated as: ${difficulty}`)
}

function goToNextTask() {
  callChildFunction()
  currentIndex.value++
}

function handleSubmitAnwsers(answers) {
  console.log('Answers submitted:', answers)
  testAnwsers.value.push({
    taskId: currentTask.value.id,
    answers: answers,
    difficulty: taskDifficulty.value,
    timeSpent: seconds.value,
  })
  console.log('Test answers:', testAnwsers.value)
  taskDifficulty.value = 3 // Reset difficulty rating for the next task
  seconds.value = 0 // Reset timer for the next task
}

const callChildFunction = () => {
  componentRef.value.submitAnswers()
}

onMounted(async () => {
  try {
    loadingStore.startLoading()

    const response = await axios.get('http://localhost:5000/placement_test/get_test', {
      params: { id: props.level },
    })
    tasks.value = response.data
    console.log('Tasks loaded:', tasks.value)
    timer = setInterval(() => {
      seconds.value++
    }, 1000)
  } catch (error) {
    console.error('Request failed:', error)
  } finally {
    loadingStore.stopLoading()
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div v-if="currentTask" class="task-container">
    <div class="task-header">
      <div>
        <strong>TEST {{ props.level }}</strong>
      </div>

      <div>
        <strong>Zadanie {{ currentIndex + 1 }}/{{ tasks.length }}</strong>
      </div>
    </div>
    <div class="task-body">
      <h2>{{ currentTask.question }}</h2>
      <FillInnTask
        v-if="currentTask.task_type === 'fill_in'"
        :currentTask="currentTask"
        @submit="handleSubmitAnwsers"
        ref="componentRef"
      />
      <SelectionTask
        v-else-if="currentTask.task_type === 'selection'"
        :currentTask="currentTask"
        @submit="handleSubmitAnwsers"
        ref="componentRef"
      />
      <CorrectionTask
        v-else-if="currentTask.task_type === 'correction'"
        :currentTask="currentTask"
        ref="componentRef"
      />
      <CorrectionWordTask
        v-else-if="currentTask.task_type === 'correction_word'"
        :currentTask="currentTask"
        ref="componentRef"
      />
      <div v-else>
        <em>Nieobsługiwany typ zadania: {{ currentTask.task_type }}</em>
      </div>

      <div class="difficulty-rating">
        <p>Jak trudne było to zadanie?</p>
        <div class="difficulty-buttons">
          <button
            @click="rateDifficulty(1)"
            :style="{
              backgroundColor: taskDifficulty === 1 ? '#3b4bdc' : '#e0e0e0',
              color: taskDifficulty === 1 ? '#ffd700' : 'black',
            }"
          >
            😄 Bardzo łatwe
          </button>
          <button
            @click="rateDifficulty(2)"
            :style="{
              backgroundColor: taskDifficulty === 2 ? '#3b4bdc' : '#e0e0e0',
              color: taskDifficulty === 2 ? '#ffd700' : 'black',
            }"
          >
            🙂 Łatwe
          </button>
          <button
            @click="rateDifficulty(3)"
            :style="{
              backgroundColor: taskDifficulty === 3 ? '#3b4bdc' : '#e0e0e0',
              color: taskDifficulty === 3 ? '#ffd700' : 'black',
            }"
          >
            😐 Neutralne
          </button>
          <button
            @click="rateDifficulty(4)"
            :style="{
              backgroundColor: taskDifficulty === 4 ? '#3b4bdc' : '#e0e0e0',
              color: taskDifficulty === 4 ? '#ffd700' : 'black',
            }"
          >
            😕 Trudne
          </button>
          <button
            @click="rateDifficulty(5)"
            :style="{
              backgroundColor: taskDifficulty === 5 ? '#3b4bdc' : '#e0e0e0',
              color: taskDifficulty === 5 ? '#ffd700' : 'black',
            }"
          >
            😫 Bardzo trudne
          </button>
        </div>
      </div>

      <!-- Przycisk przejścia dalej -->
      <button v-if="currentIndex < tasks.length - 1" @click="goToNextTask" class="task-btn">
        Dalej
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-container {
  margin: 0;
  background-color: #fff;
  font-family: Arial, sans-serif;
  color: black;
  font-family: 'Varela Round', sans-serif;
  font-weight: 400;
  font-style: normal;
}

.task-header {
  background-color: #3b4bdc;
  color: #ffd700;
  padding: 25px 10rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 3rem;
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
</style>
