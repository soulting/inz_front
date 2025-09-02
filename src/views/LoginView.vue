<template>
  <div class="auth-container">
    <div class="login-box">
      <div class="login-header">
        <h2>Logowanie</h2>
      </div>
      <form @submit.prevent="login">
        <label for="email">E-Mail</label>
        <input type="email" id="email" v-model="email" required />

        <label for="password">Hasło</label>
        <input type="password" id="password" v-model="password" required />

        <div class="forgot-password">
          <router-link to="/reset-password">Zapomniałeś hasło?</router-link>
        </div>

        <button type="submit">Zaloguj</button>
      </form>

      <p class="register-link">
        Nie masz jeszcze konta? <router-link to="/signup">Zarejestruj się</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

import { ref } from 'vue'

const authStore = useAuthStore()

const router = useRouter()

const email = ref('')
const password = ref('')

const login = async () => {
  await authStore.loginUser(email.value, password.value, router)
}
</script>
