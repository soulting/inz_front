<template>
  <div class="section-add">
    <div v-if="!isAdding" class="section-add__card" @click="startAdding">
      <div class="section-add__plus">+</div>
      <div class="section-add__text">Dodaj sekcję</div>
    </div>

    <form v-else class="section-add__form" @submit.prevent="createSection">
      <input
        v-model="sectionTitle"
        type="text"
        placeholder="Tytuł sekcji"
        class="section-add__input"
        required
        autofocus
      />

      <Editor
        v-model="sectionContent"
        api-key="k0efnljtvefg89se78os1oopj0hhvfyohqfko19nnrqo5x7j"
        :init="editorInit"
        class="section-add__editor"
      />

      <div class="section-add__buttons">
        <button type="submit" class="section-add__button">Dodaj</button>
        <button
          type="button"
          class="section-add__button section-add__button--cancel"
          @click="cancelAdding"
        >
          Anuluj
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { handleApiError } from '@/composables/errorHandling'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import Editor from '@tinymce/tinymce-vue'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

import { ref } from 'vue'

import { URL } from '@/enums'

const props = defineProps({
  classId: {
    type: [String, Number],
    required: true,
  },
})

const router = useRouter()
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const { token } = storeToRefs(authStore)

const isAdding = ref(false)
const sectionTitle = ref('')
const sectionContent = ref('')

const editorInit = {
  height: 300,
  menubar: false,
  plugins:
    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount hr fullscreen code preview paste help fontsize',
  toolbar:
    'formatselect blocks fontfamily fontsize | bold italic underline strikethrough fontsizeselect | link image media table hr | align lineheight | numlist bullist indent outdent | emoticons charmap ',
  branding: false,
  statusbar: false,
}

function startAdding() {
  isAdding.value = true
}

function cancelAdding() {
  isAdding.value = false
  sectionTitle.value = ''
  sectionContent.value = ''
}

async function createSection() {
  if (!sectionTitle.value.trim() || !sectionContent.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Uzupełnij wszystkie pola',
      text: 'Tytuł i treść sekcji są wymagane.',
      confirmButtonColor: '#4f46e5',
    })
    return
  }
  try {
    loadingStore.startLoading()

    const response = await axios.post(
      `${URL.SECTIONS}/create_section`,
      {
        title: sectionTitle.value,
        content: sectionContent.value,
        class_id: props.classId,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    )

    console.log('Sekcja utworzona', response.data)

    // Reset i wyjście z trybu dodawania
    cancelAdding()
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
}
</script>
