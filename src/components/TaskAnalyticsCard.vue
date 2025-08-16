<template>
  <div class="task-analytics-card">
    <!-- Nagłówek zadania -->
    <div class="task-analytics-card__header">
      <div class="task-analytics-card__header-info">
        <h3 class="task-analytics-card__title">{{ task.question }}</h3>
        <div class="task-analytics-card__meta">
          <span class="meta-item">
            <span class="meta-label">Poziom:</span>
            <span class="meta-value">{{ task.level }}</span>
          </span>
          <span class="meta-item">
            <span class="meta-label">Kategoria:</span>
            <span class="meta-value">{{ task.main_category }}</span>
          </span>
          <span class="meta-item">
            <span class="meta-label">Typ:</span>
            <span class="meta-value">{{ task.task_type }}</span>
          </span>
          <span class="meta-item">
            <span class="meta-label">Trudność:</span>
            <span class="meta-value">{{ getDifficultyText }}</span>
          </span>
        </div>
      </div>
      <button
        class="task-analytics-card__toggle-button"
        @click="toggleExpanded"
        :title="isExpanded ? 'Ukryj szczegóły' : 'Pokaż szczegóły'"
      >
        <img
          v-if="isExpanded"
          class="task-analytics-card__arrow"
          src="@/assets/up-arrow.png"
          alt="ukryj"
        />
        <img v-else class="task-analytics-card__arrow" src="@/assets/down-arrow.png" alt="pokaż" />
      </button>
    </div>

    <!-- Wykresy główne - zawsze widoczne -->
    <div class="task-analytics-card__charts">
      <PieChart
        :value="successRate"
        title="Poprawne"
        :colors="['#10b981', '#e2e8f0']"
        size="small"
      />
      <PieChart
        :value="errorPercentage"
        title="Błędy"
        :colors="['#ef4444', '#e2e8f0']"
        size="small"
      />
      <PieChart
        :value="uncertaintyPercentage"
        title="Niepewne"
        :colors="['#f59e0b', '#e2e8f0']"
        size="small"
      />
    </div>

    <!-- Dodatkowe metryki w kompaktowej formie -->
    <div class="task-analytics-card__quick-stats">
      <div class="quick-stat">
        <span class="stat-label">Ukończyło:</span>
        <span class="stat-value">{{ actualStudentsCount }}/{{ task.students_count }}</span>
      </div>
      <div class="quick-stat">
        <span class="stat-label">Śr. czas:</span>
        <span class="stat-value">{{ formatTime(averageTimePerStudent) }}</span>
      </div>

      <div class="quick-stat">
        <span class="stat-label">Śr. trudność:</span>
        <span class="stat-value">{{ averageStudentDifficulty }}/5</span>
      </div>
    </div>

    <!-- Rozwijana sekcja szczegółów -->
    <div v-if="isExpanded" class="task-analytics-card__details">
      <!-- Tabela wyników uczniów -->
      <div
        v-if="task.student_results && task.student_results.length > 0"
        class="task-analytics-card__results"
      >
        <h4 class="section-title">Wyniki uczniów</h4>
        <table class="results-table">
          <thead>
            <tr>
              <th>Uczeń</th>
              <th>Wynik</th>
              <th>Poprawne</th>
              <th>Błędy</th>
              <th>Niepewne</th>
              <th>Czas</th>
              <th>Trudność</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in sortedStudentResults" :key="student.user_id">
              <td class="student-name">{{ student.student_name }}</td>
              <td>
                <span class="score-badge" :class="getScoreClass(student)">
                  {{ getStudentScore(student) }}/{{ maxPoints }}
                </span>
              </td>
              <td>
                <span class="percentage" :class="getScoreClass(student)">
                  {{ student.task_points }}
                </span>
              </td>
              <td>
                <span v-if="student.task_error > 0" class="error-count">
                  {{ student.task_error }}
                </span>
                <span v-else class="no-errors">0</span>
              </td>
              <td>
                <span v-if="student.task_uncertainty > 0" class="uncertainty-count">
                  {{ student.task_uncertainty }}
                </span>
                <span v-else class="no-uncertainty">0</span>
              </td>
              <td>{{ formatTime(student.time_spent) }}</td>
              <td>
                <span class="difficulty-badge">{{ student.difficulty }}/5</span>
              </td>
              <td class="date-cell">{{ formatShortDate(student.completion_date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import PieChart from './PieChart.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

// Wewnętrzny stan rozwijania
const isExpanded = ref(false)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

// Rzeczywista liczba uczniów którzy ukończyli zadanie
const actualStudentsCount = computed(() => {
  return props.task.student_results ? props.task.student_results.length : 0
})

// Maksymalna liczba punktów dla całego zadania (suma: poprawne + błędy + niepewność)
const maxPoints = computed(() => {
  return props.task.task_points + props.task.task_error + props.task.task_uncertainty
})

// Funkcja pomocnicza do obliczenia punktów ucznia
const getStudentScore = (student) => {
  // Punkty ucznia to jego task_points (poprawne odpowiedzi)
  return student.task_points
}

// Funkcja do obliczenia procentu sukcesu ucznia
const getStudentSuccessRate = (student) => {
  return Math.round((student.task_points / maxPoints.value) * 100)
}

// Ogólny wskaźnik sukcesu (% poprawnych odpowiedzi)
const successRate = computed(() => {
  if (!maxPoints.value) return 0
  return Math.round((props.task.task_points / maxPoints.value) * 100)
})

// Średni wskaźnik sukcesu per uczeń
const avgStudentSuccessRate = computed(() => {
  if (!props.task.student_results || props.task.student_results.length === 0) {
    return successRate.value
  }
  const sum = props.task.student_results.reduce(
    (acc, student) => acc + getStudentSuccessRate(student),
    0,
  )
  return Math.round(sum / props.task.student_results.length)
})

// Procent błędów z całości
const errorPercentage = computed(() => {
  if (!maxPoints.value) return 0
  return Math.round((props.task.task_error / maxPoints.value) * 100)
})

// Procent niepewności z całości
const uncertaintyPercentage = computed(() => {
  if (!maxPoints.value) return 0
  return Math.round((props.task.task_uncertainty / maxPoints.value) * 100)
})

// Średni czas na ucznia
const averageTimePerStudent = computed(() => {
  if (!actualStudentsCount.value) return 0
  return Math.round(props.task.time_spent / actualStudentsCount.value)
})

// Średnia subiektywna trudność od uczniów
const averageStudentDifficulty = computed(() => {
  if (!props.task.student_results || props.task.student_results.length === 0) {
    return props.task.difficulty
  }
  const sum = props.task.student_results.reduce((acc, student) => acc + student.difficulty, 0)
  return (sum / props.task.student_results.length).toFixed(1)
})

// Posortowani uczniowie (od najlepszego)
const sortedStudentResults = computed(() => {
  if (!props.task.student_results) return []
  return [...props.task.student_results].sort((a, b) => {
    return getStudentScore(b) - getStudentScore(a)
  })
})

// Funkcje pomocnicze
const formatTime = (seconds) => {
  if (!seconds || seconds < 60) {
    return `${seconds || 0}s`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
}

const formatShortDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getDifficultyText = computed(() => {
  const success = avgStudentSuccessRate.value
  if (success >= 80) return 'Łatwe'
  if (success >= 60) return 'Średnie'
  return 'Trudne'
})

const getScoreClass = (student) => {
  const percentage = getStudentSuccessRate(student)
  if (percentage >= 80) return 'high'
  if (percentage >= 60) return 'medium'
  return 'low'
}
</script>

<style scoped lang="scss">
.task-analytics-card {
  margin: 8px 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;

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

  &__header {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f3f4f6;
  }

  &__header-info {
    flex: 1;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 6px 0;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .meta-item {
      font-size: 0.875rem;

      .meta-label {
        color: #6b7280;
      }

      .meta-value {
        color: #374151;
        font-weight: 500;
        margin-left: 4px;
      }
    }
  }

  &__charts {
    padding: 16px;
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    background: white;
    border-bottom: 1px solid #f3f4f6;
  }

  &__quick-stats {
    padding: 8px 16px;
    display: flex;
    gap: 24px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.875rem;

    .quick-stat {
      display: flex;
      align-items: center;
      gap: 6px;

      .stat-label {
        color: #6b7280;
      }

      .stat-value {
        font-weight: 600;
        color: #111827;
      }
    }
  }

  &__details {
    padding: 16px;
    background: white;
    animation: slideDown 0.2s ease-out;
  }

  &__question {
    padding: 12px;
    background: #f0f9ff;
    border-left: 3px solid #3b82f6;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 0.925rem;
    color: #1e40af;

    strong {
      font-weight: 600;
      color: #1e3a8a;
    }
  }

  &__results {
    margin-bottom: 16px;

    .section-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 12px 0;
    }

    .results-table {
      width: 100%;
      font-size: 0.875rem;
      border-collapse: collapse;

      thead {
        background: #f9fafb;

        th {
          padding: 8px 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
      }

      tbody {
        tr {
          border-bottom: 1px solid #f3f4f6;

          &:hover {
            background: #f9fafb;
          }

          td {
            padding: 8px 12px;
            color: #374151;

            &.student-name {
              font-weight: 500;
              color: #111827;
            }

            &.date-cell {
              color: #6b7280;
              font-size: 0.8rem;
            }
          }
        }
      }

      .score-badge {
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.85rem;

        &.high {
          background: #d1fae5;
          color: #065f46;
        }

        &.medium {
          background: #fed7aa;
          color: #92400e;
        }

        &.low {
          background: #fee2e2;
          color: #991b1b;
        }
      }

      .percentage {
        font-weight: 600;

        &.high {
          color: #059669;
        }

        &.medium {
          color: #d97706;
        }

        &.low {
          color: #dc2626;
        }
      }

      .error-count {
        color: #dc2626;
        font-weight: 500;
      }

      .uncertainty-count {
        color: #d97706;
        font-weight: 500;
      }

      .no-errors,
      .no-uncertainty {
        color: #d1d5db;
      }

      .difficulty-badge {
        padding: 2px 6px;
        background: #f3f4f6;
        border-radius: 4px;
        font-size: 0.8rem;
      }
    }
  }

  &__summary {
    padding: 12px;
    background: #f9fafb;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;

      .summary-label {
        color: #6b7280;
      }

      .summary-value {
        font-weight: 600;
        color: #111827;

        &.best {
          color: #059669;
        }

        &.difficulty-text {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;

          &.easy {
            background: #d1fae5;
            color: #065f46;
          }

          &.medium {
            background: #fef3c7;
            color: #92400e;
          }

          &.hard {
            background: #fee2e2;
            color: #991b1b;
          }
        }
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

// Responsive design
@media (max-width: 768px) {
  .task-analytics-card {
    &__meta {
      flex-direction: column;
      gap: 4px;
    }

    &__metrics {
      flex-wrap: wrap;
      gap: 16px;

      .metric {
        min-width: calc(50% - 8px);
      }
    }

    &__results {
      overflow-x: auto;

      .results-table {
        min-width: 600px;
      }
    }
  }
}

@media (max-width: 480px) {
  .task-analytics-card {
    &__header {
      padding: 10px 12px;
    }

    &__metrics {
      padding: 10px 12px;

      .metric {
        min-width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }

    &__details {
      padding: 12px;
    }
  }
}
</style>
