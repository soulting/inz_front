<template>
  <div class="expandable-wrapper" :class="{ 'expandable-wrapper--open': isExpanded }">
    <div class="expandable-content">
      <hr class="horizontal-line" />
      <div class="table-container">
        <h3 class="table-title">Szczegóły uczniów</h3>
        <div class="table-wrapper">
          <table class="details-table">
            <thead>
              <tr>
                <th>Uczeń</th>
                <th>Trudność</th>
                <th>Zaangażowanie (%)</th>
                <th>Czas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in lesson.users" :key="user.user_id" class="table-row">
                <td class="table-cell table-cell--name">
                  {{ user.user_name }}
                </td>
                <td class="table-cell">
                  <span class="difficulty-badge">{{ user.difficulty }}</span>
                </td>
                <td class="table-cell">
                  <span
                    class="engagement-score"
                    :class="{
                      'engagement-score--low': user.engagement_score < 50,
                    }"
                  >
                    {{ user.engagement_score.toFixed(2) }}%
                  </span>
                </td>
                <td class="table-cell">{{ formatTime(user.time_on_page) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lesson: Object,
  isExpanded: Boolean,
})

function formatTime(seconds) {
  const roundedSeconds = Math.round(seconds)

  if (roundedSeconds < 60) {
    return `${roundedSeconds}s`
  }

  const minutes = Math.floor(roundedSeconds / 60)
  const remainingSeconds = roundedSeconds % 60

  if (remainingSeconds === 0) {
    return `${minutes}min`
  }

  return `${minutes}min ${remainingSeconds}s`
}
</script>

<style scoped lang="scss">
.expandable-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 300ms ease;

  &--open {
    grid-template-rows: 1fr;
  }
}

.expandable-content {
  min-height: 0;
}

.horizontal-line {
  height: 1px;
  border: none;
  background-color: #e5e7eb;
  margin: 1rem 0;
}

.table-container {
  margin-top: 1rem;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  margin-left: 10px;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.details-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: white;

  th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
    padding: 1rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.table-row {
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
}

.table-cell {
  padding: 0.875rem 0.75rem;
  color: #374151;

  &--name {
    font-weight: 500;
    color: #1f2937;
  }
}

.difficulty-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 600;
}

.engagement-score {
  font-weight: 500;
  color: #059669;

  &--low {
    color: #dc2626;
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .table-wrapper {
    font-size: 0.8rem;
  }
}
</style>
