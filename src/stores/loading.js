import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: 0,
  }),
  actions: {
    startLoading() {
      this.isLoading++
    },
    async stopLoading() {
      await new Promise((resolve) => setTimeout(resolve, 300))
      this.isLoading--
    },
  },
})
