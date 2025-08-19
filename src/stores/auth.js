import useApi from '@/api/useApi'
import login from '@/composables/login'
import { showErrorToast, showSuccessToast } from '@/composables/useSwal'
import { useLoadingStore } from '@/stores/loading'
import { defineStore } from 'pinia'

import { URL } from '@/enums'

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

    async setUsername(username, router) {
      const response = await useApi().put(`${URL.SETTINGS}/update_username`, { username }, router)
      if (response.success) {
        this.user.name = username
        showSuccessToast(response.message)
      } else {
        showErrorToast(response.error)
      }
    },

    async changePassword(oldPassword, newPassword, router) {
      const response = await useApi().put(
        `${URL.SETTINGS}/change_password`,
        { oldPassword, newPassword },
        router,
      )
      if (response.success) {
        showSuccessToast(response.message)
        return true
      } else {
        showErrorToast(response.error)
        return false
      }
    },

    async changeProfilePicture(file, router) {
      const formData = new FormData()
      formData.append('profile_picture', file)

      const response = await fetch(`${URL.SETTINGS}/change_profile_picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (result.success && result.profile_image) {
        this.user.profile_image = result.profile_image
        showSuccessToast(result.message)
      } else {
        showErrorToast(result.error || 'Błąd podczas zmiany zdjęcia profilowego')
      }
    },

    async removeProfileImage(router) {
      const response = await useApi().delete(`${URL.SETTINGS}/remove_profile_picture`, {}, router)
      if (response.success) {
        this.user.profile_image = null
        showSuccessToast(response.message)
        return { success: true }
      }
      showErrorToast(response.error || 'Błąd podczas usuwania zdjęcia')
      return { success: false, error: response.error || 'Błąd podczas usuwania zdjęcia' }
    },

    async updatePreferences(preferences, router) {
      const response = await useApi().put(`${URL.SETTINGS}/update_preferences`, preferences, router)
      if (response.success) {
        // Aktualizuj bezpośrednio w user, nie jako zagnieżdżony obiekt
        this.user.notifications = preferences.notifications
        this.user.cookies = preferences.cookies
        showSuccessToast(response.message)
        return { success: true }
      }
      showErrorToast(response.error || 'Błąd podczas aktualizacji preferencji')
      return { success: false, error: response.error || 'Błąd podczas aktualizacji preferencji' }
    },
  },
  persist: true,
})
