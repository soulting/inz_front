<template>
  <div class="task-card">
    <div class="task-card__header">
      <div class="task-card__title">
        {{ props.taskData.question }}
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
        <span class="label">Poziom:</span>
        <span class="value">{{ props.taskData.level }}</span>
      </div>
      <div class="info-item">
        <span class="label">Kategoria główna:</span>
        <span class="value">{{ props.taskData.main_category }}</span>
      </div>
      <div class="info-item" v-if="props.taskData.sub_category">
        <span class="label">Podkategoria:</span>
        <span class="value">{{ props.taskData.sub_category }}</span>
      </div>
      <div class="info-item">
        <span class="label">Typ zadania:</span>
        <span class="value">{{ props.taskData.task_type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  taskData: {
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
  emit('delete', props.taskData.id)
}

const editTask = () => {
  router.push({
    name: 'create-task',
    query: {
      id: props.taskData.id,
      main_category: props.taskData.main_category,
      sub_category: props.taskData.sub_category,
      task_type: props.taskData.task_type,
      level: props.taskData.level,
      question: props.taskData.question,
    },
  })
}
</script>
