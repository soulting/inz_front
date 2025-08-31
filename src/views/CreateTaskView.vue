<template>
  <div class="create-task">
    <div class="create-task__form">
      <h1 class="create-task__title">Utwórz nowe zadanie</h1>
      <div class="create-task__form-row">
        <div class="create-task__form-group">
          <label for="mainCategory">Główna kategoria</label>
          <select v-model="taskData.main_category" id="mainCategory">
            <option disabled value="">Wybierz kategorię</option>
            <option
              v-for="topic in grammarTopics"
              :key="topic.main_category"
              :value="topic.main_category"
            >
              {{ topic.main_category }}
            </option>
          </select>
        </div>

        <div class="create-task__form-group">
          <label for="firstCategory">Pierwsza kategoria</label>
          <select v-model="taskData.sub_category" id="firstCategory">
            <option disabled value="">Wybierz podkategorię</option>
            <option
              v-for="cat in getFirstCategories(taskData.main_category)"
              :key="cat"
              :value="cat"
            >
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="create-task__form-group">
          <label for="level">Poziom</label>
          <select v-model="taskData.level" id="level">
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
          </select>
        </div>
      </div>

      <div class="create-task__form-group">
        <label for="question">Pytanie</label>
        <textarea
          v-model="taskData.question"
          id="question"
          rows="4"
          placeholder="Wpisz treść pytania..."
        ></textarea>
      </div>

      <div class="create-task__form-group create-task__form-group--task-type">
        <label for="taskType">Typ zadania</label>
        <select v-model="taskData.task_type" id="taskType">
          <option :value="TASK_TYPES.SELECTION">Wybór z listy</option>
          <option :value="TASK_TYPES.CORRECTION_WORD">Popraw wyraz</option>
          <option :value="TASK_TYPES.FILL_IN">Uzupełnij lukę</option>
          <option :value="TASK_TYPES.CORRECTION">Popraw zdanie</option>
        </select>
      </div>

      <div v-if="taskData.task_type === TASK_TYPES.SELECTION" class="create-task__placeholder">
        <TaskSelect @taskCreated="createTask" :task_items="taskData.task_items" />
      </div>
      <div
        v-if="taskData.task_type === TASK_TYPES.CORRECTION_WORD"
        class="create-task__placeholder"
      >
        <MultiTask
          @taskCreated="createTask"
          :task_items="taskData.task_items"
          :type="TASK_TYPES.CORRECTION_WORD"
        />
      </div>
      <div v-if="taskData.task_type === TASK_TYPES.FILL_IN" class="create-task__placeholder">
        <MultiTask
          @taskCreated="createTask"
          :task_items="taskData.task_items"
          :type="TASK_TYPES.FILL_IN"
        />
      </div>
      <div v-if="taskData.task_type === TASK_TYPES.CORRECTION" class="create-task__placeholder">
        <MultiTask
          @taskCreated="createTask"
          :task_items="taskData.task_items"
          :type="TASK_TYPES.CORRECTION"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import categories from '@/assets/data/categories.json'
import { useRoute, useRouter } from 'vue-router'

import { onMounted, reactive } from 'vue'

import { TASK_TYPES, URL } from '@/enums'

import MultiTask from '@/components/MultiTask.vue'
import TaskSelect from '@/components/TaskSelection.vue'

const router = useRouter()

const taskData = reactive({
  id: null,
  main_category: '',
  sub_category: '',
  task_type: TASK_TYPES.SELECTION,
  level: 'A1',
  question: '',
  task_items: [],
})

const route = useRoute()

const grammarTopics = categories.categories_list

function getFirstCategories(mainCat) {
  const topic = grammarTopics.find((t) => t.main_category === mainCat)
  return topic ? topic.sub_categories : []
}

async function createTask(task_items) {
  taskData.task_items = task_items

  const { main_category, sub_category, level, question, task_type, task_items: sp } = taskData

  if (
    !main_category ||
    !sub_category ||
    !level ||
    !question.trim() ||
    !task_type ||
    !sp ||
    sp.length === 0
  ) {
    alert('Proszę uzupełnić wszystkie wymagane pola.')
    return
  }

  try {
    if (taskData.id) {
      await useApi().put(`${URL.TASKS}/task/${taskData.id}`, taskData)
    } else {
      await useApi().post(`${URL.TASKS}/task`, taskData)
    }
    router.push('/classes-teacher')
  } catch (error) {
    console.error('Błąd podczas tworzenia zadania:', error)
  }
}

onMounted(async () => {
  window.scrollTo(0, 0)

  taskData.id = route.query.id || null

  if (taskData.id) {
    try {
      const response = await useApi().get(`${URL.TASKS}/task/${taskData.id}`)
      Object.assign(taskData, response)
    } catch (error) {
      console.error('Błąd podczas pobierania zadania:', error)
    }
  }
})
</script>
