<script setup>
import { ref } from 'vue'
defineProps(['currentTask'])

function sayHello() {
  console.log('CorrectionWord')
}

defineExpose({
  sayHello,
})
</script>

<template>
  <ol v-if="currentTask.subtasks">
    <li v-for="sub in currentTask.subtasks" :key="sub.id" class="task-item">
      <div class="correction-word-container">
        <span>{{ sub.question }} : </span>
        <input type="text" class="task-item-input correction" />
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
