ExerciseCard.vue
<template>
  <div class="exercise-card">
    <!-- Nagłówek zadania -->
    <div class="exercise-card__header">
      <div class="exercise-card__header-left">
        <h2 class="exercise-card__title">{{ task.question }}</h2>
        <div class="exercise-card__meta">
          <span class="exercise-card__category">{{ task.main_category }}</span>
          <span class="exercise-card__separator">•</span>
          <span class="exercise-card__subcategory">{{ task.sub_category }}</span>
          <span class="exercise-card__separator">•</span>
          <span
            class="exercise-card__level"
            :class="`exercise-card__level--${task.level.toLowerCase()}`"
          >
            {{ task.level }}
          </span>
        </div>
      </div>
      <button
        class="exercise-card__toggle-button"
        @click="$emit('toggle-expanded', task.task_id)"
        :title="isExpanded ? 'Ukryj szczegóły' : 'Pokaż szczegóły'"
      >
        <img
          v-if="isExpanded"
          class="exercise-card__arrow"
          src="@/assets/up-arrow.png"
          alt="ukryj"
        />
        <img v-else class="exercise-card__arrow" src="@/assets/down-arrow.png" alt="pokaż" />
      </button>
    </div>

    <!-- Wykresy - zawsze widoczne -->
    <div class="exercise-card__charts">
      <!-- Wykres punktów -->
      <div class="points-chart">
        <div class="points-chart__header">
          <h3 class="points-chart__title">Punkty</h3>
          <div class="points-chart__value">{{ task.task_points }}</div>
        </div>
        <div class="points-chart__content">
          <div class="points-chart__dots">
            <span
              v-for="i in 5"
              :key="i"
              class="points-chart__dot"
              :class="{ 'points-chart__dot--earned': i <= task.task_points }"
            ></span>
          </div>
          <div class="points-chart__label">{{ pointsLabel }}</div>
        </div>
      </div>

      <!-- Wykres błędów -->
      <PieChart
        :value="100 - task.task_error * 20"
        title="Poprawność"
        :label="errorLabel"
        unit="%"
        :threshold="80"
        lowColor="#dc2626"
        :colors="[errorColor, '#e2e8f0']"
      />

      <!-- Wykres pewności -->
      <PieChart
        :value="100 - task.task_uncertainty"
        title="Pewność"
        label="odpowiedzi"
        unit="%"
        :threshold="70"
        lowColor="#eab308"
        :colors="['#4f46e5', '#e2e8f0']"
      />

      <!-- Wykres czasu -->
      <div class="time-chart">
        <div class="time-chart__header">
          <h3 class="time-chart__title">Czas rozwiązania</h3>
          <div class="time-chart__value">{{ formatTime(task.time_spent) }}</div>
        </div>
        <div class="time-chart__content">
          <div class="time-chart__bar">
            <div
              class="time-chart__fill"
              :style="{ width: getTimeWidth() + '%' }"
              :class="timeClass"
            ></div>
          </div>
          <div class="time-chart__label">{{ timeLabel }}</div>
        </div>
      </div>
    </div>

    <!-- Rozwijana sekcja szczegółów -->
    <div v-if="isExpanded" class="exercise-card__details">
      <div class="exercise-card__details-grid">
        <div class="exercise-card__detail-item">
          <span class="exercise-card__detail-label">Typ zadania:</span>
          <span class="exercise-card__detail-value">{{ getTaskTypeLabel(task.task_type) }}</span>
        </div>
        <div class="exercise-card__detail-item">
          <span class="exercise-card__detail-label">Poziom trudności:</span>
          <span class="exercise-card__detail-value">
            <span class="difficulty-stars">
              <span v-for="i in 5" :key="i" :class="{ filled: i <= task.difficulty }">
                {{ i <= task.difficulty ? '★' : '☆' }}
              </span>
            </span>
            {{ getDifficultyLabel(task.difficulty) }}
          </span>
        </div>
        <div class="exercise-card__detail-item">
          <span class="exercise-card__detail-label">Status:</span>
          <span class="exercise-card__detail-value">
            <span class="status-badge" :class="statusClass">
              {{ statusText }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import PieChart from './PieChart.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-expanded'])

// Formatowanie czasu
const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) return `${minutes}min`
  return `${minutes}min ${remainingSeconds}s`
}

// Etykiety i klasy dla punktów
const pointsLabel = computed(() => {
  if (props.task.task_points === 0) return 'Brak punktów'
  if (props.task.task_points === 1) return '1 punkt'
  if (props.task.task_points <= 4) return `${props.task.task_points} punkty`
  return `${props.task.task_points} punktów`
})

// Etykiety i kolory dla błędów
const errorLabel = computed(() => {
  if (props.task.task_error === 0) return 'Bezbłędnie'
  if (props.task.task_error === 1) return '1 błąd'
  if (props.task.task_error <= 4) return `${props.task.task_error} błędy`
  return `${props.task.task_error} błędów`
})

