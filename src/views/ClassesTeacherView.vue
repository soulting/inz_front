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
    <TaskGrid :tasks="tasks" :deleteButton="true" :editButton="true">
      <div class="task-list__add-card" @click="goToCreateTask">
        <div class="task-list__plus">+</div>
        <div class="task-list__add-text">Dodaj klasę</div>
      </div>
    </TaskGrid>
  </div>
</template>

<script setup>
// === IMPORTY ===
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import { storeToRefs } from 'pinia'

import ClassGrid from '@/components/ClassGrid.vue'
import TaskGrid from '@/components/TaskGrid.vue'

import { useLoadingStore } from '@/stores/loading'
import { useAuthStore } from '@/stores/auth'
import { handleApiError } from '@/composables/errorHandling'

// === INSTANCJE ===
const router = useRouter()
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const { jwtToken } = storeToRefs(authStore)

// === STANY ===
const classes = ref([])
const tasks = ref([])

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
      'http://localhost:5000/classes/create_class',
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

    const response = await axios.delete(
      `http://localhost:5000/classes/delete_teacher_class/${deleteId}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`,
        },
      },
    )

    classes.value = response.data
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

    const [classResponse, taskResponse] = await axios.all([
      axios.get('http://localhost:5000/classes/get_teacher_classes', config),
      axios.get('http://localhost:5000/tasks/get_teacher_tasks', config),
    ])

    classes.value = classResponse.data
    tasks.value = taskResponse.data
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
})
</script>
