<template>
  <div v-for="section in sections" :key="section.id" class="class-detail__section-container">
    <Section
      :class-id="id"
      :section-id="section.id"
      :title="section.title"
      :content="section.content"
      :lessons="section.lessons"
      :tasks="section.tasks"
    />
  </div>
  <AddSection v-if="authStore.user.role === 'teacher'" :classId="id" />
</template>
<script setup>
import { useAuthStore } from '@/stores/auth'
import { useSectionStore } from '@/stores/classObject'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { onMounted } from 'vue'

import AddSection from '@/components/AddSection.vue'
import Section from '@/components/Section.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const authStore = useAuthStore()

const classObjectStore = useSectionStore()

const sections = storeToRefs(classObjectStore).sections

const router = useRouter()

onMounted(async () => {
  classObjectStore.getSections(props.id, router)
})
</script>

<style scoped></style>
