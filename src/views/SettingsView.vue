<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>Ustawienia konta</h1>
      <p class="subtitle">Zmień swoje dane osobowe</p>
    </div>

    <div class="settings-content">
      <div class="settings-section">
        <h2>Zdjęcie profilowe</h2>
        <div class="avatar-section">
          <div class="avatar-preview">
            <img
              :src="user?.profile_image || '/path/to/default-avatar.png'"
              alt="Avatar"
              class="avatar-image"
            />
          </div>
          <div class="avatar-controls">
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              @change="handleAvatarUpload"
              style="display: none"
            />
            <button @click="avatarInput.click()" class="btn-secondary">Wybierz zdjęcie</button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>Nazwa użytkownika</h2>
        <div class="form-group">
          <label for="username">Aktualna nazwa użytkownika</label>
          <input
            id="username"
            v-model="userData.username"
            type="text"
            :placeholder="user?.name || 'Wprowadź nową nazwę użytkownika'"
          />
        </div>
        <button @click="changeUsername" class="btn-primary" :disabled="!userData.username">
          Zmień nazwę użytkownika
        </button>
      </div>

      <div class="settings-section">
        <h2>Zmiana hasła</h2>
        <div class="form-group">
          <label for="currentPassword">Aktualne hasło</label>
          <input
            id="currentPassword"
            v-model="passwordData.currentPassword"
            type="password"
            placeholder="Wprowadź aktualne hasło"
          />
        </div>

        <div class="form-group">
          <label for="newPassword">Nowe hasło</label>
          <input
            id="newPassword"
            v-model="passwordData.newPassword"
            type="password"
            placeholder="Wprowadź nowe hasło"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Potwierdź nowe hasło</label>
          <input
            id="confirmPassword"
            v-model="passwordData.confirmPassword"
            type="password"
            placeholder="Potwierdź nowe hasło"
          />
        </div>

        <button @click="changePassword" class="btn-primary" :disabled="!isPasswordFormValid">
          Zmień hasło
        </button>
      </div>

      <div class="settings-section">
        <h2>Preferencje prywatności</h2>
        <div class="toggle-group">
          <label class="toggle-item">
            <input
              type="checkbox"
              v-model="preferences.notifications"
              @change="updatePreferences"
            />
            <span class="toggle-switch"></span>
            <div class="toggle-content">
              <span class="toggle-label">Powiadomienia email</span>
              <span class="toggle-description">Otrzymuj powiadomienia o ważnych wydarzeniach</span>
            </div>
          </label>

          <label class="toggle-item">
            <input type="checkbox" v-model="preferences.cookies" @change="updatePreferences" />
            <span class="toggle-switch"></span>
            <div class="toggle-content">
              <span class="toggle-label">Cookies funkcjonalne</span>
              <span class="toggle-description"
                >Zezwalaj na cookies poprawiające działanie strony</span
              >
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { showErrorToast, showSuccessToast } from '@/composables/useSwal'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

import { computed, onMounted, ref } from 'vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const userData = ref({
  username: user.value?.name || '',
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const preferences = ref({
  notifications: user.value?.notifications || false,
  cookies: user.value?.cookies || false,
})

const avatarInput = ref(null)

const isPasswordFormValid = computed(() => {
  return (
    passwordData.value.currentPassword &&
    passwordData.value.newPassword &&
    passwordData.value.confirmPassword &&
    passwordData.value.newPassword === passwordData.value.confirmPassword &&
    passwordData.value.newPassword.length >= 6
  )
})

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    showErrorToast('Plik jest za duży. Maksymalny rozmiar to 5MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    showErrorToast('Wybierz plik graficzny')
    return
  }

  console.log(file)
  await authStore.changeProfilePicture(file)
}

const updatePreferences = async () => {
  await authStore.updatePreferences({
    notifications: preferences.value.notifications,
    cookies: preferences.value.cookies,
  })
}

const changeUsername = async () => {
  if (!userData.value.username.trim()) {
    showErrorToast('Nazwa użytkownika nie może być pusta')
    return
  }

  if (userData.value.username.length < 3) {
    showErrorToast('Nazwa użytkownika musi mieć co najmniej 3 znaki')
    return
  }

  await authStore.setUsername(userData.value.username)
}

const changePassword = async () => {
  if (!isPasswordFormValid.value) {
    showErrorToast('Sprawdź poprawność danych')
    return
  }

  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    showErrorToast('Nowe hasła nie są identyczne')
    return
  }

  if (passwordData.value.newPassword.length < 6) {
    showErrorToast('Nowe hasło musi mieć co najmniej 6 znaków')
    return
  }

  const result = await authStore.changePassword(
    passwordData.value.currentPassword,
    passwordData.value.newPassword,
  )

  if (result.success) {
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  }
}
</script>
