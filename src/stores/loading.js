import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: 0,
  }),
  actions: {
    startLoading() {
      this.isLoading++
    },
    stopLoading() {
      this.isLoading--
    },
  },
})
