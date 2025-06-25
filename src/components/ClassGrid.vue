<template>
  <div class="class-grid">
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
      <!-- Kafelki klas -->
      <div v-for="classItem in filteredAndSortedClasses.slice(0, sliceCount)" :key="classItem.id">
        <ClassCard :classData="classItem" @delete="confirmAndDelete" />
      </div>
    </div>
    <div v-if="showMoreButton" class="class-grid__show-more-wrapper">
      <button class="class-grid__show-more-button" @click="showMore">Pokaż więcej</button>
    </div>
    <div v-else class="class-grid__show-more-wrapper">
      <button class="class-grid__show-more-button" @click="showLess">Pokaż mniej</button>
    </div>
  </div>
</template>

<script setup>
import ClassCard from '@/components/ClassCard.vue'
import Swal from 'sweetalert2'
import { ref, computed, defineProps } from 'vue'

const props = defineProps({ classes: Array })
const emit = defineEmits(['delete'])

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
</script>

<style scoped lang="scss">
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.class-grid {
  width: 100%;
  max-width: 1300px;
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;

  &__controls {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }
  &__search-input,
  &__sort-select {
    padding: 8px 12px;
    font-size: 16px;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: white;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    gap: 20px;
  }

  &__show-more-wrapper {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &__show-more-button {
    padding: 10px 24px;
    font-size: 16px;
    background-color: #3b4bdc; /* intensywny niebieski */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 6px rgba(25, 118, 210, 0.4);
  }

  &__show-more-button:hover {
    background-color: #3442c2;
  }
}
</style>
