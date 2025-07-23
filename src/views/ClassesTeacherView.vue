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
import { useClassStore } from '@/stores/classes'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'

import ClassGrid from '@/components/ClassGrid.vue'
import LessonList from '@/components/LessonList.vue'
import TaskList from '@/components/TaskList.vue'

const classStore = useClassStore()

// === INSTANCJE ===
const router = useRouter()

// === STANY ===
const classes = storeToRefs(classStore).classes
const tasks = storeToRefs(classStore).tasks
const lessons = storeToRefs(classStore).lessons

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
    await classStore.createClass(
      {
        name: newClassName.value,
        password: newClassPassword.value,
        image_url: placeholderImage.value,
      },
      router,
    )

    Swal.fire({
      icon: 'success',
      title: 'Sukces',
      text: 'Klasa została utworzona',
    })

    showCreateForm.value = false
    newClassName.value = ''
    newClassPassword.value = ''

    await classStore.getClasses(router)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Błąd',
      text: 'Nie udało się utworzyć klasy.',
    })
    console.error(error)
  }
}

async function deleteClass(deleteId) {
  await classStore.deleteClass(deleteId, router)
  await classStore.getClasses(router)
}

async function deleteTask(deleteId) {
  await classStore.deleteTask(deleteId, router)
  await classStore.getTasks(router)
}

async function deleteLesson(deleteId) {
  await classStore.deleteLesson(deleteId, router)
  await classStore.getLessons(router)
}

// === POBIERANIE DANYCH PRZY MONCIE ===
onMounted(async () => {
  classStore.getClasses(router)
  classStore.getTasks(router)
  classStore.getLessons(router)
})
</script>
