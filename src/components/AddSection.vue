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
const { jwtToken } = storeToRefs(authStore)

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
          Authorization: `Bearer ${jwtToken.value}`,
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

<style scoped lang="scss">
.section-add {
  margin: 25px;
}

.section-add__card {
  cursor: pointer;
  width: 80%;
  height: 100px;
  background: #f3f4f6;
  border: 2px dashed #4f46e5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  transition:
    background 0.3s,
    transform 0.2s;

  &:hover,
  &:focus {
    background: #eef2ff;
    transform: scale(1.05);
    outline: none;
  }
}

.section-add__plus {
  font-size: 32px;
  font-weight: bold;
  color: #4f46e5;
}

.section-add__text {
  margin-top: 0.3rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
}

.section-add__form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  padding: 25px;
  border: solid #aaa 0.5px;
  border-radius: 8px;
  box-shadow: 0 0px 101px 0 rgba(0, 0, 0, 0.05);
  background-color: white;
}

.section-add__input {
  padding: 12px;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.section-add__editor {
  border-radius: 8px;
}

.section-add__buttons {
  display: flex;
  gap: 16px;
}

.section-add__button {
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #4f46e5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s,
    box-shadow 0.2s;

  &:hover {
    background-color: #4338ca;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.4);
  }
}

.section-add__button--cancel {
  background-color: #ef4444;

  &:hover {
    background-color: #b91c1c;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }
}
</style>
