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
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['currentTask'])
const emit = defineEmits(['submit', 'noAnswers'])

const userInputs = ref([])
const currentAnswers = ref([])

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

defineExpose({
  submitAnswers,
})
</script>
