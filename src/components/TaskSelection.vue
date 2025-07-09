<template>
  <div class="task-select">
    <div v-for="(task, index) in tasks" :key="index" class="task-select__task-block">
      <h2 class="task-select__header">Podpunkt {{ index + 1 }}</h2>

      <label class="task-select__label">Treść podpunktu</label>
      <input
        v-model="task.originalSentence"
        type="text"
        placeholder="Wpisz pytanie z %%[sel]%% jako miejscem wyboru"
        class="task-select__input"
      />

      <label class="task-select__label">Podpowiedź</label>
      <input
        v-model="task.hint"
        type="text"
        placeholder="np. rodzajnik określony"
        class="task-select__input"
      />

      <label class="task-select__label">Opcje do wyboru</label>
      <div class="task-select__options">
        <div
          v-for="(option, optIndex) in task.options"
          :key="optIndex"
          class="task-select__option-item"
        >
          <label class="task-select__option-label">
            <input
              type="radio"
              :name="'correct-' + index"
              :value="optIndex"
              v-model="task.correctIndex"
            />
            {{ optionLabels[optIndex] }}
          </label>
          <input
            v-model="task.options[optIndex]"
            type="text"
            class="task-select__input task-select__input--option"
            :placeholder="`Opcja ${optionLabels[optIndex]}`"
          />
        </div>
      </div>
    </div>

    <div class="task-select__buttons-row">
      <button class="task-select__submit-button" @click="submitTasks">Zakończ</button>
      <button class="task-select__add-button" @click="addTask">+ Dodaj kolejne pytanie</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  subpoints: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['taskCreated'])

const optionLabels = ['A', 'B', 'C']

const tasks = reactive([
  {
    originalSentence: '',
    options: ['', '', ''],
    correctIndex: 0,
    hint: '',
  },
])

function validateTasks() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]

    if (!task.originalSentence.trim()) {
      alert(`Proszę wpisać treść pytania w podpunkcie ${i + 1}`)
      return false
    }

    for (let j = 0; j < task.options.length; j++) {
      if (!task.options[j].trim()) {
        alert(`Proszę uzupełnić opcję ${optionLabels[j]} w podpunkcie ${i + 1}`)
        return false
      }
    }
  }
  return true
}

function submitTasks() {
  if (validateTasks()) {
    tasks.forEach((task) => {
      task.correctedSentence = task.originalSentence.replace(
        '%%[sel]%%',
        task.options[task.correctIndex],
      )
    })
    emit('taskCreated', tasks)
  }
}

function addTask() {
  tasks.push({
    originalSentence: '',
    options: ['', '', ''],
    correctIndex: 0,
    correctedSentence: '',
    hint: '',
  })
}

watch(
  () => props.subpoints,
  (newSubpoints) => {
    tasks.length = 0
    newSubpoints.forEach((sp) => {
      tasks.push({
        originalSentence: sp.question || '',
        options: sp.options || ['', '', ''],
        correctIndex: sp.correct_index || 0,
        correctedSentence: sp.correctedSentence || '',
        hint: sp.hint || '',
      })
    })
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.task-select {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);

  &__task-block {
    margin-bottom: 40px;
    border-bottom: 1px solid #eee;
    padding-bottom: 32px;
  }

  &__header {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
  }

  &__label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #444;
  }

  &__input {
    width: 100%;
    padding: 10px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 16px;

    &--option {
      max-width: 220px;
    }
  }

  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 12px;
  }

  &__option-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__option-label {
    font-weight: bold;
    color: #333;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__buttons-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__add-button {
    padding: 10px 18px;
    font-size: 15px;
    background-color: #eaf4ff;
    color: #1976d2;
    border: 1px solid #90caf9;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;

    &:hover {
      background-color: #d2ecff;
    }
  }

  &__submit-button {
    padding: 12px 22px;
    font-size: 16px;
    background-color: #3b4bdc;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 6px rgba(25, 118, 210, 0.4);

    &:hover {
      background-color: #2f3fc2;
    }
  }
}
</style>
