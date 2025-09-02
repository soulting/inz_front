<template>
  <div v-if="currentTask.task_items" class="correction-word-task">
    <div v-for="(task_item, index) in currentTask.task_items" :key="task_item.id" class="task-item">
      <div class="task-content">
        <span class="task-number">{{ index + 1 }}.</span>
        <span class="word-text">{{ task_item.template }}</span>
        <span v-if="task_item.bonus_information" class="task-info">
          <strong>({{ task_item.bonus_information }})</strong>
        </span>
        <span class="arrow">→</span>
        <input
          type="text"
          class="task-input"
          v-model="userInputs[index]"
          placeholder="Przekształcone słowo..."
        />
      </div>
      <div v-if="answerFor(task_item.id)" class="task-content-result">
        <div class="answer-box neutral">
          <strong>Poprawna odpowiedź:</strong>
          <p>{{ answerFor(task_item.id).correct_answer }}</p>
        </div>

        <div
          class="answer-box"
          :class="{
            correct: answerFor(task_item.id).point === 1,
            wrong: answerFor(task_item.id).point === 0,
          }"
        >
          <strong>Twoja odpowiedź:</strong>
          <p
            v-html="
              diffWords(answerFor(task_item.id).correct_answer, answerFor(task_item.id).my_answer)
            "
          ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import diffWords from '@/composables/diffChecker'

import { ref, watch } from 'vue'

const props = defineProps({
  currentTask: {
    type: Object,
    required: true,
  },
  anwsers: {
    type: Array,
    default: () => [],
  },
})
const userInputs = ref([])
const emit = defineEmits(['submit', 'noAnswers'])

function answerFor(id) {
  return props.anwsers.find((el) => el.item_id === id)
}

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
