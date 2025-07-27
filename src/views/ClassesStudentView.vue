<template>
  <div class="student-classes">
    <ClassGrid v-bind="myClassesProp" @delete="leaveClass" />
    <ClassGrid v-bind="remainingClassesProp" @join="joinClass" />
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { useRouter } from 'vue-router'

import { computed, onMounted, ref } from 'vue'

import { URL } from '@/enums'

import ClassGrid from '@/components/ClassGrid.vue'

const router = useRouter()

const classes = ref([])

const myClassesProp = computed(() => ({
  title: 'Moje klasy',
  classes: myClasses.value,
  deleteButton: true,
  cardClickable: true,
}))

const remainingClassesProp = computed(() => ({
  title: 'Wszystkie klasy',
  classes: remainingClasses.value,
  joinButton: true,
}))

const myClasses = computed(() => {
  return classes.value.filter((cls) => cls.owned_by_user)
})

const remainingClasses = computed(() => {
  return classes.value.filter((cls) => !cls.owned_by_user)
})

const joinClass = async (classID, joinPassword) => {
  await useApi().post(`${URL.CLASSES}/join_class`, { classID, joinPassword }, router)
  fetchClasses()
}

async function leaveClass(deleteId) {
  await useApi().del(`${URL.CLASSES}/leave_class/${deleteId}`, router)
  fetchClasses()
}

async function fetchClasses() {
  classes.value = await useApi().get(`${URL.CLASSES}/get_student_classes`, router)
}

onMounted(async () => {
  await fetchClasses()
})
</script>
