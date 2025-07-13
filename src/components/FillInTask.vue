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
  <ol v-if="currentTask.task_items">
    <li
      v-for="(task_item, rowIndex) in currentTask.task_items"
      :key="task_item.id"
      class="task-item"
    >
      <span>
        <template
          v-for="(segment, segmentIndex) in task_item.template.replace(/^%%/, '').split('%%')"
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
        <span> {{ task_item.bonus_information }}</span>
      </span>
    </li>
  </ol>
</template>

<style scoped>
.fill-in {
  width: 100px;
}
</style>
