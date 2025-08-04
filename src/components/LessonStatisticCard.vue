<template>
  <div class="lesson-card">
    <!-- Nagłówek lekcji -->
    <div class="lesson-card__header">
      <h2 class="lesson-card__title">{{ lesson.lesson_name }}</h2>
      <button
        class="lesson-card__toggle-button"
        @click="$emit('toggle-expanded', lesson.lesson_id)"
        :title="isExpanded ? 'Ukryj szczegóły' : 'Pokaż szczegóły'"
      >
        <img v-if="isExpanded" class="lesson-card__arrow" src="@/assets/up-arrow.png" alt="ukryj" />
        <img v-else class="lesson-card__arrow" src="@/assets/down-arrow.png" alt="pokaż" />
      </button>
    </div>

    <!-- Wykresy - zawsze widoczne -->
    <div class="lesson-card__charts">
      <TimeChart :lesson="lesson" />
      <EngagementChart :lesson="lesson" />
      <DifficultyChart :lesson="lesson" />
    </div>

    <!-- Rozwijana tabela szczegółów -->
    <ExpandableDetails :lesson="lesson" :is-expanded="isExpanded" />
  </div>
</template>

<script setup>
import DifficultyChart from './DifficultyChart.vue'
import EngagementChart from './EngagementChart.vue'
import ExpandableDetails from './ExpandableDetails.vue'
import TimeChart from './TimeChart.vue'

defineProps({
  lesson: Object,
  isExpanded: Boolean,
})

defineEmits(['toggle-expanded'])
</script>

<style scoped lang="scss">
.lesson-card {
  display: flex;
  flex-direction: column;
  margin: 12px 0;
  padding: 20px;
  border-radius: 16px;
  background: white;
  border: 0.5px solid rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  &__toggle-button {
    width: 42px;
    height: 42px;
    border: 0.5px solid #333;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    transition: background 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #f0f0f0;
    }
  }

  &__arrow {
    height: 13px;
    width: 13px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center;
  }

  &__charts {
    display: flex;
    justify-content: flex-start;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
}

// Responsive design
@media (max-width: 768px) {
  .lesson-card {
    &__charts {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
