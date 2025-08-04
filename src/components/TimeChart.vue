<template>
  <div class="chart">
    <div class="chart__header">
      <h3 class="chart__title">Czas spędzony</h3>
      <div class="chart__value">
        {{ Math.round((lesson.time_on_page / lesson.expected_time) * 100) }}%
      </div>
    </div>
    <div class="chart__content">
      <div class="time-display">
        <div class="time-display__item">
          <span class="time-display__value">{{ formatTime(lesson.time_on_page) }}</span>
          <span class="time-display__label">Rzeczywisty</span>
        </div>
        <div class="time-display__separator">/</div>
        <div class="time-display__item">
          <span class="time-display__value">{{ formatTime(lesson.expected_time) }}</span>
          <span class="time-display__label">Oczekiwany</span>
        </div>
      </div>
      <div class="progress-container">
        <div class="progress-bar">
          <div
            class="progress-bar__fill"
            :style="{
              width: Math.min(100, (lesson.time_on_page / lesson.expected_time) * 100) + '%',
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lesson: Object,
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
.chart {
  width: 320px;
  height: 300px;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

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
}

.time-display {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.5rem;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__value {
    font-size: 1.4rem;
    font-weight: 700;
    color: #374151;
    line-height: 1;
  }

  &__label {
    font-size: 0.85rem;
    color: #64748b;
    margin-top: 0.25rem;
    font-weight: 500;
  }

  &__separator {
    font-size: 1.5rem;
    font-weight: 300;
    color: #94a3b8;
  }
}

.progress-container {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  overflow: hidden;

  &__fill {
    height: 100%;
    background: #4f46e5;
    border-radius: 5px;
    transition: width 0.3s ease;
  }
}

@media (max-width: 768px) {
  .chart {
    width: 100%;
    max-width: 350px;
  }
}
</style>
