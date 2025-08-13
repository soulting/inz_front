<template>
  <div v-if="currentTask.task_items" class="correction-task">
    <div v-for="(task_item, index) in currentTask.task_items" :key="task_item.id" class="task-item">
      <div class="task-header">
        <span class="task-number">{{ index + 1 }}.</span>
        <span class="question-text">{{ task_item.template }}</span>
      </div>

      <div v-if="task_item.bonus_information" class="task-info">
        <strong>{{ task_item.bonus_information }}</strong>
      </div>

      <input
        type="text"
        class="task-input"
        v-model="userInputs[index]"
        placeholder="Twoja odpowiedź..."
      />
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
  console.log('Answers submitted from Correct.')
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
.correction-task {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-item {
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.task-number {
  font-weight: 600;
  color: #4f46e5;
  min-width: 20px;
  font-size: 1.1rem;
}

.question-text {
  font-size: 1.1rem;
  line-height: 1.5;
  color: #1f2937;
  flex: 1;
}

.task-info {
  margin-bottom: 1rem;
  padding: 0.6rem 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
  color: #374151;
  font-size: 0.95rem;
}

.task-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  transition: border-color 0.2s ease;
}

.task-input:focus {
  outline: none;
  border-color: #4f46e5;
}

.task-input::placeholder {
  color: #9ca3af;
}
</style>
