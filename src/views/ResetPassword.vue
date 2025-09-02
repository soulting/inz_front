<template>
  <div class="auth-container">
    <div class="login-box">
      <div class="login-header">
        <h2>Zresetuj hasło</h2>
      </div>
      <form @submit.prevent="resetPassword">
        <label for="email">E-Mail</label>
        <input type="email" id="email" v-model="email" required />
        <button type="submit">Resetuj hasło</button>
        <p class="register-link">
          Nie masz jeszcze konta? <router-link to="/signup">Zarejestruj się</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import useApi from '@/api/useApi'
import { showSuccessPopup } from '@/composables/useSwal'
import { useRouter } from 'vue-router'

import { ref } from 'vue'

import { URL } from '@/enums'

const router = useRouter()

const email = ref('')

const resetPassword = async () => {
  const response = await useApi().post(`${URL.AUTH}/reset-password`, { email: email.value }, router)

  await showSuccessPopup('Pomyślnie zresetowano hasło, sprawdz swoją skrzynkę pocztową.')

  router.push('/login')
}
</script>
