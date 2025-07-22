<template>
  <div class="task-card">
    <div class="task-card__header">
      <div class="task-card__title">
        {{ `${props.data.level}: ${props.data.question}` }}
      </div>
      <div class="task-card__actions">
        <button
          v-if="editButton"
          class="task-card__button"
          aria-label="Edytuj zadanie"
          @click="editTask"
        >
          <img class="task-card__icon" src="../assets/icons/editing.png" alt="edit icon" />
        </button>
        <button
          v-if="deleteButton"
          class="task-card__button"
          aria-label="Usuń zadanie"
          @click="emitDelete"
        >
          <img class="task-card__icon" src="../assets/icons/delete.png" alt="delete icon" />
        </button>
      </div>
    </div>

    <div class="task-card__info-grid">
      <div class="info-item">
        <span class="label">Kategoria główna:</span>
        <span class="value">{{ props.data.main_category }}</span>
      </div>
      <div class="info-item" v-if="props.data.sub_category">
        <span class="label">Podkategoria:</span>
        <span class="value">{{ props.data.sub_category }}</span>
      </div>
      <div class="info-item">
        <span class="label">Typ zadania:</span>
        <span class="value">{{ props.data.task_type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  editButton: {
    type: Boolean,
    default: false,
  },
  deleteButton: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete', 'edit'])

const emitDelete = () => {
  emit('delete', props.data.id)
}

const editTask = () => {
  router.push({
    name: 'create-task',
    query: {
      id: props.data.id,
      main_category: props.data.main_category,
      sub_category: props.data.sub_category,
      task_type: props.data.task_type,
      level: props.data.level,
      question: props.data.question,
    },
  })
}
</script>
