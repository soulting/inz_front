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
import { ref, onMounted, computed } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

import ClassGrid from '@/components/ClassGrid.vue'
import { handleApiError } from '@/composables/errorHandling'
import { useRouter } from 'vue-router'

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
      'http://localhost:5000/classes/join_class',
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

    const response = await axios.delete(`http://localhost:5000/classes/leave_class/${deleteId}`, {
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

    const response = await axios.get('http://localhost:5000/classes/get_student_classes', {
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