const errorColor = computed(() => {
  if (props.task.task_error === 0) return '#10b981'
  if (props.task.task_error <= 1) return '#4f46e5'
  if (props.task.task_error <= 2) return '#eab308'
  return '#dc2626'
})

// Obliczenia dla czasu
const getTimeWidth = () => {
  const seconds = props.task.time_spent / 1000
  // Zakładamy średni czas na zadanie to 60 sekund
  const percentage = (seconds / 60) * 100
  return Math.min(percentage, 100)
}

const timeClass = computed(() => {
  const seconds = props.task.time_spent / 1000
  if (seconds <= 30) return 'time-chart__fill--fast'
  if (seconds <= 60) return 'time-chart__fill--good'
  if (seconds <= 120) return 'time-chart__fill--slow'
  return 'time-chart__fill--very-slow'
})

const timeLabel = computed(() => {
  const seconds = props.task.time_spent / 1000
  if (seconds <= 30) return 'Bardzo szybko'
  if (seconds <= 60) return 'W normie'
  if (seconds <= 120) return 'Wolno'
  return 'Bardzo wolno'
})

// Status zadania
const statusText = computed(() => {
  if (props.task.task_error === 0 && props.task.task_uncertainty === 0) return 'Perfekcyjnie'
  if (props.task.task_error === 0) return 'Poprawnie'
  if (props.task.task_error <= 1) return 'Drobne błędy'
  return 'Do poprawy'
})

const statusClass = computed(() => {
  if (props.task.task_error === 0 && props.task.task_uncertainty === 0)
    return 'status-badge--perfect'
  if (props.task.task_error === 0) return 'status-badge--good'
  if (props.task.task_error <= 1) return 'status-badge--warning'
  return 'status-badge--danger'
})

// Pomocnicze funkcje
const getTaskTypeLabel = (type) => {
  const labels = {
    selection: 'Wybór',
    fill: 'Uzupełnianie',
    matching: 'Łączenie',
    translation: 'Tłumaczenie',
    writing: 'Pisanie',
  }
  return labels[type] || type
}

const getDifficultyLabel = (level) => {
  const labels = {
    1: 'Bardzo łatwe',
    2: 'Łatwe',
    3: 'Średnie',
    4: 'Trudne',
    5: 'Bardzo trudne',
  }
  return labels[level] || 'Średnie'
}
</script>

<style scoped lang="scss">
.exercise-card {
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
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  &__header-left {
    flex: 1;
    margin-right: 1rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem;
    line-height: 1.4;
  }

  &__meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  &__category {
    color: #4f46e5;
    font-weight: 600;
  }

  &__subcategory {
    color: #6b7280;
  }

  &__separator {
    color: #d1d5db;
  }

  &__level {
    padding: 0.125rem 0.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.75rem;

    &--a1 {
      background: #dcfce7;
      color: #166534;
    }

    &--a2 {
      background: #dbeafe;
      color: #1e40af;
    }

    &--b1 {
      background: #fef3c7;
      color: #92400e;
    }

    &--b2 {
      background: #fed7aa;
      color: #9a3412;
    }

    &--c1 {
      background: #fde68a;
      color: #78350f;
    }

    &--c2 {
      background: #fca5a5;
      color: #991b1b;
    }
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
    flex-shrink: 0;

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

  &__details {
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    animation: slideDown 0.3s ease;
  }

  &__details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  &__detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__detail-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  &__detail-value {
    font-size: 1rem;
    color: #374151;
    font-weight: 600;
  }
}

// Wykres punktów
.points-chart {
  width: 320px;
  height: 300px;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }

  &__value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #10b981;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  &__dots {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  &__dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #94a3b8;
    transition: all 0.3s ease;

    &--earned {
      background: #10b981;
      color: white;
      transform: scale(1.1);
    }
  }

  &__label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }
}

// Wykres czasu
.time-chart {
  width: 320px;
  height: 300px;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }

  &__value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #4f46e5;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  &__bar {
    width: 100%;
    height: 12px;
    background: #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  &__fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.3s ease;

    &--fast {
      background: #10b981;
    }
    &--good {
      background: #4f46e5;
    }
    &--slow {
      background: #eab308;
    }
    &--very-slow {
      background: #dc2626;
    }
  }

  &__label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }
}

// Pozostałe style
.difficulty-stars {
  color: #e2e8f0;
  font-size: 1.25rem;
  margin-right: 0.5rem;

  .filled {
    color: #eab308;
  }
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;

  &--perfect {
    background: #dcfce7;
    color: #166534;
  }

  &--good {
    background: #dbeafe;
    color: #1e40af;
  }

  &--warning {
    background: #fef3c7;
    color: #92400e;
  }

  &--danger {
    background: #fee2e2;
    color: #991b1b;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .exercise-card {
    &__charts {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
