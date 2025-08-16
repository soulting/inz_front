<template>
  <div class="class-performance">
    <div class="class-performance__header">
      <h1 class="class-performance__title">
        {{ 'Analiza wyników klasy' }}
      </h1>
    </div>

    <!-- Results -->
    <div v-if="performanceData" class="class-performance__content">
      <!-- Info panel -->
      <div class="class-performance__info">
        <div class="class-performance__info-item">
          <span class="class-performance__info-label">Uczniowie:</span>
          <span class="class-performance__info-value">{{
            performanceData.class_info?.total_students || 0
          }}</span>
        </div>
        <div class="class-performance__info-item">
          <span class="class-performance__info-label">Wyniki przeanalizowane:</span>
          <span class="class-performance__info-value">{{
            performanceData.class_info?.total_results_analyzed || 0
          }}</span>
        </div>
        <div class="class-performance__info-item">
          <span class="class-performance__info-label">Poziom:</span>
          <span class="class-performance__info-value">{{
            performanceData.class_info?.level || 'N/A'
          }}</span>
        </div>
      </div>

      <!-- Subcategories list with collapsible functionality -->
      <div class="class-performance__categories">
        <div class="class-performance__categories-header">
          <h2 class="class-performance__categories-title">Kategorie:</h2>
          <button class="class-performance__toggle-button" @click="toggleExpended">
            <img
              v-if="isExpended"
              class="class-performance__arrow"
              src="@/assets/up-arrow.png"
              alt=""
            />
            <img v-else class="class-performance__arrow" src="@/assets/down-arrow.png" alt="" />
          </button>
        </div>
        <div
          class="class-performance__categories-content"
          :class="{ 'class-performance__categories-content--open': isExpended }"
        >
          <div class="class-performance__categories-expandable">
            <div v-if="subcategories.length === 0" class="class-performance__no-data">
              Brak danych do analizy
            </div>
            <div v-else class="class-performance__categories-grid">
              <div
                v-for="category in subcategories"
                :key="`${category.main_category}-${category.sub_category}`"
                class="class-performance__category-card"
                :class="getCategoryCardClass(category.score_percentage)"
              >
                <!-- Category info -->
                <div class="class-performance__category-header">
                  <div class="class-performance__category-main">
                    {{ category.main_category }}
                  </div>
                  <div class="class-performance__category-sub">
                    {{ category.sub_category }}
                  </div>
                </div>
                <!-- Stats -->
                <div class="class-performance__category-stats">
                  <div class="class-performance__stat">
                    <span class="class-performance__stat-label">Poprawność:</span>
                    <span
                      class="class-performance__stat-value class-performance__stat-value--score"
                    >
                      {{ category.score_percentage }}%
                    </span>
                  </div>

                  <div class="class-performance__stat">
                    <span class="class-performance__stat-label">Błędy:</span>
                    <span
                      class="class-performance__stat-value class-performance__stat-value--error"
                    >
                      {{ category.error_rate }}%
                    </span>
                  </div>

                  <div class="class-performance__stat">
                    <span class="class-performance__stat-label">Niepewność:</span>
                    <span
                      class="class-performance__stat-value class-performance__stat-value--uncertainty"
                    >
                      {{ category.uncertainty_rate }}%
                    </span>
                  </div>

                  <div class="class-performance__stat">
                    <span class="class-performance__stat-label">Trudność:</span>
                    <span
                      class="class-performance__stat-value class-performance__stat-value--difficulty"
                    >
                      {{ category.difficulty }}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  performanceData: Object,
})

const isExpended = ref(false) // Domyślnie zwinięte
const subcategories = computed(() => props.performanceData?.subcategories || [])

function getCategoryCardClass(scorePercentage) {
  if (scorePercentage < 50) return 'class-performance__category-card--critical'
  if (scorePercentage < 70) return 'class-performance__category-card--warning'
  return 'class-performance__category-card--good'
}

function toggleExpended() {
  isExpended.value = !isExpended.value
}
</script>

<style scoped lang="scss">
.class-performance {
  display: flex;
  flex-direction: column;
  margin: 12px 0;
  padding: 20px;
  border-radius: 16px;
  background: white;
  border: 0.5px solid rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
  color: #1f2937;
  max-width: 1600px;
  margin: 12px auto;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin: 5px 50px;
  }

  &__loading,
  &__no-data {
    /* Moved styles to individual selectors above */
  }

  &__loading {
    color: #6b7280;
    font-style: italic;
    text-align: center;
    padding: 4rem 2rem;
    font-size: 1.1rem;
  }

  &__no-data {
    color: #6b7280;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-align: center;
    padding: 4rem 2rem;
    font-size: 1.1rem;
  }

  &__info {
    display: flex;
    gap: 1.5rem;
    margin: 16px 0;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  &__info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__info-label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  &__info-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
  }

  &__categories-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  &__categories-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0 auto 0 0;
  }

  &__toggle-button {
    width: 42px;
    height: 42px;
    border: 0.5px solid #333;
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #f0f0f0;
    }
  }

  &__arrow {
    width: 16px;
    height: 16px;
  }

  &__categories-content {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows 300ms;

    &--open {
      grid-template-rows: 1fr;
    }
  }

  &__categories-expandable {
    min-height: 0;
  }

  &__categories-grid {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
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

  &__category-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    border: 1px solid #e5e7eb;
    position: relative;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
      background-color: #f9fafb;
    }

    &--critical {
      border-color: rgba(220, 38, 38, 0.4);
    }

    &--warning {
      border-color: rgba(217, 119, 6, 0.4);
    }

    &--good {
      border-color: rgba(5, 150, 105, 0.4);
    }
  }

  &__category-priority {
    position: absolute;
    top: -8px;
    right: 16px;
    background: #4f46e5;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 700;
  }

  &__category-header {
    flex-grow: 1;
  }

  &__category-main {
    font-size: 0.75rem; // Powrót do oryginalnego rozmiaru
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 0.25rem; // Powrót do oryginalnego marginesu
  }

  &__category-sub {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  &__category-stats {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__stat {
    background: transparent;
    border: none;
    padding: 6px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2px;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background-color: #e0e7ff;
      transform: scale(1.05);
    }
  }

  &__stat-label {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
  }

  &__stat-value {
    font-weight: 600;
    font-size: 1rem;

    &--score {
      color: #059669;
    }

    &--error {
      color: #dc2626;
    }

    &--uncertainty {
      color: #d97706;
    }

    &--difficulty {
      color: #6366f1;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .class-performance {
    padding: 16px;
    margin: 8px auto;

    &__title {
      font-size: 1.25rem;
      text-align: center;
    }

    &__info {
      flex-direction: column;
      gap: 1rem;
    }

    &__categories-grid {
      grid-template-columns: 1fr;
    }

    &__category-stats {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    &__category-card {
      padding: 16px;
    }

    &__toggle-button {
      width: 36px;
      height: 36px;
    }

    &__arrow {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
