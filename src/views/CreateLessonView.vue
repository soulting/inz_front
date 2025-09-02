<template>
  <div class="create-lesson--wrapper">
    <div class="create-lesson">
      <h1 class="create-lesson__title">Utwórz nową lekcję</h1>

      <form @submit.prevent="submitLesson" class="create-lesson__form">
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

        <button type="submit" class="create-lesson__button">Utwórz lekcję</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import categories from '@/assets/data/categories.json'
import Editor from '@tinymce/tinymce-vue'
import { useRoute, useRouter } from 'vue-router'

import { onMounted, reactive } from 'vue'

import { URL } from '@/enums'

const router = useRouter()
const route = useRoute()

const grammarTopics = categories.categories_list

const lessonData = reactive({
  id: null,
  title: '',
  description: '',
  context: '',
  main_category: '',
  sub_category: '',
  level: 'A1',
})

function getSubCategories(mainCategory) {
  const topic = grammarTopics.find((t) => t.main_category === mainCategory)
  return topic ? topic.sub_categories : []
}

async function submitLesson() {
  const { title, description, context, main_category, level } = lessonData

  if (!title.trim() || !description.trim() || !context.trim() || !main_category || !level) {
    alert('Proszę uzupełnić wszystkie wymagane pola lekcji')
    return
  }

  try {
    if (lessonData.id) {
      await useApi().put(`${URL.LESSONS}/lesson/${lessonData.id}`, lessonData)
    } else {
      await useApi().post(`${URL.LESSONS}/lesson`, lessonData)
    }
    router.push('/classes-teacher')
  } catch (error) {
    console.error('Błąd podczas tworzenia lekcji:', error)
  }
}

onMounted(async () => {
  window.scrollTo(0, 0)
  lessonData.id = route.query.id || null

  if (lessonData.id) {
    try {
      const response = await useApi().get(`${URL.LESSONS}/lesson/${lessonData.id}`)
      Object.assign(lessonData, response)
    } catch (error) {
      console.error('Błąd podczas pobierania lekcji:', error)
    }
  }
})
</script>
