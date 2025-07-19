<template>
  <div class="container">
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

        <button type="submit">Zarejestruj</button>
      </form>

      <p class="login-link">Masz już konto? <router-link to="/login">Zaloguj się</router-link></p>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

import { ref } from 'vue'

import { URL } from '@/enums'

const alert = {
  icon: 'error',
  confirmButtonText: 'OK',
  background: '#00000',
  confirmButtonColor: '#3b4bdc',
  color: '#000000',
}

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('')
const isLoading = ref(false)

const signup = async () => {
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      ...alert,
      title: 'Fehler',
      text: 'Die Passwörter stimmen nicht überein.',
    })
    return
  }

  if (!role.value) {
    Swal.fire({
      ...alert,
      title: 'Fehler',
      text: 'Bitte wähle eine Rolle aus.',
    })
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

    Swal.fire({
      ...alert,
      icon: 'success',
      title: 'Erfolg',
      text: 'Registrierung erfolgreich!',
    })

    router.push('/login')
  } catch (error) {
    if (error.status === 409) {
      if (error.response.data.error === 'email taken') {
        alert('E-Mail-Adresse ist bereits registriert.')
      } else if (error.response.data.error === 'username taken') {
        alert('Benutzername ist bereits vergeben.')
      }
    } else {
      alert('Fehler bei der Registrierung. Bitte versuche es später erneut.')
    }
  } finally {
    isLoading.value = false
  }
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

.signup-box {
  width: 100%;
  max-width: 360px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.signup-header {
  background-color: #3b4bdc;
  padding: 16px;
  border-radius: 10px 10px 0 0;
  margin: -24px -24px 24px -24px;
  text-align: center;
}

.signup-header h2 {
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

input[type='text'],
input[type='email'],
input[type='password'] {
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.role-options {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.role-options label {
  font-size: 14px;
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

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.login-link a {
  color: #3b4bdc;
  text-decoration: none;
  font-weight: bold;
}
</style>
