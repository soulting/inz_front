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

<style scoped lang="scss">
.test-intro {
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;

  &__container {
    max-width: 800px;
    width: 100%;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 3rem;
    text-align: center;
  }

  &__header {
    margin-bottom: 2.5rem;
  }

  &__title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 2rem;
    line-height: 1.2;
  }

  &__stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 12px;
    min-width: 80px;
    border: 1px solid #e5e7eb;
  }

  &__stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #4f46e5;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
    font-weight: 500;
  }

  &__content {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
    text-align: left;
  }

  &__info-card,
  &__tips-card {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }

  &__info-title,
  &__tips-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  &__info-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 0.5rem 0;
      color: #4b5563;
      font-size: 1rem;
      line-height: 1.5;
      position: relative;
      padding-left: 1.5rem;

      &:before {
        content: '•';
        color: #4f46e5;
        font-weight: bold;
        position: absolute;
        left: 0;
      }
    }
  }

  &__tips {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__tip {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__tip-label {
    font-weight: 500;
    color: #374151;
    font-size: 1rem;
  }

  &__tip-options {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  &__option {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 60px;
    height: 36px;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
    transition: all 0.2s ease;

    &:hover {
      border-color: #4f46e5;
      background: #f0f0ff;
    }
  }

  &__start-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 600;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);

    &:hover {
      background: #4338ca;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__start-text {
    font-size: 1.125rem;
  }

  &__start-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  &__start-btn:hover &__start-icon {
    transform: translateX(2px);
  }
}

// Responsive design
@media (max-width: 768px) {
  .test-intro {
    padding: 1rem;

    &__container {
      padding: 2rem;
    }

    &__title {
      font-size: 1.875rem;
    }

    &__stats {
      gap: 1rem;
    }

    &__stat {
      min-width: 70px;
      padding: 0.75rem;
    }

    &__stat-number {
      font-size: 1.5rem;
    }

    &__content {
      gap: 1rem;
    }

    &__info-card,
    &__tips-card {
      padding: 1.25rem;
    }

    &__tip-options {
      justify-content: center;
    }
  }
}
</style>
