<template>
  <div class="class-performance">
    <div class="class-performance__header">
      <h1 class="class-performance__title">
        {{ 'Analiza wyników klasy' }}
      </h1>
    </div>

    <div v-if="performanceData" class="class-performance__content">
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
                <div class="class-performance__category-header">
                  <div class="class-performance__category-main">
                    {{ category.main_category }}
                  </div>
                  <div class="class-performance__category-sub">
                    {{ category.sub_category }}
                  </div>
                </div>

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

const isExpended = ref(false)
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
