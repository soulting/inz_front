import login from '@/composables/login'
import { useLoadingStore } from '@/stores/loading'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoggedIn: false,
  }),
  actions: {
    async piniaLogin(email, password, router) {
      const loadingStore = useLoadingStore()
      try {
        loadingStore.startLoading()
        const result = await login(email, password)
        if (result.success) {
          this.isLoggedIn = true
          this.user = result.data.user
          this.token = result.data.token
          console.log('Login successful:')
          router.push('/')
        }
      } catch (error) {
        console.error('Login failed:', error)
        throw new Error(`Login failed: ${error.message || 'Unknown error'}`)
      } finally {
        loadingStore.stopLoading()
      }
    },
    piniaLogout() {
      this.user = null
      this.token = null
      this.isLoggedIn = false
    },
  },
  persist: true,
})
