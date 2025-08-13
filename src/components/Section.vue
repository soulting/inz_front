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

<style scoped lang="scss">
.section-detail {
  display: flex;
  flex-direction: column;
  margin: 12px;
  padding: 10px 10px;
  border-radius: 16px;
  background: white;
  border: 0.5px solid rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__arrow {
    height: 13px;
    width: 13px;
    aspect-ratio: 1 / 1;
    padding-top: 3px;
    object-fit: cover;
    object-position: center;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin: 5px 50px;
  }

  &__toggle-button {
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 50%;
    border: 0.5px solid #333;
    cursor: pointer;
    transition: background 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #f0f0f0;
    }
  }

  &__wrapper {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows 300ms;

    &--open {
      grid-template-rows: 1fr;
    }
  }

  &__expandable {
    min-height: 0;
  }

  &__content {
    font-size: 1.1rem;
    color: #444;
    line-height: 1.6;
    padding: 0 10px;
    border-radius: 12px;
    margin: 0;
  }

  &__lessons-container,
  &__tasks-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 6px;
    margin: 16px 0;
    color: #333;
  }

  &__lessons-title,
  &__tasks-title {
    margin-left: 30px;
  }

  &__buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin: 2px 10px;
  }

  &__add-card {
    cursor: pointer;
    width: 260px;
    height: 55px;
    background: #f3f4f6;
    border: 2px dashed #4f46e5;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition:
      background 0.3s,
      transform 0.2s;

    &:hover {
      background: #eef2ff;
      transform: scale(1.05);
    }
  }

  &__add-text {
    font-weight: 600;
    color: #374151;
    text-align: center;
  }

  &__horizontal-line {
    height: 1px;
    border: none;
    background-color: #ccc;
    margin: 1rem 0;
  }
}

.item-card {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 16px;

  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  border: 1px solid #e5e7eb;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    background-color: #f9fafb;
  }

  &__image {
    height: 44px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #4f46e5;
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
    flex-grow: 1;
  }

  &__actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__action-button {
    background: transparent;
    border: none;
    padding: 6px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;

    img {
      height: 24px;
      width: 24px;
      pointer-events: none;
      user-select: none;
    }

    &:hover {
      background-color: #e0e7ff;
      transform: scale(1.1);
    }
  }

  &__remove-button {
    border: 1px solid #ef4444; // czerwony border
    background-color: transparent;

    &:hover {
      background-color: #fef2f2; // jasnoczerwone tło
    }
  }
}
</style>
