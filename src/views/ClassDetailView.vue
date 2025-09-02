<template>
  <div class="class-detail">
    <div class="class-detail__container">
      <div class="class-detail__header">
        <h1 class="class-detail__title">{{ props.name }}</h1>

        <div class="class-detail__buttons">
          <button
            class="class-detail__button"
            :class="tabs.activeTab === 'lessons' ? 'class-detail__button--active' : ''"
            @click="toggleTabs"
          >
            Lekcje
          </button>
          <button
            class="class-detail__button"
            :class="tabs.activeTab === 'statistics' ? 'class-detail__button--active' : ''"
            @click="toggleTabs"
          >
            Statystyki
          </button>
        </div>
      </div>

      <div class="class-detail__content">
        <ClassDetailSections v-if="tabs.activeTab === 'lessons'" :id="props.id" />
        <ClassDetailStatistics v-else :classId="props.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import ClassDetailSections from '@/components/ClassDetailSections.vue'
import ClassDetailStatistics from '@/components/ClassDetailStatistics.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: [String, Number],
    required: true,
  },
})

const tabs = ref({
  activeTab: 'lessons',
})

function toggleTabs() {
  tabs.value.activeTab = tabs.value.activeTab === 'lessons' ? 'statistics' : 'lessons'
}
</script>
