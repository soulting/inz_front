<template>
  <div class="task-select">
    <div v-for="(taskItem, index) in task" :key="index" class="task-select__task-block">
      <h2 class="task-select__header">Podpunkt {{ index + 1 }}</h2>

      <label class="task-select__label">Treść podpunktu</label>
      <input
        v-model="taskItem.template"
        type="text"
        placeholder="Wpisz pytanie z %%[sel]%% jako miejscem wyboru"
        class="task-select__input"
      />

      <label class="task-select__label">Informacje dodatkowe</label>
      <input
        v-model="taskItem.bonus_information"
        type="text"
        placeholder="np. rodzajnik określony"
        class="task-select__input"
      />

      <label class="task-select__label">Opcje do wyboru</label>
      <div class="task-select__options">
        <div
          v-for="(option, optIndex) in taskItem.options"
          :key="optIndex"
          class="task-select__option-item"
        >
          <label class="task-select__option-label">
            <input
              type="radio"
              :name="'correct-' + index"
              :value="optIndex"
              v-model="taskItem.correct_index"
            />
            {{ optionLabels[optIndex] }}
          </label>
          <input
            v-model="taskItem.options[optIndex]"
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
  task_items: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['taskCreated'])

const optionLabels = ['A', 'B', 'C']

const task = reactive([
  {
    id: null,
    template: '',
    options: ['', '', ''],
    correct_index: 0,
    bonus_information: null,
    correct_answer: '',
  },
])

function validateTasks() {
  for (let i = 0; i < task.length; i++) {
    const t = task[i]

    if (!t.template.trim()) {
      alert(`Proszę wpisać treść pytania w podpunkcie ${i + 1}`)
      return false
    }

    for (let j = 0; j < t.options.length; j++) {
      if (!t.options[j].trim()) {
        alert(`Proszę uzupełnić opcję ${optionLabels[j]} w podpunkcie ${i + 1}`)
        return false
      }
    }
  }
  return true
}

function submitTasks() {
  if (validateTasks()) {
    task.forEach((t) => {
      t.correct_answer = t.template.replace('%%[sel]%%', t.options[t.correct_index])
    })
    emit('taskCreated', task)
  }
}

function addTask() {
  task.push({
    id: null,
    template: '',
    options: ['', '', ''],
    correct_index: 0,
    correct_answer: '',
    bonus_information: null,
  })
}

watch(
  () => props.task_items,
  (newItems) => {
    task.length = 0
    newItems.forEach((task_item) => {
      task.push({
        id: task_item.id ?? null,
        template: task_item.template || '',
        options: task_item.options || ['', '', ''],
        correct_index: task_item.correct_index || 0,
        correct_answer: task_item.correct_answer || '',
        bonus_information: task_item.bonus_information || null,
      })
    })
  },
  { immediate: true },
)
</script>
