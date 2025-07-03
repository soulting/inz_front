<template>
  <div class="create-task">
    <h1 class="create-task__title">Utwórz nowe zadanie</h1>

    <div class="create-task__form">
      <div class="create-task__form-row">
        <div class="create-task__form-group">
          <label for="mainCategory">Główna kategoria</label>
          <select v-model="selectedMainCategory" id="mainCategory">
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
          <select v-model="selectedFirstCategory" id="firstCategory">
            <option disabled value="">Wybierz podkategorię</option>
            <option v-for="cat in getFirstCategories(selectedMainCategory)" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="create-task__form-group">
          <label for="level">Poziom</label>
          <select v-model="level" id="level">
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
          </select>
        </div>
      </div>

      <div class="create-task__form-group">
        <label for="question">Pytanie</label>
        <textarea
          v-model="question"
          id="question"
          rows="4"
          placeholder="Wpisz treść pytania..."
        ></textarea>
      </div>

      <div class="create-task__form-group create-task__form-group--task-type">
        <label for="taskType">Typ zadania</label>
        <select v-model="taskType" id="taskType">
          <option value="selection">Wybór z listy</option>
          <option value="correction_word">Popraw wyraz</option>
          <option value="fill_id">Uzupełnij lukę</option>
          <option value="correction">Popraw zdanie</option>
        </select>
      </div>

      <div v-if="taskType === 'selection'" class="create-task__placeholder">
        <TaskSelect />
      </div>
      <div v-if="taskType === 'correction_word'" class="create-task__placeholder">
        Komponent dla typu „Popraw wyraz”
      </div>
      <div v-if="taskType === 'fill_id'" class="create-task__placeholder">
        Komponent dla typu „Uzupełnij lukę”
      </div>
      <div v-if="taskType === 'correction'" class="create-task__placeholder">
        Komponent dla typu „Popraw zdanie”
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskSelect from '@/components/TaskSelect.vue'

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
      'Złożone (rozdzielnie i nierozdzielnie złożone)',
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

const selectedMainCategory = ref('')
const selectedFirstCategory = ref('')
const taskType = ref('selection')
const level = ref('A1')
const question = ref('')

function getFirstCategories(mainCat) {
  const topic = grammarTopics.find((t) => t.main_category === mainCat)
  return topic ? topic.first_categorys : []
}
</script>

<style scoped lang="scss">
.create-task {
  min-height: 100vh;
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  margin: 0 auto;

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
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px dashed #ccc;
    border-radius: 8px;
    font-style: italic;
    color: #666;
  }
}
</style>
