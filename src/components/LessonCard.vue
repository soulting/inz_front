<template>
  <div class="lesson-card">
    <div class="lesson-card__title">
      {{ `${props.lessonData.level}: ${props.lessonData.title}` }}
    </div>

    <div class="lesson-card__info-grid">
      <div class="info-item">
        <span class="label">Kategoria:</span>
        <span class="value">{{ props.lessonData.main_category }}</span>
      </div>
      <div class="info-item" v-if="props.lessonData.sub_category">
        <span class="label">Podkategoria:</span>
        <span class="value">{{ props.lessonData.sub_category }}</span>
      </div>
    </div>

    <!-- OVERLAY -->
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
        {{ props.lessonData.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  lessonData: {
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
  const url = `${window.location.origin}/preview?id=${props.lessonData.id}`
  window.open(url, '_blank')
}

const emitDelete = () => {
  emit('delete', props.lessonData.id)
}

const editLesson = () => {
  router.push({
    name: 'create-lesson',
    query: {
      id: props.lessonData.id,
      main_category: props.lessonData.main_category,
      sub_category: props.lessonData.sub_category,
      level: props.lessonData.level,
      title: props.lessonData.title,
      description: props.lessonData.description,
      context: props.lessonData.context,
    },
  })
}
</script>

<style scoped>
.lesson-card {
  position: relative;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  color: #333;
  cursor: pointer;
  transition: transform 0.2s;
  margin: 0;
}
.lesson-card__title {
  font-size: 20px;
  font-weight: bold;
}

.lesson-card:hover {
  transform: scale(1.02);
}

.lesson-card__overlay {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: start;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 16px;
}

.lesson-card:hover .lesson-card__overlay {
  opacity: 1;
}

/* PRZYCISKI W PRAWYM GÓRNYM ROGU */
.lesson-card__overlay-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
}

.lesson-card__overlay-actions button {
  background: none;
  border: none;
  cursor: pointer;
}

.lesson-card__overlay-actions img {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1); /* białe na ciemnym tle */
}

.lesson-card__description {
  display: flex;
  align-items: start;
  justify-content: start;
  width: calc(100% - 130px);
  font-size: 14px;
  word-break: break-word;
  height: 100%;
}
.label {
  font-weight: bold;
}
</style>
