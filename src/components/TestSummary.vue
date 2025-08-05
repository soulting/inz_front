<template>
  <div class="test-summary">
    <div class="test-summary__container">
      <!-- Header z gratulacjami -->
      <div class="test-summary__header">
        <div class="test-summary__success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <h1 class="test-summary__title">Test zakończony!</h1>
        <p class="test-summary__subtitle">Gratulacje! Oto Twoje wyniki:</p>
      </div>

      <!-- Główne statystyki -->
      <div class="test-summary__main-stats">
        <div class="test-summary__score-card">
          <div class="test-summary__progress-container">
            <CircularProgressBar :progress="percentageCorrect" />
          </div>
          <div class="test-summary__score-details">
            <div class="test-summary__percentage">{{ percentageCorrect }}%</div>
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
          <div class="test-summary__stat-icon test-summary__stat-icon--level">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </div>
          <div class="test-summary__stat-content">
            <div class="test-summary__stat-value">{{ testAnswers.level }}</div>
            <div class="test-summary__stat-label">Poziom</div>
          </div>
        </div>

        <div class="test-summary__stat-card">
          <div class="test-summary__stat-icon test-summary__stat-icon--errors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div class="test-summary__stat-content">
            <div class="test-summary__stat-value">{{ testAnswers.totalErrors }}</div>
            <div class="test-summary__stat-label">Błędów</div>
          </div>
        </div>

        <div class="test-summary__stat-card">
          <div class="test-summary__stat-icon test-summary__stat-icon--time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </div>
          <div class="test-summary__stat-content">
            <div class="test-summary__stat-value">
              {{ Math.floor(testAnswers.totalTime / 60) }}:{{
                (testAnswers.totalTime % 60).toString().padStart(2, '0')
              }}
            </div>
            <div class="test-summary__stat-label">Czas</div>
          </div>
        </div>

        <div class="test-summary__stat-card">
          <div class="test-summary__stat-icon test-summary__stat-icon--tasks">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
          </div>
          <div class="test-summary__stat-content">
            <div class="test-summary__stat-value">{{ testAnswers.answers.length }}</div>
            <div class="test-summary__stat-label">Zadań</div>
          </div>
        </div>
      </div>

      <!-- Podsumowanie -->
      <div class="test-summary__conclusion">
        <div class="test-summary__conclusion-text">
          <template v-if="percentageCorrect >= 80">
            🎉 Świetny wynik! Twoja wiedza z języka niemieckiego jest na wysokim poziomie.
          </template>
          <template v-else-if="percentageCorrect >= 60">
            👏 Dobra robota! Masz solidne podstawy, które warto rozwijać dalej.
          </template>
          <template v-else>
            💪 Nie martw się! Każdy początek jest trudny. Czas na naukę i przygodę z językiem
            niemieckim!
          </template>
        </div>
      </div>

      <!-- Przycisk zakończenia -->
      <RouterLink to="/" class="test-summary__finish-btn">
        <span>Powrót do strony głównej</span>
        <svg
          class="test-summary__finish-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import CircularProgressBar from './CircularProgressBar.vue'

const props = defineProps({
  testAnswers: Object,
})

// Maksymalna liczba punktów = liczba wszystkich odpowiedzi (bo każda jest punktowana binarnie)
const maxPoints = computed(() =>
  props.testAnswers.answers.reduce((sum, answer) => sum + answer.scoredAnswers.length, 0),
)

const percentageCorrect = computed(() => {
  if (maxPoints.value === 0) return 0
  return Math.round((props.testAnswers.totalPoints / maxPoints.value) * 100)
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
    max-width: 900px;
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

    svg {
      width: 40px;
      height: 40px;
      stroke-width: 3;
    }
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

    svg {
      width: 24px;
      height: 24px;
      stroke-width: 2;
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

  &__finish-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin: 2rem auto 3rem;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 600;
    background: #4f46e5;
    color: white;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    justify-content: center;
    width: fit-content;
    display: flex;

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

  &__finish-btn:hover &__finish-icon {
    transform: translateX(2px);
  }
}

// Responsive design
@media (max-width: 768px) {
  .test-summary {
    padding: 1rem;

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

    &__stat-card {
      padding: 1.25rem;
    }

    &__conclusion {
      padding: 1.5rem;
    }

    &__conclusion-text {
      font-size: 1rem;
    }

    &__finish-btn {
      margin: 1.5rem auto 2rem;
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
  }
}
</style>
