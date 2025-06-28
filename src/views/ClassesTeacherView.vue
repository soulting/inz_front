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

const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const { jwtToken } = storeToRefs(authStore)

const classes = ref([])

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
    console.error('Błąd podczas dodawania klasy:', error)
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
    if (error.response) {
      console.error('Backend error:', error.response.status, error.response.data)

      return {
        success: false,
      }
    } else if (error.request) {
      console.error('No response from server:', error.request)

      return {
        success: false,
      }
    } else {
      console.error('Axios error:', error.message)

      return {
        success: false,
      }
    }
  } finally {
    loadingStore.stopLoading()
  }
}

onMounted(async () => {
  try {
    loadingStore.startLoading()

    const response = await axios.get('http://localhost:5000/classes/get_teacher_classes', {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    })

    console.log('Classes fetched:', response.data)

    classes.value = response.data
  } catch (error) {
    if (error.response) {
      console.error('Backend error:', error.response.status, error.response.data)

      return {
        success: false,
      }
    } else if (error.request) {
      console.error('No response from server:', error.request)

      return {
        success: false,
      }
    } else {
      console.error('Axios error:', error.message)

      return {
        success: false,
      }
    }
  } finally {
    loadingStore.stopLoading()
  }
})
</script>
