<template>
  <div v-if="currentTask.task_items" class="correction-word-task">
    <div v-for="(task_item, index) in currentTask.task_items" :key="task_item.id" class="task-item">
      <div class="task-content">
        <span class="task-number">{{ index + 1 }}.</span>
        <span class="word-text">{{ task_item.template }}</span>
        <span v-if="task_item.bonus_information" class="task-info">
          <strong>({{ task_item.bonus_information }})</strong>
        </span>
        <span class="arrow">→</span>
        <input
          type="text"
          class="task-input"
          v-model="userInputs[index]"
          placeholder="Przekształcone słowo..."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['currentTask'])
const userInputs = ref([])
const emit = defineEmits(['submit', 'noAnswers'])

function submitAnswers() {
  if (userInputs.value.some((input) => input === '')) {
    emit('noAnswers')
    return
  }
  emit('submit', userInputs.value)
  console.log('Answers submitted from Correction Word.')
}

watch(
  () => props.currentTask.task_items,
  (newTaskItems) => {
    userInputs.value = newTaskItems.map(() => '')
  },
  { immediate: true },
)

defineExpose({
  submitAnswers,
})
</script>

<style scoped>
.correction-word-task {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.task-number {
  font-weight: 600;
  color: #4f46e5;
  min-width: 20px;
}

.word-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1f2937;
}

.task-info {
  color: #6b7280;
  font-size: 0.9rem;
}

.arrow {
  font-size: 1.2rem;
  color: #4f46e5;
  font-weight: bold;
}

.task-input {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  min-width: 200px;
  transition: border-color 0.2s ease;
}

.task-input:focus {
  outline: none;
  border-color: #4f46e5;
}

.task-input::placeholder {
  color: #9ca3af;
  font-style: italic;
}

/* Responsive design */
@media (max-width: 640px) {
  .task-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .task-input {
    width: 100%;
    min-width: unset;
  }

  .arrow {
    align-self: center;
  }
}
</style>
