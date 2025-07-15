<template>
  <div class="create-lesson--wrapper">
    <div class="create-lesson">
      <h1 class="create-lesson__title">Utwórz nową lekcję</h1>

      <form @submit.prevent="submitLesson" class="create-lesson__form">
        <!-- Tytuł -->
        <div class="create-lesson__group">
          <label for="title" class="create-lesson__label">Tytuł lekcji</label>
          <input
            id="title"
            v-model="lessonData.title"
            type="text"
            placeholder="Wpisz tytuł lekcji"
            class="create-lesson__input"
          />
        </div>

        <!-- Opis -->
        <div class="create-lesson__group">
          <label for="description" class="create-lesson__label">Opis</label>
          <textarea
            id="description"
            v-model="lessonData.description"
            rows="4"
            placeholder="Opis lekcji"
            class="create-lesson__textarea"
          ></textarea>
        </div>

        <!-- Kategoria + Podkategoria + Poziom -->
        <div class="create-lesson__group create-lesson__group--row">
          <div class="create-lesson__select-group">
            <label for="mainCategory" class="create-lesson__label">Główna kategoria</label>
            <select
              id="mainCategory"
              v-model="lessonData.main_category"
              class="create-lesson__select"
            >
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

          <div class="create-lesson__select-group">
            <label for="subCategory" class="create-lesson__label">Podkategoria</label>
            <select
              id="subCategory"
              v-model="lessonData.sub_category"
              class="create-lesson__select"
            >
              <option disabled value="">Wybierz podkategorię</option>
              <option
                v-for="sub in getSubCategories(lessonData.main_category)"
                :key="sub"
                :value="sub"
              >
                {{ sub }}
              </option>
            </select>
          </div>

          <div class="create-lesson__select-group">
            <label for="level" class="create-lesson__label">Poziom</label>
            <select id="level" v-model="lessonData.level" class="create-lesson__select">
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
            </select>
          </div>
        </div>

        <!-- Kontekst z TinyMCE -->
        <div class="create-lesson__group">
          <label class="create-lesson__label">Kontekst</label>
          <Editor
            ref="tinyEditor"
            v-model="lessonData.context"
            api-key="k0efnljtvefg89se78os1oopj0hhvfyohqfko19nnrqo5x7j"
            :init="{
              height: 700,
              menubar: true,
              plugins:
                'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount hr fullscreen code preview paste help',
              toolbar:
                'undo redo | formatselect blocks fontfamily fontsize | bold italic underline strikethrough | link image media table hr | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | fullscreen preview code help',
              toolbar_mode: 'sliding',
              statusbar: false,
            }"
          />
        </div>

        <!-- Submit -->
        <button type="submit" class="create-lesson__button">Utwórz lekcję</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useLoadingStore } from '@/stores/loading'
import { handleApiError } from '@/composables/errorHandling'
import Editor from '@tinymce/tinymce-vue'

const authStore = useAuthStore()
const { jwtToken, user } = storeToRefs(authStore)

const loadingStore = useLoadingStore()
const router = useRouter()

const grammarTopics = [
  {
    main_category: 'Rzeczowniki',
    sub_categories: [
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
    sub_categories: [
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
]

const lessonData = reactive({
  title: '',
  description: '',
  context: '',
  owner: user.value?.id || null,
  main_category: '',
  sub_category: '',
  level: 'A1',
})

function getSubCategories(mainCategory) {
  const topic = grammarTopics.find((t) => t.main_category === mainCategory)
  return topic ? topic.sub_categories : []
}

async function submitLesson() {
  if (!lessonData.title.trim()) {
    alert('Proszę podać tytuł lekcji')
    return
  }
  if (!lessonData.description.trim()) {
    alert('Proszę podać opis lekcji')
    return
  }
  if (!lessonData.context.trim()) {
    alert('Proszę podać kontekst lekcji')
    return
  }
  if (!lessonData.main_category) {
    alert('Proszę wybrać główną kategorię')
    return
  }
  if (!lessonData.level) {
    alert('Proszę wybrać poziom')
    return
  }

  try {
    loadingStore.startLoading()

    await axios.post('http://localhost:5000/lessons/create_lesson', lessonData, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    })

    router.push('/classes-teacher')
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
}
</script>

<style scoped>
.create-lesson--wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}
.create-lesson {
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  color: #333;
}

.create-lesson__title {
  text-align: center;
  margin-bottom: 24px;
}

.create-lesson__form {
  display: flex;
  flex-direction: column;
}

.create-lesson__group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.create-lesson__group--row {
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
}

.create-lesson__select-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.create-lesson__label {
  margin-bottom: 6px;
  font-weight: 600;
}

.create-lesson__input,
.create-lesson__textarea,
.create-lesson__select {
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
}

.create-lesson__button {
  padding: 10px 16px;
  font-size: 18px;
  background-color: #3b4bdc;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: 700;
  transition: background-color 0.3s ease;
}

.create-lesson__button:hover {
  background-color: #2f3fc2;
}
</style>
