<template>
  <div class="lesson-content" v-if="lessonHtml">
    <h2 class="lesson-title">{{ lessonTitle }}</h2>
    <div class="lesson-body" v-html="lessonHtml"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  lessonId: {
    type: Number,
    required: true,
  },
})

const lessonHtml = ref('')
const lessonTitle = ref('')

onMounted(async () => {
  try {
    const response = await axios.get(`/api/lessons/${props.lessonId}`)

    // Przykład struktury odpowiedzi
    // {
    //   title: "Lekcja o czasownikach modalnych",
    //   content: "<p>Treść w HTML</p>"
    // }

    lessonHtml.value = response.data.content
    lessonTitle.value = response.data.title
  } catch (error) {
    console.error('Błąd podczas ładowania lekcji:', error)
    lessonHtml.value = '<p>Nie udało się załadować treści lekcji.</p>'
  }
})
</script>

<style scoped>
.lesson-content {
  max-width: 1000px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
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

.lesson-loading {
  text-align: center;
  font-size: 18px;
  margin-top: 40px;
}
</style>
