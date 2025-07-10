<template>
  <div class="list">
    <h1 class="list_title">Moje zadania</h1>

    <!-- FILTRY I SORTOWANIE -->
    <div class="list__controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Szukaj zadania..."
        class="list__search-input"
      />
      <select v-model="sortBy" class="list__sort-select">
        <option value="date_desc">Sortuj: Data (najnowsze)</option>
        <option value="date_asc">Sortuj: Data (najstarsze)</option>
        <option value="difficulty_asc">Sortuj: Poziom trudności (rosnąco)</option>
        <option value="difficulty_desc">Sortuj: Poziom trudności (malejąco)</option>
      </select>
    </div>

    <!-- GRID ZADAŃ -->
    <div class="list__grid">
      <slot></slot>

      <div v-if="!filteredAndSortedLessons.length" class="list__no-classes">
        Brak klas do wyświetlenia
      </div>

      <div v-for="taskItem in filteredAndSortedLessons.slice(0, sliceCount)" :key="taskItem.id">
        <TaskCard
          :taskData="taskItem"
          :editButton="editButton"
          :deleteButton="deleteButton"
          @delete="confirmAndDelete"
          @edit="emitEdit"
        />
      </div>
    </div>

    <!-- PRZYCISKI POKAŻ WIĘCEJ/MNIEJ -->
    <div class="list__show-more-wrapper">
      <button class="list__show-more-button" @click="showMoreButton ? showMore() : showLess()">
        {{ showMoreButton ? 'Pokaż więcej' : 'Pokaż mniej' }}
      </button>
    </div>
  </div>
</template>

<script setup>
// === IMPORTY ===
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import TaskCard from '@/components/TaskCard.vue'

// === PROPS & EMITY ===
const props = defineProps({
  lessons: { type: Array, required: true },
  editButton: { type: Boolean, default: false },
  deleteButton: { type: Boolean, default: false },
})
const emit = defineEmits(['delete', 'join'])

// === STANY LOKALNE ===
const searchQuery = ref('')
const sortBy = ref('date_desc')
const sliceCount = ref(5)
const showMoreButton = ref(true)

const levelOrder = ['A1', 'A2', 'B1']

// === FUNKCJE ===
function showMore() {
  sliceCount.value = props.lessons.length
  showMoreButton.value = false
}
function showLess() {
  sliceCount.value = 5
  showMoreButton.value = true
}

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
    }
  })
}

function emitEdit(taskId) {
  emit('edit', taskId)
}

// === COMPUTED: FILTROWANIE + SORTOWANIE ===
const filteredAndSortedLessons = computed(() => {
  let result = [...props.lessons]

  // Filtrowanie
  if (searchQuery.value.trim()) {
    result = result.filter((task) =>
      task.question.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  // Sortowanie
  switch (sortBy.value) {
    case 'date_desc':
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'date_asc':
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'difficulty_asc':
      result.sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level))
      break
    case 'difficulty_desc':
      result.sort((a, b) => levelOrder.indexOf(b.level) - levelOrder.indexOf(a.level))
      break
  }

  return result
})
</script>
