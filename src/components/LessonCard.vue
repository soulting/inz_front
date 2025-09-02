<template>
  <div class="lesson-card">
    <div class="lesson-card__title">
      {{ `${props.data.level}: ${props.data.title}` }}
    </div>

    <div class="lesson-card__info-grid">
      <div class="info-item">
        <span class="label">Kategoria:</span>
        <span class="value">{{ props.data.main_category }}</span>
      </div>
      <div class="info-item" v-if="props.data.sub_category">
        <span class="label">Podkategoria:</span>
        <span class="value">{{ props.data.sub_category }}</span>
      </div>
    </div>

    <div class="lesson-card__overlay">
      <div class="lesson-card__overlay-actions">
        <button v-if="previewButton" @click="previewLesson">
          <img src="../assets/icons/search.png" alt="preview icon" />
        </button>
        <button v-if="editButton" @click="editLesson">
          <img src="../assets/icons/editing.png" alt="edit icon" />
        </button>
        <button v-if="deleteButton" @click="emitDelete">
          <img src="../assets/icons/delete.png" alt="delete icon" />
        </button>
      </div>

      <p class="lesson-card__description">
        {{ props.data.description }}
      </p>
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
  previewButton: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete', 'edit'])

function previewLesson() {
  const url = `${window.location.origin}/preview?id=${props.data.id}`
  window.open(url, '_blank')
}

const emitDelete = () => {
  emit('delete', props.data.id)
}

const editLesson = () => {
  router.push({
    name: 'create-lesson',
    query: {
      id: props.data.id,
      main_category: props.data.main_category,
      sub_category: props.data.sub_category,
      level: props.data.level,
      title: props.data.title,
      description: props.data.description,
      context: props.data.context,
    },
  })
}
</script>
