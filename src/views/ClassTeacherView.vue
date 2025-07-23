<template>
  <div class="class-detail">
    <div class="class-detail__container">
      <!-- Nagłówek z nazwą klasy -->
      <div class="class-detail__header">
        <h1 class="class-detail__title">{{ props.name }}</h1>
        <!-- Przyciski na przyszłość -->
        <div class="class-detail__buttons">
          <button class="class-detail__button class-detail__button--active">Lekcje</button>
          <button class="class-detail__button">Statystyki</button>
        </div>
      </div>
      <!-- Sekcja zawartości -->
      <div class="class-detail__content">
        <div v-for="section in sections" :key="section.id" class="class-detail__section-container">
          <Section :id="section.id" :title="section.title" :content="section.content" />
        </div>
        <AddSection :classId="id" />
      </div>
    </div>
  </div>
</template>

<script setup>
// === IMPORTY ===
import { handleApiError } from '@/composables/errorHandling'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

import AddSection from '@/components/AddSection.vue'
import Section from '@/components/Section.vue'

const sections = ref([])

const router = useRouter()
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const { token } = storeToRefs(authStore)

// === PROPSY ===
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: [String, Number],
    required: true,
  },
})

const sectionType = ref(null)

onMounted(async () => {
  try {
    loadingStore.startLoading()

    const response = await axios.get(`${URL.SECTIONS}/get_sections/${props.id}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    sections.value = response.data.sections
    console.log('Sekcje:', sections.value)
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
})
</script>

<style scoped lang="scss">
.class-detail {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  justify-content: center;

  &__container {
    width: 100%;
    max-width: 1300px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;

    margin-bottom: 25px;
  }

  &__header {
    display: flex;

    align-items: start;
    flex-direction: column;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin: 10px 25px;
  }

  &__buttons {
    display: flex;
    gap: 10px;
    margin: 0 25px;
  }

  &__button {
    padding: 8px 16px;
    font-weight: 500;
    background-color: rgb(230, 230, 230);
    color: #333;
    border: none;

    cursor: pointer;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    &--active {
      background-color: white;
      position: relative;
      z-index: 2;
      box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.05);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    // gap: 16px;
    flex: 1;
    width: 100%;
    height: 100vh;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }
}
</style>
