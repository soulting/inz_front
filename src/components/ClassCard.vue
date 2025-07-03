<template>
  <div class="class-card">
    <div
      class="class-card__background"
      :style="{ backgroundImage: `url(${props.classData.image_url})` }"
    >
      <div class="class-card__actions">
        <button
          v-if="joinButton"
          class="class-card__button"
          aria-label="Dołącz do klasy"
          @click="openJoinForm"
        >
          <img class="class-card__icon" src="../assets/icons/join-group.png" alt="edit icon" />
        </button>
        <button
          v-if="deleteButton"
          class="class-card__button"
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
    <div
      v-if="showJoinForm"
      class="class-card__join-form"
      :style="{ backgroundImage: `url(${props.classData.image_url})` }"
    >
      <h3 class="class-card__join-title">{{ props.classData.name }}</h3>
      <input
        v-model="joinPassword"
        type="password"
        placeholder="Hasło do klasy"
        class="class-card__input"
      />
      <div class="class-card__form-buttons">
        <button class="class-card__button class-card__button--confirm" @click="emitJoin">
          Dołącz
        </button>
        <button class="class-card__button class-card__button--cancel" @click="cancelJoin">
          Anuluj
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  classData: {
    type: Object,
    required: true,
  },
  joinButton: {
    type: Boolean,
    default: false,
  },
  deleteButton: {
    type: Boolean,
    default: false,
  },
})

const showJoinForm = ref(false)
const joinPassword = ref('')

const emit = defineEmits(['delete', 'join'])

const emitDelete = () => {
  emit('delete', props.classData.id)
}

const emitJoin = () => {
  if (!joinPassword.value.trim()) {
    alert('Hasło nie może być puste')
    return
  }
  emit('join', props.classData.id, joinPassword.value)
  showJoinForm.value = false
  joinPassword.value = ''
}

const openJoinForm = () => {
  showJoinForm.value = true
}

const cancelJoin = () => {
  showJoinForm.value = false
  joinPassword.value = ''
}
</script>
