<template>
  <div class="create-task">
    <div class="create-task__form">
      <h1 class="create-task__title">Utwórz nowe zadanie</h1>
      <div class="create-task__form-row">
        <div class="create-task__form-group">
          <label for="mainCategory">Główna kategoria</label>
          <select v-model="taskData.selectedMainCategory" id="mainCategory">
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
          <select v-model="taskData.selectedFirstCategory" id="firstCategory">
            <option disabled value="">Wybierz podkategorię</option>
            <option
              v-for="cat in getFirstCategories(taskData.selectedMainCategory)"
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
        <select v-model="taskData.taskType" id="taskType">
          <option value="selection">Wybór z listy</option>
          <option value="correction_word">Popraw wyraz</option>
          <option value="fill_in">Uzupełnij lukę</option>
          <option value="correction">Popraw zdanie</option>
        </select>
      </div>

      <div v-if="taskData.taskType === 'selection'" class="create-task__placeholder">
        <TaskSelect @taskCreated="createTask" :subpoints="taskData.subpoints" />
      </div>
      <div v-if="taskData.taskType === 'correction_word'" class="create-task__placeholder">
        <MultiTask
          @taskCreated="createTask"
          :subpoints="taskData.subpoints"
          type="correction_word"
        />
      </div>
      <div v-if="taskData.taskType === 'fill_in'" class="create-task__placeholder">
        <MultiTask @taskCreated="createTask" :subpoints="taskData.subpoints" type="fill_in" />
      </div>
      <div v-if="taskData.taskType === 'correction'" class="create-task__placeholder">
        <MultiTask @taskCreated="createTask" :subpoints="taskData.subpoints" type="correction" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import TaskSelect from '@/components/TaskSelection.vue'
import MultiTask from '@/components/MultiTask.vue'

import { useLoadingStore } from '@/stores/loading'
import { handleApiError } from '@/composables/errorHandling'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import axios from 'axios'
const authStore = useAuthStore()

const { jwtToken } = storeToRefs(authStore)

const loadingStore = useLoadingStore()

const router = useRouter()

const taskData = reactive({
  id: null,
  selectedMainCategory: '',
  selectedFirstCategory: '',
  taskType: 'selection',
  level: 'A1',
  question: '',
  subpoints: [],
})

const route = useRoute()

const grammarTopics = [
  {
    main_category: 'Rzeczowniki',
    first_categorys: [
      'Rodzaj (męski, żeński, nijaki)',
      'Liczba mnoga',
      'Odmiana (słaba, mocna, mieszana)',
      'Przypadki (Nominativ, Genitiv, Dativ, Akkusativ)',
      'Rodzajniki (określony, nieokreślony, zerowy)',
      'Rzeczowniki złożone',
    ],
  },
  {
    main_category: 'Czasowniki',
    first_categorys: [
      'Odmiana (regularne)',
      'Odmiana (nieregularna)',
      'Czasowniki modalne',
      'Czasowniki zwrotne',
      'Czasowniki złożone (rozdzielnie i nierozdzielnie złożone)',
      'Bezokoliczniki (z/bez „zu”)',
      'Partizip II',
      'Partizip I',
      'Rekcja (przypadki i przyimki)',
    ],
  },
  {
    main_category: 'Przymiotniki',
    first_categorys: [
      'Odmiana (z różnymi rodzajnikami)',
      'Stopniowanie (wyższy, najwyższy)',
      'Tworzenie, antonimy',
      'Rekcja',
    ],
  },
  {
    main_category: 'Liczebniki',
    first_categorys: [
      'Główne, porządkowe, ułamkowe',
      'Czas (zegary, daty)',
      '„Wie viel” vs. „Wie viele”',
    ],
  },
  {
    main_category: 'Inne części mowy',
    first_categorys: [
      'Partykuły (aber, doch, denn, mal; hin, her)',
      'Przyimki (z przypadkami, miejsca, czasu, przyczyny)',
      'Przysłówki (stopniowanie)',
      'Zaimek (osobowy, nieosobowy, dzierżawczy, zwrotny, wskazujący, pytający, nieokreślony, przysłówki zaimkowe)',
      'Przydawka i zdania przydawkowe',
    ],
  },
  {
    main_category: 'Czasy',
    first_categorys: [
      'Imperfekt (słabe, mocne, nieregularne/modalne)',
      'Perfekt (słabe, mocne, nieregularne/modalne)',
      'Plusquamperfekt',
      'Futur I',
    ],
  },
  {
    main_category: 'Budowa zdań i konstrukcje',
    first_categorys: [
      'Szyk wyrazów (zdania pojedyncze, współrzędne, poboczne)',
      'Zdania pytające (tak/nie, pytające, z przyimkami, zależne)',
      'Zdania okolicznikowe (czasu, przyczyny, celu, następstwa, sposobu)',
      'Inne zdania (dopełnieniowe, warunkowe, przyzwalające, porównawcze, skutkowe, podmiotowe, dopowiedzenia)',
      'Spójniki wieloczłonowe',
      'Wyrażenia czasownikowo-rzeczownikowe',
    ],
  },
]

