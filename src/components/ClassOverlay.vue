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
