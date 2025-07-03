<template>
  <div class="task-list">
    <h1 class="task-list_title">Moje zadania</h1>
    <div class="task-list__controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Szukaj zadania..."
        class="task-list__search-input"
      />

      <select v-model="sortBy" class="task-list__sort-select">
        <option value="date_desc">Sortuj: Data (najnowsze)</option>
        <option value="date_asc">Sortuj: Data (najstarsze)</option>
        <option value="difficulty_asc">Sortuj: Poziom trudności (rosnąco)</option>
        <option value="difficulty_desc">Sortuj: Poziom trudności (malejąco)</option>
      </select>
    </div>

    <!-- Grid kafelków -->
    <div class="task-list__grid">
      <div class="task-list__add-card" @click="createClass">
        <div class="task-list__plus">+</div>
        <div class="task-list__add-text">Dodaj klasę</div>
      </div>
      <div v-if="!filteredAndSortedTasks.length" class="task-list__no-classes">
        Brak klas do wyświetlenia
      </div>

      <!-- Kafelki klas -->
      <div v-for="taskItem in filteredAndSortedTasks.slice(0, sliceCount)" :key="taskItem.id">
        <TaskCard
          :taskData="taskItem"
          :editButton="editButton"
          :deleteButton="deleteButton"
          @delete="confirmAndDelete"
          @edit="emitEdit"
        />
      </div>
    </div>
    <div v-if="showMoreButton" class="task-list__show-more-wrapper">
      <button class="task-list__show-more-button" @click="showMore">Pokaż więcej</button>
    </div>
    <div v-else class="task-list__show-more-wrapper">
      <button class="task-list__show-more-button" @click="showLess">Pokaż mniej</button>
    </div>
  </div>
</template>

<script setup>
import TaskCard from '@/components/TaskCard.vue'
import Swal from 'sweetalert2'
import { ref, computed } from 'vue'

const levelOrder = ['A1', 'A2', 'B1']

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },

  editButton: {
    type: Boolean,
    default: false,
  },
  deleteButton: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['delete', 'join'])

const searchQuery = ref('')
const sortBy = ref('date_desc')
const sliceCount = ref(5)
const showMoreButton = ref(true)

function showMore() {
  sliceCount.value = props.tasks.length
  showMoreButton.value = false
}
const showLess = () => {
  sliceCount.value = 5
  showMoreButton.value = true
}

const filteredAndSortedTasks = computed(() => {
  let result = [...props.tasks]

  if (searchQuery.value.trim()) {
    result = result.filter((cls) =>
      cls.question.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  switch (sortBy.value) {
    case 'date_desc':
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'date_asc':
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'difficulty_asc':
      result.sort((a, b) => {
        return levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level)
      })
      break
    case 'difficulty_desc':
      result.sort((a, b) => {
        return levelOrder.indexOf(b.level) - levelOrder.indexOf(a.level)
      })
      break
  }

  return result
})

function confirmAndDelete(deleteId) {
  Swal.fire({
    title: 'Czy na pewno chcesz usunąć tę klasę?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Tak, usuń',
    cancelButtonText: 'Anuluj',
  }).then((result) => {
    if (result.isConfirmed) {
      emit('delete', deleteId)
    } else {
      console.log('Usuwanie anulowane')
    }
  })
}

function emitEdit(classID) {
  console.log('Edit', classID)
}
</script>