function getFirstCategories(mainCat) {
  const topic = grammarTopics.find((t) => t.main_category === mainCat)
  return topic ? topic.first_categorys : []
}

async function createTask(subpoints) {
  taskData.subpoints = subpoints

  const {
    selectedMainCategory,
    selectedFirstCategory,
    level,
    question,
    taskType,
    subpoints: sp,
  } = taskData

  if (!selectedMainCategory) {
    alert('Proszę wybrać główną kategorię')
    return
  }
  if (!selectedFirstCategory) {
    alert('Proszę wybrać pierwszą kategorię')
    return
  }
  if (!level) {
    alert('Proszę wybrać poziom')
    return
  }
  if (!question.trim()) {
    alert('Proszę wpisać pytanie')
    return
  }
  if (!taskType) {
    alert('Proszę wybrać typ zadania')
    return
  }
  if (!sp || sp.length === 0) {
    alert('Proszę uzupełnić dane specyficzne dla typu zadania')
    return
  }

  try {
    loadingStore.startLoading()

    const url = taskData.id
      ? `http://localhost:5000/tasks/update_task/${taskData.id}`
      : 'http://localhost:5000/tasks/create_task'

    const method = taskData.id ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken.value}`,
      },
      body: JSON.stringify(taskData),
    })

    if (!response.ok) {
      throw new Error('Błąd zapisu danych')
    }

    router.push('/classes-teacher')
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }

  console.log(`${taskData.id ? 'Zadanie zaktualizowane' : 'Nowe zadanie utworzone'}:`, taskData)
}

onMounted(async () => {
  window.scrollTo(0, 0)

  taskData.id = route.query.id || null
  taskData.selectedMainCategory = route.query.selectedMainCategory || ''
  taskData.selectedFirstCategory = route.query.selectedFirstCategory || ''
  taskData.taskType = route.query.taskType || 'selection'
  taskData.level = route.query.level || 'A1'
  taskData.question = route.query.question || ''
  taskData.subpoints = []

  if (taskData.id) {
    try {
      loadingStore.startLoading()
      const response = await axios.get(`http://localhost:5000/tasks/get_subpoints/${taskData.id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`,
        },
      })
      taskData.subpoints = response.data.subpoints || []
      console.log('Pobrano subpunkty:', taskData.subpoints)
    } catch (error) {
      handleApiError(error, router)
    } finally {
      loadingStore.stopLoading()
    }
  }
})
</script>

<style scoped lang="scss">
.create-task {
  background-color: #f5f5f5;
  padding: 24px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;

  &__title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 24px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    max-width: 1000px;
    width: 85%;

    &-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    &-group {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 200px;

      &--task-type {
        max-width: 300px;
      }

      label {
        font-weight: 500;
        margin-bottom: 6px;
        color: #333;
      }

      select,
      textarea {
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        resize: none;
      }
    }
  }

  &__placeholder {
    background-color: #f9f9f9;
    border: 1px dashed #ccc;
    border-radius: 8px;
    font-style: italic;
    color: #666;
  }

  &__submit-button {
    margin-top: 16px;
    align-self: flex-start;
    padding: 12px 22px;
    font-size: 16px;
    background-color: #3b4bdc;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 6px rgba(25, 118, 210, 0.4);

    &:hover {
      background-color: #2f3fc2;
    }
  }
}
</style>
