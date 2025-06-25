<template>
  <header class="header">
    <RouterLink class="header__logo-link" to="/">
      <img class="header__logo-image" src="@/assets/logo.png" alt="site logo" />
    </RouterLink>
    <nav class="header__nav">
      <RouterLink class="header__link" to="/themenmix">Themenmix</RouterLink>
      <RouterLink class="header__link" to="/classes">Klasy</RouterLink>
      <RouterLink class="header__link" to="/test">Test</RouterLink>

      <button v-if="isLoggedIn" class="header__profile" @click="toggleDropdown">
        <img class="header__avatar" src="@/assets/profile_pic.jpg" alt="profile picture" />
        <span>Moje Konto</span>
        <img
          v-if="!isDropdownOpen"
          class="header__arrow"
          src="@/assets/down-arrow.png"
          alt="nav arrow indicator"
        />
        <img v-else class="header__arrow" src="@/assets/up-arrow.png" alt="nav arrow indicator" />
      </button>
      <div class="header__auth" v-else>
        <RouterLink class="header__auth-item" to="/login">Zaloguj się</RouterLink>
        <RouterLink class="header__auth-item header__auth-item--signup" to="/signup">
          Zarejestruj Się
        </RouterLink>
      </div>
    </nav>
    <div v-if="isDropdownOpen" class="header__dropdown">
      <RouterLink class="header__dropdown-item" to="/profile">
        <img class="header__dropdown-icon" src="../assets/icons/user.png" alt="dropdown image" />
        Profil</RouterLink
      >
      <RouterLink class="header__dropdown-item" to="/settings">
        <img
          class="header__dropdown-icon"
          src="../assets/icons/settings.png"
          alt="dropdown image"
        />
        Ustawienia
      </RouterLink>
      <RouterLink
        class="header__dropdown-item header__dropdown-item--logout"
        to="/login"
        @click="logout"
      >
        <img class="header__dropdown-icon" src="../assets/icons/logout.png" alt="dropdown image" />
        Wyloguj
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const isDropdownOpen = ref(false)
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const logout = () => {
  authStore.piniaLogout()
  isDropdownOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
</script>
