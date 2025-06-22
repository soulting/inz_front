<template>
  <div class="container">
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
          <a href="#">Zapomniałeś hasła?</a>
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
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()

const router = useRouter()

const email = ref('')
const password = ref('')

const login = async () => {
  await authStore.piniaLogin(email.value, password.value, router)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  color: #343434;
}

.login-box {
  width: 100%;
  max-width: 360px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.login-header {
  background-color: #3b4bdc;
  padding: 16px;
  border-radius: 10px 10px 0 0;
  margin: -24px -24px 24px -24px;
  text-align: center;
}

.login-header h2 {
  color: white;
  margin: 0;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-weight: 500;
}

input {
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.forgot-password {
  text-align: right;
  margin-bottom: 16px;
}

.forgot-password a {
  font-size: 13px;
  color: #444;
  text-decoration: none;
}

button {
  background-color: #fdd835;
  color: #000;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #fbc02d;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.register-link a {
  color: #3b4bdc;
  text-decoration: none;
  font-weight: bold;
}
</style>
