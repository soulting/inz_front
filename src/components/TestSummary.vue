<template>
  <div class="test-summary">
    <div class="test-summary__container">
      <div class="test-summary__header">
        <h1 class="test-summary__title">Test zakończony!</h1>
        <p class="test-summary__subtitle">Gratulacje! Oto Twoje wyniki:</p>
      </div>

      <div class="test-summary__main-stats">
        <div class="test-summary__score-card">
          <div class="test-summary__progress-container">
            <CircularProgressBar :progress="simplePercentage" />
          </div>
          <div class="test-summary__score-details">
            <div class="test-summary__percentage">{{ simplePercentage }}%</div>
            <div class="test-summary__percentage-label">Poprawność</div>
            <div class="test-summary__points">
              {{ testAnswers.totalPoints }}/{{ maxPoints }} punktów
            </div>
          </div>
        </div>
      </div>

      <div class="test-summary__stats-grid">
        <div class="test-summary__stat-card">
          <div class="test-summary__stat-content">
            <div class="test-summary__stat-value">{{ testAnswers.level }}</div>
            <div class="test-summary__stat-label">Poziom</div>
          </div>
        </div>

        <div class="test-summary__stat-card">
          <div class="test-summary__stat-content">
            <div class="test-summary__stat-value">{{ testAnswers.totalErrors }}</div>
            <div class="test-summary__stat-label">Błędów</div>
          </div>
        </div>

        <div class="test-summary__stat-card">
          <div class="test-summary__stat-content">
            <div class="test-summary__stat-value">{{ averageTimePerTask }}s</div>
            <div class="test-summary__stat-label">Średni czas/zadanie</div>
          </div>
        </div>

        <div class="test-summary__stat-card">
          <div class="test-summary__stat-content">
            <div class="test-summary__stat-value">{{ testAnswers.totalUncertainty }}</div>
            <div class="test-summary__stat-label">Niepewnych</div>
          </div>
        </div>
      </div>

      <div v-if="bestCategories.length || worstCategories.length" class="test-summary__categories">
        <div v-if="bestCategories.length" class="test-summary__category-section">
          <h3 class="test-summary__category-title">Twoje najmocniejsze strony</h3>
          <div class="test-summary__category-list">
            <div
              v-for="(category, index) in bestCategories"
              :key="`best-${index}`"
              class="test-summary__category-item test-summary__category-item--best"
            >
              <div class="test-summary__category-name">{{ category.name }}</div>
              <div class="test-summary__category-score">{{ category.percentage }}%</div>
            </div>
          </div>
        </div>

        <div v-if="worstCategories.length" class="test-summary__category-section">
          <h3 class="test-summary__category-title">Obszary do poprawy</h3>
          <div class="test-summary__category-list">
            <div
              v-for="(category, index) in worstCategories"
              :key="`worst-${index}`"
              class="test-summary__category-item test-summary__category-item--improve"
            >
              <div class="test-summary__category-name">{{ category.name }}</div>
              <div class="test-summary__category-score">{{ category.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div class="test-summary__conclusion">
        <div class="test-summary__conclusion-text">
          <template v-if="simplePercentage >= 80">
            Świetny wynik! Twoja wiedza z języka niemieckiego jest na wysokim poziomie.
          </template>
          <template v-else-if="simplePercentage >= 60">
            Dobra robota! Masz solidne podstawy, które warto rozwijać dalej.
          </template>
          <template v-else>
            Nie martw się! Każdy początek jest trudny. Czas na naukę i przygodę z językiem
            niemieckim!
          </template>
        </div>
      </div>

      <div class="test-summary__finish-container">
        <RouterLink to="/" class="test-summary__finish-btn">
          <span>Powrót do strony głównej</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import CircularProgressBar from './CircularProgressBar.vue'

const props = defineProps({
  analysisResults: {
    type: Object,
    required: true,
  },
})

const overall = computed(() => props.analysisResults.analysis.overall_stats)
const subcategories = computed(() => props.analysisResults.analysis.subcategories_list || [])

const simplePercentage = computed(() => overall.value.percentage)
const averageTimePerTask = computed(() => overall.value.avg_time_per_task)
const testAnswers = computed(() => ({
  level: props.analysisResults.level,
  totalErrors: overall.value.total_errors,
  totalPoints: overall.value.total_points,
  totalUncertainty: overall.value.total_uncertainty,
}))

const bestCategories = computed(() =>
  subcategories.value
    .slice()
    .sort((a, b) => b.weighted_score - a.weighted_score)
    .slice(0, 3)
    .map((s) => ({
      name: s.full_name,
      percentage: s.percentage,
    })),
)

const worstCategories = computed(() =>
  subcategories.value
    .slice()
    .sort((a, b) => a.weighted_score - b.weighted_score)
    .slice(0, 3)
    .map((s) => ({
      name: s.full_name,
      percentage: s.percentage,
    })),
)
</script>
