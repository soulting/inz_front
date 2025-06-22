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
  () => props.currentTask.subtasks,
  (newSubtasks) => {
    userInputs.value = newSubtasks.map(() => '')
  },
  { immediate: true },
)

defineExpose({
  submitAnswers,
})
</script>

<template>
  <ol v-if="currentTask.subtasks">
    <li v-for="(sub, index) in currentTask.subtasks" :key="sub.id" class="task-item">
      <div class="correction-container">
        <span>{{ sub.question }} </span>
        <input type="text" class="task-item-input correction" v-model="userInput[index]" />
      </div>
    </li>
  </ol>
</template>

<style scoped>
.correction-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.correction {
  width: 300px;
}
</style>
