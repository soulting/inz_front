<template>
  <div class="lesson-content" v-if="lessonHtml && !loading && !error">
    <h2 class="lesson-title">{{ lessonTitle }}</h2>
    <div class="lesson-body tinymce-content" v-html="lessonHtml"></div>
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
    const { data } = await axios.get(`${URL.LESSONS}/get_lesson/${id}`)
    console.log(data)
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

<style scoped lang="scss">
.lesson-content {
  max-width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  color: black;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.lesson-title {
  font-size: 28px;
  margin-bottom: 20px;
}

.lesson-body {
  font-size: 16px;
  line-height: 1.6;
}

.lesson-loading,
.lesson-error {
  text-align: center;
  font-size: 18px;
  margin-top: 40px;
  color: #555;
}
.lesson-error {
  color: red;
}
</style>
