<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { useLoadingStore } from '../stores/loading'

const props = defineProps(['level'])

const loadingStore = useLoadingStore()
const tasks = ref([])
const currentIndex = ref(0)

const currentTask = computed(() => tasks.value[currentIndex.value] || null)

function goToNextTask() {
  currentIndex.value++
  // const taskForAnalisis = document.getElementsByClassName('task-item')
  // console.log(taskForAnalisis)
  // Array.from(taskForAnalisis).forEach((el) => {
  //   console.log(Array.from(el.querySelectorAll('input')).map((input) => input.value))
  // })
}

onMounted(async () => {
  try {
    loadingStore.startLoading()

    const response = await axios.get('http://localhost:5000/placement_test/get_test', {
      params: { id: props.level },
    })
    tasks.value = response.data
    console.log('Tasks loaded:', tasks.value)
  } catch (error) {
    console.error('Request failed:', error)
  } finally {
    loadingStore.stopLoading()
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

      <ol v-if="currentTask.subtasks">
        <li v-for="sub in currentTask.subtasks" :key="sub.id" class="task-item">
          <!-- fill_in -->
          <div v-if="currentTask.task_type === 'fill_in'">
            <span>
              <template v-for="(word, index) in sub.question.split('%%')" :key="index">
                <span v-if="word === '[inp]'">
                  <input class="task-item-input fill-in" type="text" />
                </span>
                <span v-else>{{ word }}</span>
              </template>
            </span>
          </div>

          <div v-else-if="currentTask.task_type === 'correction'" class="correction-container">
            <span>{{ sub.question }} </span>
            <input type="text" class="task-item-input correction" />
          </div>

          <div v-else-if="currentTask.task_type === 'selection'" class="sellection-container">
            <span>
              <template v-for="(word, index) in sub.question.split('%%')" :key="index">
                <span v-if="word === '[sel]'">
                  <input class="task-item-input select" type="text" />
                </span>
                <span v-else>{{ word }}</span>
              </template>
              <form>
                <label
                  ><input type="radio" name="question1" :value="sub.options[0]" /> a)
                  {{ sub.options[0] }}</label
                ><br />
                <label
                  ><input type="radio" name="question1" :value="sub.options[1]" /> b)
                  {{ sub.options[1] }}</label
                ><br />
                <label
                  ><input type="radio" name="question1" :value="sub.options[2]" /> c)
                  {{ sub.options[2] }}</label
                >
              </form>
            </span>
          </div>
          <div
            v-else-if="currentTask.task_type === 'correction_word'"
            class="correction-word-container"
          >
            <span>{{ sub.question }} : </span>
            <input type="text" class="task-item-input correction" />
          </div>

          <!-- inne typy (jeśli się pojawią) -->
          <div v-else>
            <em>Nieobsługiwany typ zadania: {{ currentTask.task_type }}</em>
          </div>
        </li>
      </ol>

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

.task-body {
  padding: 20px 10rem;
  /* list-style: none; */
  font-size: 1.5rem;
}

.task-btn {
  border: none;
  cursor: pointer;
  border-radius: 10px;
  font-weight: 600;
  background-color: #3b4bdc;
  color: #fff;
  padding: 1rem 1rem;
  font-size: 1.5rem;
  transition: background-color 0.3s ease;
  width: 10rem;
}

.task-btn:hover {
  background-color: #2e36a8;
}

.task-item {
  margin: 1rem;
}

.task-item-input {
  padding: 3px 10px;
  border: none;
  border-bottom: 1.5px solid rgb(100, 100, 100);
  font-size: 1.2rem;
}
.task-item-input:focus {
  outline: none;
  border-bottom: 2.5px solid rgb(100, 100, 100);
}

.fill-in {
  width: 100px;
}
.correction {
  width: 300px;
}

.select {
  width: 40px;
  pointer-events: none;
}

.correction-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.correction-word-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

fieldset {
  outline: none;
}
</style>
