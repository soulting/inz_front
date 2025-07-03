<template>
  <div class="teacher-classes">
    <ClassGrid :classes="classes" :deleteButton="true" title="Moje klasy" @delete="deleteClass">
      <div class="teacher-classes__add-card" @click="createClass">
        <div class="teacher-classes__plus">+</div>
        <div class="teacher-classes__add-text">Dodaj klasę</div>
      </div>
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
    <TaskGrid :tasks="tasks" :deleteButton="true" :editButton="true" />

    >
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import ClassGrid from '@/components/ClassGrid.vue'
import { handleApiError } from '@/composables/errorHandling'
import { useRouter } from 'vue-router'
import TaskGrid from '@/components/TaskGrid.vue'

const tasks = ref([])

const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const { jwtToken } = storeToRefs(authStore)

const classes = ref([])

const router = useRouter()

const showCreateForm = ref(false)
const newClassName = ref('')
const newClassPassword = ref('')
const placeholderImage = ref('')

const createClass = () => {
  placeholderImage.value = `https://xxofdfokqesjgcuvqsax.supabase.co/storage/v1/object/public/inzyniekrka-images/placeholder${Math.floor(Math.random() * 6) + 1}.webp`
  showCreateForm.value = true
}

const cancelCreateClass = () => {
  showCreateForm.value = false
  newClassName.value = ''
  newClassPassword.value = ''
}

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
    showCreateForm.value = false
    newClassName.value = ''
    newClassPassword.value = ''
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
    console.log('tasks.value', tasks.value)
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
})
</script>
