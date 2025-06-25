<template>
  <div class="teacher-classes">
    <ClassGrid :classes="classes" @delete="deleteClass">
      <div class="teacher-classes__add-card" @click="addClass">
        <div class="teacher-classes__plus">+</div>
        <div class="teacher-classes__add-text">Dodaj klasę</div>
      </div>
      <div
        v-if="showAddForm"
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
            @click="cancelAddClass"
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

const showAddForm = ref(false)
const newClassName = ref('')
const newClassPassword = ref('')
const placeholderImage = ref('')

const addClass = () => {
  placeholderImage.value = `https://xxofdfokqesjgcuvqsax.supabase.co/storage/v1/object/public/inzyniekrka-images/placeholder${Math.floor(Math.random() * 6) + 1}.webp`
  showAddForm.value = true
}

const cancelAddClass = () => {
  showAddForm.value = false
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
      'http://localhost:5000/classes/add_class',
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
    showAddForm.value = false
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

    const response = await axios.delete(`http://localhost:5000/classes/delete_class/${deleteId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    })

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

    const response = await axios.get('http://localhost:5000/classes/get_classes', {
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

<style scoped lang="scss">
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.teacher-classes {
  background-color: #f5f5f5;
  padding: 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  &__add-card {
    border: 2px dashed #999;
    background-color: #fafafa;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 160px;
    border-radius: 6px;
  }
  &__add-card:hover {
    background-color: #f0f0f0;
  }

  &__plus {
    font-size: 32px;
    font-weight: bold;
    color: #333;
  }

  &__add-text {
    font-size: 14px;
    color: #333;
  }
  &__form-card {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: {
      position: center;
      size: cover;
      repeat: no-repeat;
    }
  }
  &__input {
    padding: 8px;
    font-size: 16px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.6);
    border: 1px solid #ccc;
  }

  &__form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  &__button {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: white;

    &--submit {
      background-color: #4caf50;
    }

    &--cancel {
      background-color: #f44336;
    }
  }

  &__show-more-wrapper {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &__show-more-button {
    padding: 10px 24px;
    font-size: 16px;
    background-color: #3b4bdc; /* intensywny niebieski */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 6px rgba(25, 118, 210, 0.4);
  }

  &__show-more-button:hover {
    background-color: #3442c2;
  }
}
</style>
