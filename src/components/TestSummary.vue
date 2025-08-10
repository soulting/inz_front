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

<style scoped lang="scss">
.test-summary {
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &__container {
    max-width: 1000px;
    width: 100%;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  &__header {
    text-align: center;
    padding: 3rem 2rem 2rem;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: white;
    position: relative;
  }

  &__success-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    font-size: 3rem;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: white;
  }

  &__subtitle {
    font-size: 1.125rem;
    opacity: 0.9;
    margin: 0;
  }

  &__main-stats {
    padding: 3rem 2rem;
    display: flex;
    justify-content: center;
  }

  &__score-card {
    display: flex;
    align-items: center;
    gap: 2rem;
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
  }

  &__progress-container {
    flex-shrink: 0;
  }

  &__score-details {
    text-align: center;
  }

  &__percentage {
    font-size: 3rem;
    font-weight: 700;
    color: #4f46e5;
    line-height: 1;
  }

  &__percentage-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  &__points {
    font-size: 1rem;
    color: #6b7280;
    font-weight: 500;
  }

  &__stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    padding: 0 2rem 2rem;
  }

  &__stat-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  &__stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
      font-size: 1.5rem;
    }

    &--level {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
    }

    &--errors {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    &--time {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      color: white;
    }

    &--tasks {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }
  }

  &__stat-content {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  &__stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    margin-top: 0.25rem;
  }

  // Style dla kategorii
  &__categories {
    padding: 2rem;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }

  &__category-section {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__category-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  &__category-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    border: 2px solid;

    &--best {
      background: #f0fdf4;
      border-color: #22c55e;
    }

    &--improve {
      background: #fef3c7;
      border-color: #f59e0b;
    }
  }

  &__category-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.95rem;
  }

  &__category-score {
    font-weight: 700;
    font-size: 1.1rem;
    color: #1e293b;
  }

  &__conclusion {
    padding: 2rem;
    background: #f0f9ff;
    border-top: 1px solid #e0f2fe;
  }

  &__conclusion-text {
    text-align: center;
    font-size: 1.125rem;
    color: #0f172a;
    font-weight: 500;
    line-height: 1.6;
  }

  &__finish-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
  }

  &__finish-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 600;
    background: #4f46e5;
    color: white;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);

    &:hover {
      background: #4338ca;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__finish-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  &__finish-btn:hover i {
    transform: translateX(2px);
  }
}

// Responsive design
@media (max-width: 768px) {
  .test-summary {
    padding: 1rem;

    &__container {
      max-width: 100%;
    }

    &__header {
      padding: 2rem 1rem 1.5rem;
    }

    &__title {
      font-size: 2rem;
    }

    &__main-stats {
      padding: 2rem 1rem;
    }

    &__score-card {
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    &__stats-grid {
      grid-template-columns: 1fr;
      padding: 0 1rem 1.5rem;
      gap: 1rem;
    }

    &__analysis {
      padding: 1.5rem;
    }

    &__skills-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    &__skill-card {
      padding: 1.25rem;
    }

    &__categories {
      padding: 1.5rem;
    }

    &__category-item {
      padding: 0.875rem 1rem;
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;

      &--best,
      &--improve {
        border-width: 1px;
      }
    }

    &__category-name {
      font-size: 0.9rem;
    }

    &__category-score {
      font-size: 1.25rem;
    }

    &__conclusion {
      padding: 1.5rem;
    }

    &__conclusion-text {
      font-size: 1rem;
    }

    &__finish-container {
      padding: 1.5rem;
    }

    &__finish-btn {
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
    }
  }
}

@media (max-width: 480px) {
  .test-summary {
    &__success-icon {
      width: 60px;
      height: 60px;

      svg {
        width: 30px;
        height: 30px;
      }
    }

    &__percentage {
      font-size: 2.5rem;
    }

    &__stat-icon {
      width: 40px;
      height: 40px;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    &__stat-value {
      font-size: 1.25rem;
    }

    &__analysis {
      padding: 1rem;
    }

    &__skill-card {
      padding: 1rem;
    }
  }
}
</style>
