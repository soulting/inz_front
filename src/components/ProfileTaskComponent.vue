<template>
  <div class="profile-task-component">
    <div v-if="taskInfo && taskAnalytics" class="task-details">
      <h2 class="task-title">{{ taskInfo.question }}</h2>
      <div class="task-meta">
        <p><strong>Kategoria główna:</strong> {{ taskInfo.main_category }}</p>
        <p><strong>Podkategoria:</strong> {{ taskInfo.sub_category }}</p>
        <p><strong>Poziom:</strong> {{ taskInfo.level }}</p>
      </div>
      <div class="task-analytics">
        <p>
          <strong>Czas spędzony na zadaniu:</strong>
          {{ formatTime(taskAnalytics.time_spent) }}
        </p>
        <p>
          <strong>Procent dobrych odpowiedzi:</strong>
          {{ calculateCorrectPercentage(taskAnalytics) }}%
        </p>
      </div>
    </div>
    <div v-else>
      <p>Ładowanie informacji o zadaniu...</p>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

const props = defineProps({
  taskId: {
    type: String,
    required: true,
  },
  taskAnalytics: {
    type: Object,
    required: true,
  },
})

const taskInfo = ref(null)

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours}h ${minutes}m ${secs}s`
}

const calculateCorrectPercentage = (analytics) => {
  const totalAttempts = analytics.task_points + analytics.task_error + analytics.task_uncertainty
  if (totalAttempts === 0) return 0
  return ((analytics.task_points / totalAttempts) * 100).toFixed(2)
}

onMounted(async () => {
  const taskInfoResponse = await useApi().get(`${URL.TASKS}/task/${props.taskId}`)
  taskInfo.value = taskInfoResponse
})
</script>

<style scoped>
.profile-task-component {
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 1.5rem 0;
  font-family: 'Inter', sans-serif;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.profile-task-component:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.task-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.task-meta {
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.task-meta p {
  margin: 0.5rem 0;
}

.task-meta p strong {
  color: #111827;
}

.task-analytics {
  font-size: 1rem;
  color: #374151;
}

.task-analytics p {
  margin: 0.5rem 0;
}

.task-analytics p strong {
  color: #111827;
}

.engagement {
  font-weight: bold;
}

.engagement .good {
  color: #10b981;
}

.engagement .bad {
  color: #ef4444;
}
</style>
