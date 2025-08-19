<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>Ustawienia konta</h1>
      <p class="subtitle">Zmień swoje dane osobowe</p>
    </div>

    <div class="settings-content">
      <!-- Sekcja Zdjęcia profilowego -->
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
            <button
              v-if="user?.profile_image && user.profile_image !== '/path/to/default-avatar.png'"
              @click="removeAvatar"
              class="btn-remove"
            >
              Usuń zdjęcie
            </button>
          </div>
        </div>
      </div>

      <!-- Sekcja Nazwy użytkownika -->
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

      <!-- Sekcja Hasła -->
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

      <!-- Sekcja Zgód -->
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

// Store
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// Reactive data
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

// Computed
const isPasswordFormValid = computed(() => {
  return (
    passwordData.value.currentPassword &&
    passwordData.value.newPassword &&
    passwordData.value.confirmPassword &&
    passwordData.value.newPassword === passwordData.value.confirmPassword &&
    passwordData.value.newPassword.length >= 6
  )
})

// Methods

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Sprawdź rozmiar pliku (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showErrorToast('Plik jest za duży. Maksymalny rozmiar to 5MB')
    return
  }

  // Sprawdź typ pliku
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

<style scoped>
.settings-container {
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.settings-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-header h1 {
  font-size: 2.25rem;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.settings-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
}

.settings-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  height: fit-content;
}

.settings-section h2 {
  font-size: 1.25rem;
  color: #495057;
  margin-bottom: 20px;
  font-weight: 600;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.avatar-preview {
  flex-shrink: 0;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #dee2e6;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  border: 3px solid #dee2e6;
}

.avatar-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-secondary {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.btn-secondary:hover {
  background-color: #545b62;
  transform: translateY(-1px);
}

.btn-remove {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.btn-remove:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toggle-item {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  padding: 12px 0;
}

.toggle-item input[type='checkbox'] {
  display: none;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 26px;
  background-color: #ccc;
  border-radius: 13px;
  margin-right: 15px;
  margin-top: 2px;
  flex-shrink: 0;
  transition: background-color 0.3s;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  top: 3px;
  left: 3px;
  transition: transform 0.3s;
}

.toggle-item input:checked + .toggle-switch {
  background-color: #007bff;
}

.toggle-item input:checked + .toggle-switch::after {
  transform: translateX(24px);
}

.toggle-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-label {
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.toggle-description {
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #495057;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.15s ease-in-out;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.btn-primary {
  width: 100%;
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 1024px) {
  .settings-content {
    grid-template-columns: 1fr;
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .settings-container {
    padding: 24px;
  }

  .settings-header {
    margin-bottom: 30px;
    padding-bottom: 24px;
  }

  .settings-header h1 {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .settings-content {
    gap: 24px;
    grid-template-columns: 1fr;
    max-width: none;
  }

  .settings-section {
    padding: 24px;
    border-radius: 12px;
  }

  .avatar-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 15px;
  }

  .avatar-controls {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .settings-container {
    padding: 16px;
  }

  .settings-content {
    grid-template-columns: 1fr;
  }

  .settings-section {
    padding: 20px;
  }
}
</style>
