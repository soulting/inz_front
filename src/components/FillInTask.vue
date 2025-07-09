<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps(['currentTask'])

// Emit
const emit = defineEmits(['submit', 'noAnswers'])
// Reactive state for user inputs
const userInputs = ref([])

// Watch for changes in subtasks and initialize input fields
watch(
  () => props.currentTask.subtasks,
  (newSubtasks) => {
    userInputs.value = newSubtasks.map((subtask) =>
      subtask.question
        .replace(/^%%/, '')
        .split('%%')
        .map((segment) => (segment === '[inp]' ? '' : segment)),
    )
  },
  { immediate: true },
)

// Function exposed to parent – gathers answers and emits them
function submitAnswers() {
  if (userInputs.value.some((row) => row.includes(''))) {
    emit('noAnswers')
    return
  }
  const answers = userInputs.value.map((row) => row.join(''))

  emit('submit', answers)
  console.log('Answers submitted from FillInTask.')
}

defineExpose({
  submitAnswers,
})
</script>

<template>
  <ol v-if="currentTask.subtasks">
    <li v-for="(subtask, rowIndex) in currentTask.subtasks" :key="subtask.id" class="task-item">
      <span>
        <template
          v-for="(segment, segmentIndex) in subtask.question.replace(/^%%/, '').split('%%')"
          :key="segmentIndex"
        >
          <span v-if="segment === '[inp]'">
            <input
              v-model="userInputs[rowIndex][segmentIndex]"
              class="task-item-input fill-in"
              type="text"
            />
          </span>
          <span v-else>{{ segment }}</span>
        </template>
        <span>{{ subtask.hint }}</span>
      </span>
    </li>
  </ol>
</template>

<style scoped>
.fill-in {
  width: 100px;
}
</style>
