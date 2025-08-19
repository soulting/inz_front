<template>
  <div class="overlay">
    <div class="overlay__background" @click="closeOverlay"></div>
    <div class="overlay__container">
      <div class="overlay__header">
        <h1 class="overlay__title">
          {{ `Dodaj ${props.sectionItemType === 'Tasks' ? 'zadanie' : 'lekcję'}` }}
        </h1>
        <button class="overlay__close-button" @click="closeOverlay">✕</button>
      </div>
      <div class="overlay__list">
        <template v-if="filteredItems.length">
          <component
            v-for="item in filteredItems"
            :key="item.id"
            :is="cardComponent"
            :data="item"
            :preview-button="previewButton"
            @click="addToSection(item.id)"
          />
        </template>
        <p v-else class="overlay__empty-message">
          Nie ma już żadnych {{ props.sectionItemType === 'Tasks' ? 'zadań' : 'lekcji' }} do
          dodania.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { useSectionStore } from '@/stores/classObject'
import { useTeacherClassStore } from '@/stores/teacherClassesStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { computed, onMounted, ref } from 'vue'

import { URL } from '@/enums'

import LessonCard from './LessonCard.vue'
import TaskCard from './TaskCard.vue'

const classObjectStore = useSectionStore()

const props = defineProps({
  sectionItemType: {
    type: String,
    required: true,
  },
  sectionId: {
    type: String,
    required: true,
  },
  classId: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
})

console.log('ClassOverlay props:', props)

const filteredItems = computed(() => {
  return sectionItems.value.filter(
    (item) => !props.items.some((existingItem) => existingItem.id === item.id),
  )
})

const teacherClassStore = useTeacherClassStore()

const sectionItems = computed(() => {
  const items =
    props.sectionItemType === 'Tasks'
      ? storeToRefs(teacherClassStore).tasks
      : storeToRefs(teacherClassStore).lessons
  return items.value || []
})
const cardComponent = props.sectionItemType === 'Tasks' ? TaskCard : LessonCard

const emit = defineEmits(['close'])
const router = useRouter()

// const sectionItems =
//   props.sectionItemType === 'Tasks'
//     ? storeToRefs(teacherClassStore).tasks
//     : storeToRefs(teacherClassStore).lessons

const previewButton = ref(true)

async function addToSection(id) {
  props.sectionItemType === 'Tasks'
    ? await useApi().post(
        `${URL.SECTIONS}/add_task_to_section`,
        { task_id: id, section_id: props.sectionId, class_id: props.classId },
        router,
      )
    : await useApi().post(
        `${URL.SECTIONS}/add_lesson_to_section`,
        { lesson_id: id, section_id: props.sectionId, class_id: props.classId },
        router,
      )

  closeOverlay()
}

async function closeOverlay() {
  await classObjectStore.getSections(props.classId, router)

  emit('close')
}

onMounted(async () => {
  props.sectionItemType === 'Tasks'
    ? await teacherClassStore.getTasks(router)
    : await teacherClassStore.getLessons(router)
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
.overlay__empty-message {
  font-size: 1.1rem;
  color: #666;
  text-align: center;
  padding: 40px 20px;
}
</style>
