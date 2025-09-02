<template>
  <div v-if="currentTask.task_items" class="selection-task">
    <div
      v-for="(task_item, index1) in currentTask.task_items"
      :key="task_item.id"
      class="task-item"
    >
      <div class="task-content">
        <div class="task-header">
          <span class="task-number">{{ index1 + 1 }}.</span>
          <div class="sentence-container">
            <template v-for="(word, index2) in task_item.template.split('%%')" :key="index2">
              <span v-if="word === '[sel]'" class="selection-placeholder"> ___ </span>
              <span v-else class="text-segment">{{ word }}</span>
            </template>
            <span v-if="task_item.bonus_information" class="task-info">
              <strong>({{ task_item.bonus_information }})</strong>
            </span>
          </div>
        </div>

        <div class="options-container">
          <label class="option-label">
            <input
              v-model="userInputs[index1]"
              type="radio"
              :name="`question-${index1}`"
              :value="task_item.options[0]"
              class="option-input"
            />
            <span class="option-text">a) {{ task_item.options[0] }}</span>
          </label>

          <label class="option-label">
            <input
              v-model="userInputs[index1]"
              type="radio"
              :name="`question-${index1}`"
              :value="task_item.options[1]"
              class="option-input"
            />
            <span class="option-text">b) {{ task_item.options[1] }}</span>
          </label>

          <label class="option-label">
            <input
              v-model="userInputs[index1]"
              type="radio"
              :name="`question-${index1}`"
              :value="task_item.options[2]"
              class="option-input"
            />
            <span class="option-text">c) {{ task_item.options[2] }}</span>
          </label>

          <label class="option-label option-label--uncertain">
            <input
              v-model="userInputs[index1]"
              type="radio"
              :name="`question-${index1}`"
              value="???"
              class="option-input"
            />
            <span class="option-text">d) Nie wiem</span>
          </label>
        </div>
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

import { onBeforeMount, ref, watch } from 'vue'

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

const emit = defineEmits(['submit', 'noAnswers'])

const userInputs = ref([])
const currentAnswers = ref([])

function answerFor(id) {
  return props.anwsers.find((el) => el.item_id === id)
}

function submitAnswers() {
  if (userInputs.value.some((input) => input === '')) {
    emit('noAnswers')
    return
  }

  const answers = currentAnswers.value.map((row, index) =>
    row.replace('%%[sel]%%', userInputs.value[index]),
  )

  emit('submit', answers)
  console.log('Answers submitted from SelectionTask.')
}

watch(
  () => props.currentTask.task_items,
  (newTaskItems) => {
    currentAnswers.value = newTaskItems.map((task_item) => task_item.template)
    userInputs.value = newTaskItems.map(() => '')
  },
  { immediate: true },
)

onBeforeMount(() => {
  console.log('dupa')
})

defineExpose({
  submitAnswers,
})
</script>
