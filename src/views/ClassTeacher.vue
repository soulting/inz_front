<template>
  <div class="teacher-classes">
    <div class="teacher-classes__inner">
      <div class="teacher-classes__controls">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Szukaj klasy..."
          class="teacher-classes__search-input"
        />

        <select v-model="sortBy" class="teacher-classes__sort-select">
          <option value="name">Sortuj: A-Z</option>
          <option value="date">Sortuj: Data utworzenia</option>
        </select>
      </div>

      <!-- Grid kafelków -->
      <div class="teacher-classes__grid">
        <!-- Kafelek do dodania klasy -->
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

        <!-- Kafelki klas -->
        <div v-for="classItem in filteredAndSortedClasses.slice(0, sliceCount)" :key="classItem.id">
          <ClassCard :classData="classItem" @delete="confirmAndDelete" @edit="editClass" />
        </div>
      </div>
      <div v-if="showMoreButton" class="teacher-classes__show-more-wrapper">
        <button class="teacher-classes__show-more-button" @click="showMore">Pokaż więcej</button>
      </div>
      <div v-else class="teacher-classes__show-more-wrapper">
        <button class="teacher-classes__show-more-button" @click="showLess">Pokaż mniej</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ClassCard from '@/components/ClassCard.vue'
import { useLoadingStore } from '@/stores/loading'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'

const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const { jwtToken } = storeToRefs(authStore)

const classes = ref([])

const searchQuery = ref('')
const sortBy = ref('name')
const showAddForm = ref(false)
const newClassName = ref('')
const newClassPassword = ref('')
const placeholderImage = ref('')
const sliceCount = ref(7)
const showMoreButton = ref(true)

function showMore() {
  sliceCount.value = classes.value.length
  showMoreButton.value = false
}
const showLess = () => {
  sliceCount.value = 7
  showMoreButton.value = true
}

const filteredAndSortedClasses = computed(() => {
  let result = [...classes.value]

  if (searchQuery.value.trim()) {
    result = result.filter((cls) =>
      cls.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'date') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return result
})

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

const editClass = (classId) => {
  alert(`Edytuj klasę o ID: ${classId}`)
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

function confirmAndDelete(deleteId) {
  Swal.fire({
    title: 'Czy na pewno chcesz usunąć tę klasę?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Tak, usuń',
    cancelButtonText: 'Anuluj',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteClass(deleteId)
    } else {
      console.log('Usuwanie anulowane')
    }
  })
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

<!-- <style scoped>
.teacher-classes {
  background-color: #f5f5f5;
  padding: 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.teacher-classes__inner {
  width: 100%;
  max-width: 1300px;
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
}

.teacher-classes__controls {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.teacher-classes__search-input,
.teacher-classes__sort-select {
  padding: 8px 12px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
}

.teacher-classes__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 20px;
}

.teacher-classes__add-card {
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

.teacher-classes__add-card:hover {
  background-color: #f0f0f0;
}

.teacher-classes__plus {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.teacher-classes__add-text {
  font-size: 14px;
  color: #333;
}
.teacher-classes__form-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.teacher-classes__input {
  padding: 8px;
  font-size: 16px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid #ccc;
}

.teacher-classes__form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.teacher-classes__submit-button,
.teacher-classes__cancel-button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.teacher-classes__submit-button {
  background-color: #4caf50;
  color: white;
}

.teacher-classes__cancel-button {
  background-color: #f44336;
  color: white;
}

.teacher-classes__show-more-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.teacher-classes__show-more-button {
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

.teacher-classes__show-more-button:hover {
  background-color: #3442c2;
}
</style> -->

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
  box-sizing: border-box;

  &__inner {
    width: 100%;
    max-width: 1300px;
    background-color: #ffffff;
    padding: 24px;
    border-radius: 8px;
  }
  &__controls {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }
  &__search-input,
  &__sort-select {
    padding: 8px 12px;
    font-size: 16px;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: white;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    gap: 20px;
  }

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
