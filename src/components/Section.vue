<template>
  <div class="section-detail">
    <!-- Nagłówek sekcji -->
    <div class="section-detail__header">
      <h1 class="section-detail__title">{{ title }}</h1>
      <button class="section-detail__toggle-button" @click="toggleContent">
        <img
          v-if="contentExpended"
          class="section-detail__arrow"
          src="@/assets/up-arrow.png"
          alt=""
        />
        <img v-else class="section-detail__arrow" src="@/assets/down-arrow.png" alt="" />
      </button>
    </div>

    <!-- Rozwijana treść sekcji -->
    <div
      class="section-detail__wrapper"
      :class="{ 'section-detail__wrapper--open': contentExpended }"
    >
      <div class="section-detail__expandable">
        <!-- Zawartość sekcji -->
        <div
          class="section-detail__content tinymce-content tinymce-content--section"
          v-html="content"
        ></div>

        <hr class="section-detail__horizontal-line" />

        <!-- Lekcje -->
        <div v-if="lessons.length" class="section-detail__lessons-container">
          <h2 class="section-detail__lessons-title">Lekcje</h2>
          <div
            class="item-card"
            v-for="lesson in lessons"
            :key="lesson.id"
            role="listitem"
            @click="goToLesson(lesson.id)"
          >
            <img class="item-card__image" src="@/assets/icons/teacher.png" alt="lesson icon" />
            <h3 class="item-card__title">{{ lesson.title }}</h3>

            <div class="item-card__actions" v-if="authStore.user.role === 'teacher'">
              <button
                class="item-card__action-button"
                @click.stop="previewLesson(lesson.id)"
                title="Podgląd lekcji"
              >
                <img src="@/assets/icons/search.png" alt="preview icon" />
              </button>
              <button
                class="item-card__action-button item-card__remove-button"
                @click.stop="removeFromSection(lesson.id, 'Lessons')"
                title="Usuń lekcję"
              >
                <img src="@/assets/icons/delete.png" alt="usuń ikonka" />
              </button>
            </div>
          </div>
        </div>

        <!-- Zadania -->
        <div v-if="tasks.length" class="section-detail__tasks-container">
          <h2 class="section-detail__tasks-title">Zadania</h2>
          <div
            class="item-card"
            v-for="task in tasks"
            :key="task.id"
            role="listitem"
            @click="goToTask(task.id)"
          >
            <img class="item-card__image" src="@/assets/icons/assignment.png" alt="task icon" />
            <h3 class="item-card__title">{{ task.question }}</h3>

            <div class="item-card__actions" v-if="authStore.user.role === 'teacher'">
              <button
                class="item-card__action-button item-card__remove-button"
                @click.stop="removeFromSection(task.id, 'Tasks')"
                title="Usuń zadanie"
              >
                <img src="@/assets/icons/delete.png" alt="usuń ikonka" />
              </button>
            </div>
          </div>
        </div>

        <!-- Przyciski dodawania -->
        <div v-if="authStore.user.role === 'teacher'" class="section-detail__buttons">
          <div class="section-detail__add-card" @click="handleAddLesson">
            <div class="section-detail__add-text">Dodaj lekcję</div>
          </div>
          <div class="section-detail__add-card" @click="handleAddTask">
            <div class="section-detail__add-text">Dodaj zadanie</div>
          </div>
          <!--
          <div class="section-detail__add-card" @click="handleAddFile">
            <div class="section-detail__add-text">Dodaj plik</div>
          </div>
          -->
        </div>
      </div>
    </div>
  </div>
  <ClassOverlay v-if="sectionType" v-bind="classOverlayProps" @close="closeOverlay" />
</template>

<script setup>
import useApi from '@/api/useApi'
import { useAuthStore } from '@/stores/auth'
import { useSectionStore } from '@/stores/classObject'
import { useRouter } from 'vue-router'

import { computed, ref } from 'vue'

import { URL } from '@/enums'

import ClassOverlay from '@/components/ClassOverlay.vue'

const authStore = useAuthStore()
const classObjectStore = useSectionStore()

const props = defineProps({
  title: String,
  content: String,
  sectionId: String,
  classId: String,
  lessons: {
    type: Array,
    default: () => [],
  },
  tasks: {
    type: Array,
    default: () => [],
  },
})

const sectionType = ref(null)
const contentExpended = ref(true)
const router = useRouter()

const classOverlayProps = computed(() => ({
  sectionItemType: sectionType.value,
  sectionId: props.sectionId,
  classId: props.classId,
  items: sectionType.value === 'Lessons' ? props.lessons : props.tasks,
}))

async function removeFromSection(id, type) {
  try {
    if (type === 'Lessons') {
      await useApi().post(
        `${URL.SECTIONS}/remove_lesson_from_section`,
        {
          lesson_id: id,
          section_id: props.sectionId,
        },
        router,
      )
    } else if (type === 'Tasks') {
      await useApi().post(
        `${URL.SECTIONS}/remove_task_from_section`,
        {
          task_id: id,
          section_id: props.sectionId,
        },
        router,
      )
    }
    classObjectStore.getSections(props.classId, router)
  } catch (error) {
    console.error('Błąd podczas usuwania elementu z sekcji:', error)
  }
}

function previewLesson(id) {
  const url = `${window.location.origin}/preview?id=${id}`
  window.open(url, '_blank')
}

function closeOverlay() {
  sectionType.value = null
}

function toggleContent() {
  contentExpended.value = !contentExpended.value
}

function handleAddLesson() {
  sectionType.value = 'Lessons'
}

function handleAddTask() {
  sectionType.value = 'Tasks'
}

function goToLesson(id) {
  if (authStore.user.role === 'student') {
    router.push({
      name: 'lesson',
      params: { classId: props.classId, sectionId: props.sectionId, lessonId: id },
    })
  }
}

function goToTask(id) {
  if (authStore.user.role === 'student') {
    console.log('Przejdź do zadania', id)
    router.push({
      name: 'single-task',
      params: { classId: props.classId, sectionId: props.sectionId, taskId: id },
    })
  }
}

function handleAddFile() {
  console.log('Dodaj plik')
}
</script>
