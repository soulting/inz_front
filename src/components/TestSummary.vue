<template>
  <div class="summary-container">
    <h1>Podsumowanie testu</h1>
    <p>Test został zakończony. Oto Twoje wyniki:</p>

    <div class="summary-item">
      <p><strong>Poziom:</strong> {{ testAnswers.level }}</p>
    </div>

    <div class="summary-item">
      <div class="progress-container">
        <CircularProgressBar :progress="percentageCorrect" />
        <p><strong>Poprawność</strong></p>
      </div>

      <p><strong>Łączna liczba punktów:</strong> {{ testAnswers.totalPoints }}</p>
    </div>

    <div class="summary-item">
      <p><strong>Liczba błędów:</strong> {{ testAnswers.totalErrors }}</p>
    </div>

    <div class="summary-item">
      <p>
        <strong>Czas trwania:</strong>
        {{ Math.floor(testAnswers.totalTime / 60) }} minut {{ testAnswers.totalTime % 60 }} sekund
      </p>
    </div>

    <div class="summary-info">Gratulacje! Dziękujemy za ukończenie testu.</div>
    <RouterLink to="/" class="end-test-btn">Zakończ</RouterLink>
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
<style scoped>
.summary-container {
  padding: 4rem;
  font-family: 'Varela Round', sans-serif;
  background-color: #fff;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #3b4bdc;
  text-align: center;
}

p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.summary-item {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f7f9fc;
  border-left: 6px solid #3b4bdc;
  border-radius: 12px;
  width: 100%;
}

.summary-info {
  font-weight: bold;
  margin-top: 3rem;
  font-size: 1.4rem;
  text-align: center;
  color: #3b4bdc;
}

.end-test-btn {
  display: inline-block;
  margin: 3rem auto 0;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #3b4bdc;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  text-align: center;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.end-test-btn:hover {
  background-color: #2a3dc3;
  transform: scale(1.03);
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
