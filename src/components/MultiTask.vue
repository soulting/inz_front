<template>
  <div class="correction-task">
    <div v-for="(task, index) in task" :key="index" class="correction-task__block">
      <h2 class="correction-task__header">Podpunkt {{ index + 1 }}</h2>

      <div v-if="props.type === TASK_TYPES.CORRECTION_WORD" class="correction-task__word-block">
        <div class="correction-task__word-block-inner">
          <label class="correction-task__label" :for="'original-' + index"
            >Słowo przed przekształceniem</label
          >
          <input
            v-model="task.template"
            :id="'original-' + index"
            placeholder="der Apfel"
            class="correction-task__textarea"
            rows="2"
          />
        </div>

        <div>
          <label class="correction-task__label" :for="'hint-' + index">Podpowiedź </label>
          <input
            v-model="task.bonus_information"
            :id="'hint-' + index"
            placeholder="Plural"
            class="correction-task__textarea correction-task__textarea--hint"
          />
        </div>

        <img
          class="correction-task__arrow"
          src="../assets/right-arrow.png"
          alt="strzałka w prawo"
        />

        <div class="correction-task__word-block-inner">
          <label class="correction-task__label" :for="'corrected-' + index"
            >Przekształcone słowo</label
          >
          <input
            v-model="task.correct_answer"
            :id="'corrected-' + index"
            placeholder="die Äpfel"
            class="correction-task__textarea"
            rows="2"
          />
        </div>
      </div>
      <div v-else-if="props.type === 'correction'">
        <label class="correction-task__label" :for="'original-' + index"
          >Zdanie do przekształcenia</label
        >
        <textarea
          v-model="task.template"
          :id="'original-' + index"
          placeholder="Ich esse einen Apfel."
          class="correction-task__textarea"
          rows="2"
        />

        <div>
          <label class="correction-task__label" :for="'hint-' + index">Podpowiedź </label>
          <input
            v-model="task.bonus_information"
            :id="'hint-' + index"
            placeholder="Perfekt"
            class="correction-task__textarea correction-task__textarea--hint"
          />
        </div>

        <label class="correction-task__label" :for="'corrected-' + index">Poprawione zdanie</label>
        <textarea
          v-model="task.correct_answer"
          :id="'corrected-' + index"
          placeholder="Ich habe einen Apfel gegessen."
          class="correction-task__textarea"
          rows="2"
        />
      </div>
      <div v-else-if="props.type === TASK_TYPES.FILL_IN">
        <label class="correction-task__label" :for="'original-' + index"
          >Zdanie do przekształcenia</label
        >
        <textarea
          v-model="task.template"
          :id="'original-' + index"
          placeholder="Ich esse %%[inp]%%."
          class="correction-task__textarea"
          rows="2"
        />

        <div>
          <label class="correction-task__label" :for="'hint-' + index">Podpowiedź </label>
          <input
            v-model="task.bonus_information"
            :id="'hint-' + index"
            placeholder="ein"
            class="correction-task__textarea correction-task__textarea--hint"
          />
        </div>

        <label class="correction-task__label" :for="'corrected-' + index">Poprawione zdanie</label>
        <textarea
          v-model="task.correct_answer"
          :id="'corrected-' + index"
          placeholder="Ich esse einen Apfel."
          class="correction-task__textarea"
          rows="2"
        />
      </div>
    </div>

    <div class="correction-task__buttons-row">
      <button class="correction-task__submit-button" @click="submitTask">Zakończ</button>
      <button class="correction-task__add-button" @click="addTask">+ Dodaj kolejny podpunkt</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

import { TASK_TYPES } from '@/enums'

const emit = defineEmits(['taskCreated'])

const props = defineProps({
  type: {
    type: String,
    default: TASK_TYPES.CORRECTION,
  },
  task_items: {
    type: Array,
    default: () => [],
  },
})

const task = reactive([
  {
    id: null,
    template: '',
    bonus_information: null,
    correct_answer: '',
  },
])

watch(
  () => props.task_items,
  (new_task_items) => {
    if (new_task_items && new_task_items.length > 0) {
      task.splice(
        0,
        task.length,
        ...new_task_items.map((task_item) => ({
          id: task_item.id ?? null,
          template: task_item.template || '',
          correct_answer: task_item.correct_answer || '',
          bonus_information: task_item.bonus_information || '',
        })),
      )
    }
  },
  { immediate: true },
)

function validateTask() {
  for (let i = 0; i < task.length; i++) {
    const t = task[i]

    if (!t.correct_answer || !t.correct_answer.trim()) {
      alert(`Proszę wpisać poprawioną wersję zdania w podpunkcie ${i + 1}`)
      return false
    }
  }
  return true
}

function submitTask() {
  if (validateTask()) {
    emit('taskCreated', task)
  }
}

function addTask() {
  task.push({
    id: null,
    template: '',
    bonus_information: null,
    correct_answer: '',
  })
}
</script>
