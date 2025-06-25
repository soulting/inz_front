<template>
  <div class="class-card">
    <div
      class="class-card__background"
      :style="{ backgroundImage: `url(${props.classData.image_url})` }"
    >
      <div class="class-card__actions">
        <button
          class="class-card__button class-card__button--delete"
          aria-label="Usuń klasę"
          @click="emitDelete"
        >
          <img class="class-card__icon" src="../assets/icons/delete.png" alt="edit icon" />
        </button>
      </div>
    </div>
    <div class="class-card__info">
      <h3 class="class-card__title">{{ props.classData.name }}</h3>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
const props = defineProps({
  classData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete'])

const emitDelete = () => {
  emit('delete', props.classData.id)
}
</script>
