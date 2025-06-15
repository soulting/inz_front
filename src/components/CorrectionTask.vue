<script setup>
import { ref } from 'vue'
defineProps(['currentTask'])

function sayHello() {
  console.log('Correction')
}

defineExpose({
  sayHello,
})
</script>

<template>
  <ol v-if="currentTask.subtasks">
    <li v-for="sub in currentTask.subtasks" :key="sub.id" class="task-item">
      <div class="correction-container">
        <span>{{ sub.question }} </span>
        <input type="text" class="task-item-input correction" />
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
