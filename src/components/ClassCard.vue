<template>
  <div class="class-card" @click="goToClass">
    <div class="class-card__background" :style="{ backgroundImage: `url(${classData.image_url})` }">
      <div class="class-card__actions">
        <button
          v-if="joinButton"
          class="class-card__button"
          aria-label="Dołącz do klasy"
          @click="openJoinForm"
        >
          <img class="class-card__icon" src="../assets/icons/join-group.png" alt="dołącz ikonka" />
        </button>
        <button
          v-if="deleteButton"
          class="class-card__button"
          aria-label="Usuń klasę"
          @click="emitDelete"
        >
          <img class="class-card__icon" src="../assets/icons/delete.png" alt="usuń ikonka" />
        </button>
      </div>
    </div>

    <div class="class-card__info">
      <h3 class="class-card__title">{{ classData.name }}</h3>
    </div>

    <div
      v-if="showJoinForm"
      class="class-card__join-form"
      :style="{ backgroundImage: `url(${classData.image_url})` }"
    >
      <h3 class="class-card__join-title">{{ classData.name }}</h3>
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
import { showSwal } from '@/composables/swal'
import { useRouter } from 'vue-router'

import { ref } from 'vue'

const props = defineProps({
  classData: { type: Object, required: true },
  joinButton: { type: Boolean, default: false },
  deleteButton: { type: Boolean, default: false },
})

const emit = defineEmits(['delete', 'join'])

const router = useRouter()

const showJoinForm = ref(false)
const joinPassword = ref('')

function emitDelete(event) {
  event.stopPropagation()
  emit('delete', props.classData.id)
}

function emitJoin() {
  if (!joinPassword.value.trim()) {
    showSwal({
      title: 'Brak hasła',
      text: 'Proszę podać hasło do klasy.',
      status: 'error',
    })
    return
  }

  emit('join', props.classData.id, joinPassword.value)
  resetJoinForm()
}

function openJoinForm() {
  showJoinForm.value = true
}

function cancelJoin() {
  resetJoinForm()
}

function resetJoinForm() {
  showJoinForm.value = false
  joinPassword.value = ''
}

function goToClass() {
  router.push({
    name: 'class-teacher',
    params: { id: props.classData.id, name: props.classData.name },
  })
}
</script>
