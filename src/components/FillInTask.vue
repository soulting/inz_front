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
