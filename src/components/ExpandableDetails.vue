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
