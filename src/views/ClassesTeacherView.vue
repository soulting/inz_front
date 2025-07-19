<template>
  <div class="teacher-classes">
    <!-- KLASY -->
    <ClassGrid :classes="classes" :deleteButton="true" title="Moje klasy" @delete="deleteClass">
      <!-- Karta dodawania klasy -->
      <div class="teacher-classes__add-card" @click="createClass">
        <div class="teacher-classes__plus">+</div>
        <div class="teacher-classes__add-text">Dodaj klasę</div>
      </div>

      <!-- Formularz tworzenia klasy -->
      <div
        v-if="showCreateForm"
        class="teacher-classes__form-card"
        :style="{ backgroundImage: `url(${placeholderImage})` }"
      >
        <input
          v-model="newClassName"
          type="text"
          placeholder="Nazwa klasy"
          class="teacher-classes__input"
        />
        <input
          v-model="newClassPassword"
          type="password"
          placeholder="Hasło"
          class="teacher-classes__input"
        />
        <div class="teacher-classes__form-buttons">
          <button
            @click="submitNewClass"
            class="teacher-classes__button teacher-classes__button--submit"
          >
            Zapisz
          </button>
          <button
            @click="cancelCreateClass"
            class="teacher-classes__button teacher-classes__button--cancel"
          >
            Anuluj
          </button>
        </div>
      </div>
    </ClassGrid>

    <!-- ZADANIA -->
    <TaskList :tasks="tasks" :deleteButton="true" :editButton="true" @delete="deleteTask">
      <div class="list__add-card" @click="goToCreateTask">
        <div class="list__plus">+</div>
        <div class="list__add-text">Dodaj zadanie</div>
      </div>
    </TaskList>

    <LessonList
      :lessons="lessons"
      :deleteButton="true"
      :editButton="true"
      :previewButton="true"
      @delete="deleteLesson"
    >
      <div class="list__add-card" @click="goToCreateLesson">
        <div class="list__plus">+</div>
        <div class="list__add-text">Dodaj lekcję</div>
      </div>
    </LessonList>
  </div>
</template>

<script setup>
// === IMPORTY ===
import { handleApiError } from '@/composables/errorHandling'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

import ClassGrid from '@/components/ClassGrid.vue'
import LessonList from '@/components/LessonList.vue'
import TaskList from '@/components/TaskList.vue'

// === INSTANCJE ===
const router = useRouter()
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const { jwtToken } = storeToRefs(authStore)

// === STANY ===
const classes = ref([])
const tasks = ref([])
const lessons = ref([])

const showCreateForm = ref(false)
const newClassName = ref('')
const newClassPassword = ref('')
const placeholderImage = ref('')

// === FUNKCJE POMOCNICZE ===
const createClass = () => {
  placeholderImage.value = `https://xxofdfokqesjgcuvqsax.supabase.co/storage/v1/object/public/inzyniekrka-images/placeholder${Math.floor(Math.random() * 6) + 1}.webp`
  showCreateForm.value = true
}

const cancelCreateClass = () => {
  showCreateForm.value = false
  newClassName.value = ''
  newClassPassword.value = ''
}

function goToCreateTask() {
  router.push({ name: 'create-task' })
}

function goToCreateLesson() {
  router.push({ name: 'create-lesson' })
}

// === ŻĄDANIA DO API ===

const submitNewClass = async () => {
  if (!newClassName.value.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Błąd',
      text: 'Nazwa klasy nie może być pusta',
    })
    return
  }

  try {
    loadingStore.startLoading()

    const response = await axios.post(
      `${URL.CLASSES}/create_class`,
      {
        name: newClassName.value,
        password: newClassPassword.value,
        image_url: placeholderImage.value,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`,
        },
      },
    )

    classes.value = response.data
    cancelCreateClass()
    placeholderImage.value = ''
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
}

async function deleteClass(deleteId) {
  try {
    loadingStore.startLoading()

    const response = await axios.delete(`${URL.CLASSES}/delete_teacher_class/${deleteId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    })

    classes.value = response.data
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
}

async function deleteTask(deleteId) {
  try {
    loadingStore.startLoading()

    const response = await axios.delete(`${URL.TASKS}/delete_task/${deleteId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    })

    tasks.value = response.data
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
}

async function deleteLesson(deleteId) {
  try {
    loadingStore.startLoading()

    const response = await axios.delete(`${URL.LESSONS}/delete_lesson/${deleteId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    })

    lessons.value = response.data
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
}

// === POBIERANIE DANYCH PRZY MONCIE ===
onMounted(async () => {
  try {
    loadingStore.startLoading()

    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    }

    const [classResponse, taskResponse, lessonsResponse] = await axios.all([
      axios.get(`${URL.CLASSES}/get_teacher_classes`, config),
      axios.get(`${URL.TASKS}/get_teacher_tasks`, config),
      axios.get(`${URL.LESSONS}/get_teacher_lessons`, config),
    ])

    classes.value = classResponse.data
    tasks.value = taskResponse.data
    lessons.value = lessonsResponse.data // <--- przypisujemy lekcje
  } catch (error) {
    handleApiError(error, router)
    router.push('/') // <--- przekierowanie do widoku klas nauczyciela
  } finally {
    loadingStore.stopLoading()
  }
})
</script>
