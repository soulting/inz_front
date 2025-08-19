<template>
  <div class="class-grid">
    <h1 class="class-grid_title">{{ title }}</h1>
    <div class="class-grid__controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Szukaj klasy..."
        class="class-grid__search-input"
      />

      <select v-model="sortBy" class="class-grid__sort-select">
        <option value="name">Sortuj: A-Z</option>
        <option value="date">Sortuj: Data utworzenia</option>
      </select>
    </div>

    <!-- Grid kafelków -->
    <div class="class-grid__grid">
      <slot></slot>
      <div v-if="!filteredAndSortedClasses.length" class="class-grid__no-classes">
        Brak klas do wyświetlenia
      </div>

      <!-- Kafelki klas -->
      <div v-for="classItem in filteredAndSortedClasses.slice(0, sliceCount)" :key="classItem.id">
        <ClassCard
          :classData="classItem"
          v-bind="classCardProps"
          @delete="confirmAndDelete"
          @join="emitJoin"
        />
      </div>
    </div>

    <div v-if="filteredAndSortedClasses.length > 7" class="class-grid__show-more-wrapper">
      <button
        class="class-grid__show-more-button"
        @click="showMoreButton ? showMore() : showLess()"
      >
        {{ showMoreButton ? 'Pokaż więcej' : 'Pokaż mniej' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

import { computed, ref } from 'vue'

import ClassCard from '@/components/ClassCard.vue'

const props = defineProps({
  classes: {
    type: Array,
    required: true,
    default: () => [],
  },
  title: {
    type: String,
    default: 'Klasy',
  },
  cardClickable: {
    type: Boolean,
    default: false,
  },
  joinButton: {
    type: Boolean,
    default: false,
  },
  deleteButton: {
    type: Boolean,
    default: false,
  },
})

const classCardProps = computed(() => ({
  joinButton: props.joinButton,
  deleteButton: props.deleteButton,
  cardClickable: props.cardClickable,
}))
const emit = defineEmits(['delete', 'join'])

const searchQuery = ref('')
const sortBy = ref('name')
const sliceCount = ref(7)
const showMoreButton = ref(true)

function showMore() {
  sliceCount.value = props.classes.length
  showMoreButton.value = false
}
const showLess = () => {
  sliceCount.value = 7
  showMoreButton.value = true
}

const filteredAndSortedClasses = computed(() => {
  let result = [...props.classes]

  if (searchQuery.value.trim()) {
    result = result.filter((cls) =>
      cls.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'date') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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

function emitJoin(classID, joinPassword) {
  emit('join', classID, joinPassword)
}
</script>
