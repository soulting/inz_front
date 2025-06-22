<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['currentTask'])
const emit = defineEmits(['submit', 'noAnswers'])

const userInputs = ref([])
const currentAnwsers = ref([])

function submitAnswers() {
  if (userInputs.value.some((input) => input === '')) {
    emit('noAnswers')
    return
  }

  const answers = currentAnwsers.value.map((row, index) =>
    row.replace('%%[sel]%%', userInputs.value[index]),
  )
  emit('submit', answers)
  console.log('Answers submitted from FillInTask.')
}

watch(
  () => props.currentTask.subtasks,
  (newSubtasks) => {
    currentAnwsers.value = newSubtasks.map((subtask) => subtask.question)
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
    <li v-for="(sub, index1) in currentTask.subtasks" :key="sub.id" class="task-item">
      <div class="sellection-container">
        <span>
          <template v-for="(word, index2) in sub.question.split('%%')" :key="index2">
            <span v-if="word === '[sel]'">
              <input class="task-item-input select" type="text" />
            </span>
            <span v-else>{{ word }}</span>
          </template>
          <form>
            <label
              ><input
                v-model="userInputs[index1]"
                type="radio"
                name="question1"
                :value="sub.options[0]"
              />
              a) {{ sub.options[0] }}</label
            >
            <br />
            <label>
              <input
                v-model="userInputs[index1]"
                type="radio"
                name="question1"
                :value="sub.options[1]"
              />
              b) {{ sub.options[1] }}</label
            ><br />
            <label
              ><input
                v-model="userInputs[index1]"
                type="radio"
                name="question1"
                :value="sub.options[2]"
              />
              c) {{ sub.options[2] }}</label
            >
            <br />
            <label
              ><input v-model="userInputs[index1]" type="radio" name="question1" value="???" /> d)
              Nie wiem</label
            >
          </form>
        </span>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.select {
  width: 40px;
  pointer-events: none;
}
</style>
