<template>
  <div v-if="currentTask.task_items" class="fill-in-task">
    <div
      v-for="(task_item, rowIndex) in currentTask.task_items"
      :key="task_item.id"
      class="task-item"
    >
      <div class="task-content">
        <span class="task-number">{{ rowIndex + 1 }}.</span>
        <div class="sentence-container">
          <template
            v-for="(segment, segmentIndex) in task_item.template.replace(/^%%/, '').split('%%')"
            :key="segmentIndex"
          >
            <template v-if="segment === '[inp]'">
              <input
                v-model="userInputs[rowIndex][segmentIndex]"
                class="task-input"
                type="text"
                placeholder=""
              />
              <span v-if="task_item.bonus_information" class="task-hint">
                ({{
                  getHintForInput(
                    task_item.bonus_information,
                    getInputCount(task_item.template, segmentIndex),
                  )
                }})
              </span>
            </template>
            <span v-else class="text-segment">{{ segment }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps(['currentTask'])

// Emit
const emit = defineEmits(['submit', 'noAnswers'])

// Reactive state for user inputs
const userInputs = ref([])

// Watch for changes in task_items and initialize input fields
watch(
  () => props.currentTask.task_items,
  (newTaskItems) => {
    userInputs.value = newTaskItems.map((task_item) =>
      task_item.template
        .replace(/^%%/, '')
        .split('%%')
        .map((segment) => (segment === '[inp]' ? '' : segment)),
    )
  },
  { immediate: true },
)

// Helper functions for hints
function getInputCount(template, currentIndex) {
  const segments = template.replace(/^%%/, '').split('%%')
  let count = 0
  for (let i = 0; i <= currentIndex; i++) {
    if (segments[i] === '[inp]') {
      count++
    }
  }
  return count - 1 // Return 0-based index
}

function getHintForInput(bonusInfo, inputIndex) {
  if (!bonusInfo) return ''
  const hints = bonusInfo.split(',').map((h) => h.trim())
  return hints[inputIndex] || ''
}

// Function exposed to parent – gathers answers and emits them
function submitAnswers() {
  if (userInputs.value.some((row) => row.includes(''))) {
    emit('noAnswers')
    return
  }
  const answers = userInputs.value.map((row) => row.join(''))
  emit('submit', answers)
}

defineExpose({
  submitAnswers,
})
</script>

<style scoped>
.task-body {
  margin: 0;
}
.fill-in-task {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-content {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
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
  white-space: nowrap;
}

.task-input {
  padding: 0.2rem 0.4rem;
  font-size: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  min-width: 60px;
  width: auto;
  text-align: center;
  transition: border-color 0.2s ease;
  background: #f9fafb;
  margin: 0 2px;
}

.task-input:focus {
  outline: none;
  border-color: #4f46e5;
  background: #ffffff;
}

.task-input::placeholder {
  color: #9ca3af;
}

.task-hint {
  color: #6b7280;
  font-size: 0.85rem;
  margin-left: 0.25rem;
  font-style: italic;
}

/* Responsive design */
@media (max-width: 640px) {
  .task-content {
    flex-direction: column;
    gap: 0.5rem;
  }

  .sentence-container {
    gap: 0.15rem;
  }

  .task-input {
    min-width: 60px;
    max-width: 100px;
  }

  .text-segment {
    font-size: 1rem;
  }
}
</style>
