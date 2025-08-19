<template>
  <div v-if="currentTask.task_items" class="selection-task">
    <div
      v-for="(task_item, index1) in currentTask.task_items"
      :key="task_item.id"
      class="task-item"
    >
      <div class="task-content">
        <div class="task-header">
          <span class="task-number">{{ index1 + 1 }}.</span>
          <div class="sentence-container">
            <template v-for="(word, index2) in task_item.template.split('%%')" :key="index2">
              <span v-if="word === '[sel]'" class="selection-placeholder"> ___ </span>
              <span v-else class="text-segment">{{ word }}</span>
            </template>
            <span v-if="task_item.bonus_information" class="task-info">
              <strong>({{ task_item.bonus_information }})</strong>
            </span>
          </div>
        </div>

        <div class="options-container">
          <label class="option-label">
            <input
              v-model="userInputs[index1]"
              type="radio"
              :name="`question-${index1}`"
              :value="task_item.options[0]"
              class="option-input"
            />
            <span class="option-text">a) {{ task_item.options[0] }}</span>
          </label>

          <label class="option-label">
            <input
              v-model="userInputs[index1]"
              type="radio"
              :name="`question-${index1}`"
              :value="task_item.options[1]"
              class="option-input"
            />
            <span class="option-text">b) {{ task_item.options[1] }}</span>
          </label>

          <label class="option-label">
            <input
              v-model="userInputs[index1]"
              type="radio"
              :name="`question-${index1}`"
              :value="task_item.options[2]"
              class="option-input"
            />
            <span class="option-text">c) {{ task_item.options[2] }}</span>
          </label>

          <label class="option-label option-label--uncertain">
            <input
              v-model="userInputs[index1]"
              type="radio"
              :name="`question-${index1}`"
              value="???"
              class="option-input"
            />
            <span class="option-text">d) Nie wiem</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['currentTask'])
const emit = defineEmits(['submit', 'noAnswers'])

const userInputs = ref([])
const currentAnswers = ref([])

function submitAnswers() {
  if (userInputs.value.some((input) => input === '')) {
    emit('noAnswers')
    return
  }

  const answers = currentAnswers.value.map((row, index) =>
    row.replace('%%[sel]%%', userInputs.value[index]),
  )

  emit('submit', answers)
  console.log('Answers submitted from SelectionTask.')
}

watch(
  () => props.currentTask.task_items,
  (newTaskItems) => {
    currentAnswers.value = newTaskItems.map((task_item) => task_item.template)
    userInputs.value = newTaskItems.map(() => '')
  },
  { immediate: true },
)

defineExpose({
  submitAnswers,
})
</script>

<style scoped>
.selection-task {
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

.task-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.task-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.task-number {
  font-weight: 600;
  color: #4f46e5;
  min-width: 20px;
  font-size: 1.1rem;
}

.sentence-container {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.25rem;
  line-height: 1.6;
}

.text-segment {
  font-size: 1.1rem;
  color: #1f2937;
}

.selection-placeholder {
  font-size: 1.1rem;
  color: #4f46e5;
  font-weight: 600;
  text-decoration: underline;
}

.task-info {
  color: #6b7280;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-left: 1.5rem;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.option-label:hover {
  background: #f9fafb;
}

.option-label--uncertain {
  border: 1px dashed #f59e0b;
  background: #fffbeb;
}

.option-label--uncertain:hover {
  background: #fef3c7;
}

.option-input {
  width: 16px;
  height: 16px;
  accent-color: #4f46e5;
}

.option-text {
  font-size: 1rem;
  color: #374151;
  user-select: none;
}

.option-label--uncertain .option-text {
  color: #d97706;
  font-style: italic;
}

/* Responsive design */
@media (max-width: 640px) {
  .task-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .sentence-container {
    gap: 0.15rem;
  }

  .options-container {
    margin-left: 0;
  }

  .text-segment {
    font-size: 1rem;
  }
}
</style>
