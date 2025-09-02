<template>
  <div class="auth-container">
    <div class="signup-box">
      <div class="signup-header">
        <h2>Rejestracja</h2>
      </div>
      <form @submit.prevent="signup">
        <label for="name">Nazwa</label>
        <input type="text" id="name" v-model="name" required />

        <label for="email">E-Mail</label>
        <input type="email" id="email" v-model="email" required />

        <label for="password">Hasło</label>
        <input type="password" id="password" v-model="password" required />

        <label for="confirmPassword">Powtórz hasło</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />

        <label>Rola</label>
        <div class="role-options">
          <label>
            <input type="radio" value="teacher" v-model="role" required />
            Nauczyciel
          </label>
          <label>
            <input type="radio" value="student" v-model="role" required />
            Uczeń
          </label>
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Rejestrowanie...' : 'Zarejestruj' }}
        </button>
      </form>

      <p class="login-link">Masz już konto? <router-link to="/login">Zaloguj się</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { showErrorPopup, showErrorToast, showSuccessPopup } from '@/composables/useSwal'
import axios from 'axios'
import { useRouter } from 'vue-router'

import { ref } from 'vue'

import { URL } from '@/enums'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('')
const isLoading = ref(false)

const signup = async () => {
  if (password.value !== confirmPassword.value) {
    showErrorPopup('Hasła nie są zgodne.', 'Błąd walidacji')
    return
  }

  if (!role.value) {
    showErrorPopup('Proszę wybrać rolę.', 'Brak roli')
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post(`${URL.AUTH}/register`, {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })

    await showSuccessPopup(
      'Rejestracja zakończona pomyślnie! Aktywój konto, aby się zalogować.',
      'Witaj w systemie!',
    )

    router.push('/login')
  } catch (error) {
    console.error('Błąd rejestracji:', error)

    if (error.response?.status === 409) {
      const errorType = error.response.data.error

      if (errorType === 'email taken') {
        showErrorPopup(
          'Ten adres e-mail jest już zarejestrowany. Spróbuj się zalogować lub użyj innego adresu.',
          'E-mail już istnieje',
        )
      } else if (errorType === 'username taken') {
        showErrorPopup('Ta nazwa użytkownika jest już zajęta. Wybierz inną nazwę.', 'Nazwa zajęta')
      } else {
        showErrorPopup('Użytkownik o podanych danych już istnieje.', 'Konflikt danych')
      }
    } else if (error.response?.status === 400) {
      showErrorToast('Sprawdź poprawność wprowadzonych danych.', 'Błędne dane')
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      showErrorPopup(
        'Brak połączenia z serwerem. Sprawdź połączenie internetowe i spróbuj ponownie.',
        'Błąd połączenia',
      )
    } else {
      showErrorPopup(
        'Wystąpił nieoczekiwany błąd podczas rejestracji. Spróbuj ponownie za chwilę.',
        'Błąd serwera',
      )
    }
  } finally {
    isLoading.value = false
  }
}
</script>
