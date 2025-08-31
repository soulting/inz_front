<template>
  <div class="test-summary">
    <div class="test-summary__container">
      <!-- Header z gratulacjami -->
      <div class="test-summary__header">
        <h1 class="test-summary__title">Test zakończony!</h1>
        <p class="test-summary__subtitle">Gratulacje! Oto Twoje wyniki:</p>
      </div>

      <!-- Główne statystyki -->
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

      <!-- Szczegółowe statystyki -->
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

      <!-- Najlepsze i najgorsze kategorie -->
      <div v-if="bestCategories.length || worstCategories.length" class="test-summary__categories">
        <!-- Najlepsze umiejętności -->
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

        <!-- Najgorsze umiejętności -->
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

      <!-- Podsumowanie -->
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

      <!-- Przycisk zakończenia -->
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
  testAnswers: Object,
  analysisResults: Object, // 🆕 NOWY PROP
})

// Proste obliczenia bez skomplikowanych analiz
const maxPoints = computed(() =>
  props.testAnswers.answers.reduce((sum, answer) => sum + answer.scoredAnswers.length, 0),
)

// Prosty procent poprawności: punkty / max punkty
const simplePercentage = computed(() => {
  if (maxPoints.value === 0) return 0
  return Math.round((props.testAnswers.totalPoints / maxPoints.value) * 100)
})

// Średni czas na zadanie
const averageTimePerTask = computed(() => {
  if (props.testAnswers.answers.length === 0) return 0
  return Math.round(props.testAnswers.totalTime / props.testAnswers.answers.length)
})

// Analiza kategorii bezpośrednio z testAnswers
const categoryAnalysis = computed(() => {
  const categories = {}

  // Zbierz statystyki po sub_category
  props.testAnswers.answers.forEach((answer) => {
    const key = answer.sub_category || 'Nieznana kategoria'

    if (!categories[key]) {
      categories[key] = {
        name: key,
        totalPoints: 0,
        totalPossible: 0,
      }
    }

    categories[key].totalPoints += answer.taskPoints
    categories[key].totalPossible += answer.scoredAnswers.length
  })

  // Oblicz procenty i posortuj
  const categoryList = Object.values(categories)
    .map((cat) => ({
      ...cat,
      percentage: Math.round((cat.totalPoints / cat.totalPossible) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)

  return categoryList
})

// Najlepsze kategorie (top 3)
const bestCategories = computed(() => {
  return categoryAnalysis.value.slice(0, 3)
})

// Najgorsze kategorie (bottom 3, tylko jeśli jest więcej niż 3)
const worstCategories = computed(() => {
  if (categoryAnalysis.value.length <= 3) return []
  return categoryAnalysis.value.slice(-3).reverse() // reverse żeby najgorsze było pierwsze
})
</script>
