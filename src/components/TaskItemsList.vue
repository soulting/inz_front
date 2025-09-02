<template>
  <div class="task-analytics-card">
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

    <ul v-show="isExpanded" class="items-list" role="list" aria-label="Lista podpunktów zadania">
      <li v-for="item in items" :key="item.item_id" class="item-card" role="listitem">
        <div class="item-main">
          <div class="field field--question">
            <div class="field__label">Pytanie</div>
            <div class="field__value monospace">
              {{
                `${formatTemplate(item.template)} ${item.bonus_information ? ` (${item.bonus_information})` : ''}`
              }}
            </div>
          </div>

          <div class="field field--answer">
            <div class="field__label">Poprawna odpowiedź</div>
            <div class="field__value answer">{{ item.correct_answer || '—' }}</div>
          </div>

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

function formatTemplate(template) {
  if (template === null || template === undefined) return ''
  return String(template).replace(/%%\[(inp|sel)\]%%/g, '___')
}

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
