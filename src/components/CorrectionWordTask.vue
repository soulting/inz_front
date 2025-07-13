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

<template>
  <ol v-if="currentTask.task_items">
    <li v-for="(task_item, index) in currentTask.task_items" :key="task_item.id" class="task-item">
      <div class="correction-word-container">
        <span>{{ task_item.template }} {{ task_item.bonus_information }}: </span>
        <input type="text" class="task-item-input correction" v-model="userInputs[index]" />
      </div>
    </li>
  </ol>
</template>

<style scoped>
.correction-word-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}
</style>
