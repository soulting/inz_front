<template>
  <HeaderView />
  <LoadingSpiner v-if="isLoading" />
  <RouterView />
  <FooterView />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'

import useApi from './api/useApi'
import FooterView from './components/FooterView.vue'
import LoadingSpiner from './components/LoadingSpiner.vue'
import { useLoadingStore } from './stores/loading'
import HeaderView from './views/HeaderView.vue'

const { isLoading } = storeToRefs(useLoadingStore())

useApi()
</script>
