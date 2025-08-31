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
