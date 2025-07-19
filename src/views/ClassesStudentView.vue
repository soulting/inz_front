<template>
  <div class="student-classes">
    <ClassGrid :classes="myClasses" :deleteButton="true" title="Moje klasy" @delete="leaveClass" />
    <ClassGrid
      :classes="remainingClasses"
      :joinButton="true"
      title="Wszystkie klasy"
      @join="joinClass"
    />
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

import ClassGrid from '@/components/ClassGrid.vue'

const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const { jwtToken } = storeToRefs(authStore)

const router = useRouter()

const classes = ref([])

const myClasses = computed(() => {
  return classes.value.filter((cls) => cls.owned_by_user)
})

const remainingClasses = computed(() => {
  return classes.value.filter((cls) => !cls.owned_by_user)
})

const joinClass = async (classID, joinPassword) => {
  try {
    loadingStore.startLoading()

    const response = await axios.post(
      `${URL.CLASSES}/join_class`,
      {
        classID: classID,
        joinPassword: joinPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`,
        },
      },
    )

    classes.value = response.data
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
}

async function leaveClass(deleteId) {
  try {
    loadingStore.startLoading()

    const response = await axios.delete(`${URL.CLASSES}/leave_class/${deleteId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    })

    classes.value = response.data
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
}

onMounted(async () => {
  try {
    loadingStore.startLoading()

    const response = await axios.get(`${URL.CLASSES}/get_student_classes`, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    })

    console.log('Classes fetched:', response.data)

    classes.value = response.data
  } catch (error) {
    handleApiError(error, router)
  } finally {
    loadingStore.stopLoading()
  }
})
</script>
