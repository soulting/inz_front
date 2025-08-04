<template>
  <div class="chart">
    <div class="chart__header">
      <h3 class="chart__title">Zaangażowanie</h3>
      <div class="chart__value" :class="{ 'chart__value--low': lesson.engagement_score < 50 }">
        {{ Math.round(lesson.engagement_score) }}%
      </div>
    </div>
    <div class="chart__content">
      <div class="engagement-circle">
        <svg class="engagement-circle__svg" viewBox="0 0 100 100">
          <circle class="engagement-circle__bg" cx="50" cy="50" r="40" />
          <circle
            class="engagement-circle__progress"
            :class="{ 'engagement-circle__progress--low': lesson.engagement_score < 50 }"
            cx="50"
            cy="50"
            r="40"
            :stroke-dasharray="`${lesson.engagement_score * 2.513} 251.3`"
          />
        </svg>
        <div class="engagement-circle__text">
          <span class="engagement-circle__description">uczniów</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lesson: Object,
})
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

    &--low {
      color: #dc2626;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
}

.engagement-circle {
  position: relative;
  width: 160px;
  height: 160px;

  &__svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  &__bg {
    fill: none;
    stroke: #e2e8f0;
    stroke-width: 8;
  }

  &__progress {
    fill: none;
    stroke: #4f46e5;
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dasharray 0.3s ease;

    &--low {
      stroke: #dc2626;
    }
  }

  &__text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &__description {
    font-size: 1rem;
    color: #64748b;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .chart {
    width: 100%;
    max-width: 350px;
  }
}
</style>
