<template>
  <div class="profile-lesson-component">
    <div v-if="lesonInfo" class="lesson-details">
      <h2 class="lesson-title">{{ lesonInfo.title }}</h2>
      <p class="lesson-description">{{ lesonInfo.description }}</p>
      <div class="lesson-meta">
        <p><strong>Kategoria główna:</strong> {{ lesonInfo.main_category }}</p>
        <p><strong>Podkategoria:</strong> {{ lesonInfo.sub_category }}</p>
        <p><strong>Poziom:</strong> {{ lesonInfo.level }}</p>
      </div>

      <div class="lesson-analytics">
        <p>
          <strong>Czas spędzony na nauce:</strong>
          {{ formatTime(lessonAnalytics.time_on_page) }}
        </p>
        <p>
          <strong>Ocena zaangażowania:</strong>
          <span class="engagement">
            <span
              v-if="lessonAnalytics.time_on_page >= lessonAnalytics.expected_time / 2"
              class="good"
            >
              😊 Wystarczająco czasu spędzono na lekcji
            </span>
            <span v-else class="bad"> 😟 Zbyt mało czasu spędzono na lekcji </span>
          </span>
        </p>
      </div>
    </div>
    <div v-else>
      <p>Ładowanie informacji o lekcji...</p>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

const props = defineProps({
  lessonAnalytics: {
    type: Object,
    required: true,
  },
})

const lesonInfo = ref(null)
const router = useRouter()

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours}h ${minutes}m ${secs}s`
}

onMounted(async () => {
  const lessonInforResponse = await useApi().get(
    `${URL.LESSONS}/lesson/${props.lessonAnalytics.lesson_id}`,
    router,
  )
  lesonInfo.value = lessonInforResponse
})
</script>

<style scoped>
.profile-lesson-component {
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lesson-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.lesson-description {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #555;
}

.lesson-meta {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 1rem;
}

.lesson-meta p {
  margin: 0.25rem 0;
}

.lesson-analytics {
  font-size: 0.9rem;
  color: #333;
}

.lesson-analytics p {
  margin: 0.5rem 0;
}

.engagement {
  font-weight: bold;
}

.engagement .good {
  color: #28a745;
}

.engagement .bad {
  color: #dc3545;
}
</style>
