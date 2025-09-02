import useApi from '@/api/useApi'
import { showErrorToast, showSuccessToast } from '@/composables/useSwal'
import { defineStore } from 'pinia'

import { URL } from '@/enums'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoggedIn: false,
  }),
  actions: {
    async loginUser(email, password, router) {
      const response = await useApi().post(`${URL.AUTH}/login`, { email, password }, router)
      if (response.success) {
        this.isLoggedIn = true
        this.user = response.user
        this.token = response.token
        console.log('Login successful:')
        router.push('/')
        showSuccessToast(response.message)
      } else {
        showErrorToast(response.error)
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

    async changeProfilePicture(file) {
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
