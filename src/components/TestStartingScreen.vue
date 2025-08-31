<template>
  <div class="test-intro">
    <div class="test-intro__container">
      <div class="test-intro__header">
        <h1 class="test-intro__title">Test Poziomujący z Języka Niemieckiego</h1>
        <div class="test-intro__stats">
          <div class="test-intro__stat">
            <span class="test-intro__stat-number">{{ tasks.length }}</span>
            <span class="test-intro__stat-label">zadań</span>
          </div>
          <div class="test-intro__stat">
            <span class="test-intro__stat-number">{{ totalSubtasks }}</span>
            <span class="test-intro__stat-label">pytań</span>
          </div>
          <div class="test-intro__stat">
            <span class="test-intro__stat-number">{{ estimatedTime }}</span>
            <span class="test-intro__stat-label">minut</span>
          </div>
        </div>
      </div>

      <div class="test-intro__content">
        <div class="test-intro__info-card">
          <h2 class="test-intro__info-title">Instrukcje</h2>
          <ul class="test-intro__info-list">
            <li>Test sprawdza różne zagadnienia gramatyczne języka niemieckiego</li>
            <li>
              Masz <strong>{{ estimatedTime }} minut</strong>, ale możesz zakończyć wcześniej
            </li>
            <li><strong>Nie można wracać</strong> do poprzednich zadań</li>
            <li>Po każdym zadaniu oceń jego trudność (nie wpływa na wynik)</li>
          </ul>
        </div>

        <div class="test-intro__tips-card">
          <h2 class="test-intro__tips-title">Jak odpowiadać</h2>
          <div class="test-intro__tips">
            <div class="test-intro__tip">
              <span class="test-intro__tip-label">Wybierz odpowiedź:</span>
              <div class="test-intro__tip-options">
                <span class="test-intro__option">a</span>
                <span class="test-intro__option">b</span>
                <span class="test-intro__option">c</span>
                <span class="test-intro__option">nie wiem</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="test-intro__start-btn" @click="startTest">
        <span class="test-intro__start-text">Rozpocznij test</span>
        <svg class="test-intro__start-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon points="5,3 19,12 5,21 5,3"></polygon>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['start'])

const totalSubtasks = computed(() =>
  props.tasks.reduce((acc, task) => acc + (task.task_items?.length || 0), 0),
)

// Oszacowanie czasu: 1.5 minuty na pytanie + 5 minut buforu
const estimatedTime = computed(() => {
  const baseTime = Math.ceil(totalSubtasks.value * 1.5)
  const bufferTime = 5
  return Math.min(baseTime + bufferTime, 60) // maksymalnie 60 minut
})

function startTest() {
  emit('start')
}
</script>
