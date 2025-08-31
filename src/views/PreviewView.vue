<template>
  <div class="lesson-wrapper">
    <div class="lesson-content" v-if="lessonHtml && !loading && !error">
      <h2 class="lesson-title">{{ lessonTitle }}</h2>
      <div class="lesson-body tinymce-content" v-html="lessonHtml"></div>
    </div>
  </div>
</template>

<script setup>
import { useLoadingStore } from '@/stores/loading'
import axios from 'axios'
import { useRoute } from 'vue-router'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

const loadingStore = useLoadingStore()

const lessonHtml = ref('')
const lessonTitle = ref('')
const route = useRoute()

async function loadLesson(id) {
  try {
    loadingStore.startLoading()
    const { data } = await axios.get(`${URL.LESSONS}/lesson/${id}`)
    lessonHtml.value = data.context
    lessonTitle.value = data.title
  } catch (err) {
    console.error('Błąd podczas ładowania lekcji:', err)
  } finally {
    loadingStore.stopLoading()
  }
}

onMounted(() => {
  const id = route.query.id
  if (!id) {
    return
  }
  loadLesson(id)
})
</script>
