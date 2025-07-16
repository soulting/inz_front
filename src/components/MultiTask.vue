<template>
  <div class="correction-task">
    <div v-for="(task, index) in task" :key="index" class="correction-task__block">
      <h2 class="correction-task__header">Podpunkt {{ index + 1 }}</h2>

      <div v-if="props.type === 'correction_word'" class="correction-task__word-block">
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
        <!-- Dodatkowe pole podpowiedzi -->
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
      <div v-else-if="props.type === 'fill_in'">
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
      <button class="correction-task__add-button" @click="addTask">+ Dodaj kolejne zdanie</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const emit = defineEmits(['taskCreated'])

const props = defineProps({
  type: {
    type: String,
    default: 'correction',
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

<style scoped lang="scss">
.correction-task {
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);

  &__block {
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

  &__textarea {
    width: 100%;
    padding: 10px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 16px;
    resize: vertical;
    &--hint {
      min-width: 140px;
    }
  }

  &__word-block {
    display: flex;
    gap: 16px;
  }

  &__word-block-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__arrow {
    width: 24px;
    height: 24px;
    align-self: flex-end;
    margin: 26px 5px;
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
