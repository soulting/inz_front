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

        <!-- Kontener na lekcje i zadania -->
        <div class="section-detail__lessons-container">
          <div class="lesson-card" v-for="lesson in lessons" :key="lesson.id">
            <h3>{{ lesson.title }}</h3>
            <p>{{ lesson.description }}</p>
          </div>

          <!-- Przyciski dodawania -->
          <div class="section-detail__buttons">
            <div class="section-detail__add-card" @click="handleAddLesson">
              <div class="section-detail__add-text">Dodaj lekcję</div>
            </div>
            <div class="section-detail__add-card" @click="handleAddTask">
              <div class="section-detail__add-text">Dodaj zadanie</div>
            </div>
            <div class="section-detail__add-card" @click="handleAddFile">
              <div class="section-detail__add-text">Dodaj plik</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ClassOverlay
    v-if="sectionType"
    :section-item-type="sectionType"
    :sectionId="id"
    @close="closeOverlay"
  />
</template>

<script setup>
import { ref } from 'vue'

import ClassOverlay from '@/components/ClassOverlay.vue'

const props = defineProps({
  title: String,
  content: String,
  id: String,
})

const sectionType = ref(null)

const contentExpended = ref(true)
const lessons = ref([])

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
    flex-direction: row;
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
    border: #333 solid 0.5px;
    cursor: pointer;
    transition: background 0.3s;
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

  &__lessons-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;
  }

  .lesson-card {
    flex: 1 1 250px;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 12px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
}

.section-detail__horizontal-line {
  height: 1px;
  border: none;
  background-color: #ccc;
  margin: 1rem 0;
}
</style>
