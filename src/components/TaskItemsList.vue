<template>
  <div class="task-analytics-card">
    <!-- Nagłówek -->
    <div class="task-analytics-card__header">
      <h3 class="task-analytics-card__title">Zadanie: {{ task.question }}</h3>

      <button
        class="task-analytics-card__toggle-button"
        @click="toggleExpanded"
        :title="isExpanded ? 'Ukryj szczegóły' : 'Pokaż szczegóły'"
        :aria-expanded="isExpanded"
      >
        <img
          v-if="isExpanded"
          class="task-analytics-card__arrow"
          src="@/assets/up-arrow.png"
          alt="ukryj"
        />
        <img v-else class="task-analytics-card__arrow" src="@/assets/down-arrow.png" alt="pokaż" />
      </button>
    </div>

    <!-- Lista podpunktów: domyślnie ukryta -->
    <ul v-show="isExpanded" class="items-list" role="list" aria-label="Lista podpunktów zadania">
      <li v-for="item in items" :key="item.item_id" class="item-card" role="listitem">
        <div class="item-main">
          <!-- pytanie -->
          <div class="field field--question">
            <div class="field__label">Pytanie</div>
            <div class="field__value monospace">
              {{
                `${formatTemplate(item.template)} ${item.bonus_information ? ` (${item.bonus_information})` : ''}`
              }}
            </div>
          </div>

          <!-- poprawna odpowiedź -->
          <div class="field field--answer">
            <div class="field__label">Poprawna odpowiedź</div>
            <div class="field__value answer">{{ item.correct_answer || '—' }}</div>
          </div>

          <!-- pigułki procentowe (jedna linia) -->
          <div class="item-badges" aria-hidden="false">
            <span class="badge badge--success"
              >{{ formatPercent(item.correct, item) }}% • punkty</span
            >
            <span class="badge badge--danger"
              >{{ formatPercent(item.incorrect, item) }}% • błędy</span
            >
            <span class="badge badge--warn"
              >{{ formatPercent(item.uncertain, item) }}% • niepewność</span
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'

import { onMounted, ref } from 'vue'

import { URL } from '@/enums'

const props = defineProps({
  classId: { type: String, required: true },
  task: { type: Object, required: true },
})

const items = ref([])
const isExpanded = ref(false)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

// Zamiana %%[inp]%% i %%[sel]%% na ___
function formatTemplate(template) {
  if (template === null || template === undefined) return ''
  return String(template).replace(/%%\[(inp|sel)\]%%/g, '___')
}

// Liczenie procentów (bez dzielenia przez zero)
function formatPercent(value, item) {
  const correct = Number(item.correct) || 0
  const incorrect = Number(item.incorrect) || 0
  const uncertain = Number(item.uncertain) || 0
  const total = correct + incorrect + uncertain
  if (!total) return 0
  return Math.round(((Number(value) || 0) / total) * 100)
}

onMounted(async () => {
  const res = await useApi().get(
    `${URL.ANALYTICS}/get_task_item_analytics/${props.classId}/${props.task.task_id}`,
  )
  items.value = res.items || []
})
</script>

<style lang="scss" scoped>
.task-analytics-card {
  background: var(--bg);
  border-radius: 10px;
  padding: 14px;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow);
  font-family:
    Inter,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  color: var(--text);

  &__header {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.2;
    color: var(--text);
  }

  &__toggle-button {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 36, 0.06);
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 6px;
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(12, 17, 23, 0.06);
    }

    .task-analytics-card__arrow {
      width: 14px;
      height: 14px;
      opacity: 0.95;
    }
  }

  /* Lista */
  .items-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
  }

  .item-card {
    background: var(--bg);
    border-radius: 8px;
    padding: 12px;
    border: 1px solid rgba(15, 23, 36, 0.03);
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(12, 17, 23, 0.04);
    }

    .item-main {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* pola - label + value */
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;

      &__label {
        font-size: 12px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.6px;
        font-weight: 600;
      }

      &__value {
        font-size: 14px;
        color: var(--text);
      }

      &.field--question {
        .field__value.monospace {
          font-family:
            ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
          font-size: 13px;
          padding: 6px 10px;
          border-radius: 6px;
          background: var(--surface);
          border: 1px solid rgba(15, 23, 36, 0.03);
          color: #071124;
        }
      }

      &.field--answer {
        .field__value.answer {
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(15, 23, 36, 0.03);
          display: inline-block;
          color: #071124;
        }
      }
    }

    .item-badges {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 13px;
      color: var(--text);
      background: rgba(15, 23, 36, 0.04);
      min-width: 64px;
      justify-content: center;
    }

    .badge--success {
      color: var(--success);
      background: rgba(22, 163, 74, 0.06);
    }
    .badge--danger {
      color: var(--danger);
      background: rgba(239, 68, 68, 0.06);
    }
    .badge--warn {
      color: var(--warn);
      background: rgba(217, 119, 6, 0.06);
    }

    .composed-bar {
      height: 8px;
      width: 100%;
      background: rgba(15, 23, 36, 0.04);
      border-radius: 999px;
      overflow: hidden;
      display: flex;
      margin-top: 6px;
      border: 1px solid rgba(15, 23, 36, 0.02);
    }

    .segment {
      height: 100%;
      transition: flex-basis 0.35s ease;
    }
    .segment--success {
      background: rgba(22, 163, 74, 0.9);
    }
    .segment--danger {
      background: rgba(239, 68, 68, 0.9);
    }
    .segment--warn {
      background: rgba(217, 119, 6, 0.9);
    }

    .item-meta {
      margin-top: 8px;
      font-size: 12px;
      color: var(--muted);
      display: flex;
      gap: 6px;
      align-items: center;

      .meta-sep {
        color: rgba(15, 23, 36, 0.12);
      }
    }
  }

  /* mobile: ciasniej */
  @media (max-width: 640px) {
    padding: 12px;
    .item-card {
      padding: 10px;
    }
    .badge {
      font-size: 12px;
      padding: 5px 8px;
      min-width: 60px;
    }
    .field__label {
      font-size: 11px;
    }
  }
}
</style>
