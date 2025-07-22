<template>
  <div class="overlay">
    <div class="overlay__background" @click="closeOverlay"></div>
    <div class="overlay__container">
      <div class="overlay__header">
        <h1 class="overlay__title">{{ `Dodaj ${props.sectionItemType}` }}</h1>
        <button class="overlay__close-button" @click="closeOverlay">✕</button>
      </div>
      <div class="overlay__list">
        <component
          v-for="item in sectionItems"
          :key="item.id"
          :is="cardComponent"
          :data="item"
          :preview-button="previewButton"
          @click="addToSection(item.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { handleApiError } from '@/composables/errorHandling'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { computed, onMounted, ref } from 'vue'

import { URL } from '@/enums'

import LessonCard from './LessonCard.vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  sectionItemType: {
    type: String,
    required: true,
  },
  sectionId: {
    type: String,
    required: true,
  },
})

console.log(props.sectionItemType)

const cardComponent = computed(() => (props.sectionItemType === 'Tasks' ? TaskCard : LessonCard))

const emit = defineEmits(['close'])
const router = useRouter()
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const { jwtToken } = storeToRefs(authStore)

const sectionItems = ref([])
const previewButton = ref(true)

const endpoint = computed(() => {
  return props.sectionItemType === 'Tasks'
    ? `${URL.TASKS}/get_teacher_tasks`
    : `${URL.LESSONS}/get_teacher_lessons`
})

const addItemUrl = computed(() => {
  return props.sectionItemType === 'Tasks'
    ? `${URL.SECTIONS}/add_task_to_section`
    : `${URL.SECTIONS}/add_lesson_to_section`
})

async function addToSection(id) {
  try {
    loadingStore.startLoading()
    await axios.post(
      addItemUrl.value,
      { item_id: id, section_id: props.sectionId },
      { headers: { Authorization: `Bearer ${jwtToken.value}` } },
    )
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
}

function closeOverlay() {
  emit('close')
}

onMounted(async () => {
  try {
    loadingStore.startLoading()
    const response = await axios.get(endpoint.value, {
      headers: { Authorization: `Bearer ${jwtToken.value}` },
    })
    sectionItems.value = response.data
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
})
</script>

<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;

  &__background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
  }

  &__container {
    position: relative;
    background: white;
    border-radius: 20px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 900px;
    max-height: 700px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    z-index: 1001;
  }

  &__header {
    position: sticky;
    top: 0;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px;
    border-bottom: 1px solid #e0e0e0;
    z-index: 10;
  }

  &__title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  &__close-button {
    background: rgb(230, 230, 230);
    border: none;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

    &:hover {
      background: #ddd;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 25px;
  }
}
</style>
