<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import LoadingSpiner from './components/LoadingSpiner.vue'
import { useAuthStore } from './stores/auth'
import { storeToRefs } from 'pinia'
import FooterView from './components/FooterView.vue'
import { useLoadingStore } from './stores/loading'

const isDropdownOpen = ref(false)
const authStore = useAuthStore()

const { isLoggedIn } = storeToRefs(authStore)

const { isLoading } = storeToRefs(useLoadingStore())

const logout = () => {
  authStore.piniaLogout()
  isDropdownOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
</script>

<template>
  <header class="header">
    <RouterLink class="header__logo" to="/">
      <img src="./assets/logo.png" alt="site logo" />
    </RouterLink>
    <nav class="nav">
      <RouterLink to="/themenmix">Themenmix</RouterLink>
      <RouterLink to="/klasy">Klasy</RouterLink>
      <RouterLink to="/test">Test</RouterLink>
      <button v-if="isLoggedIn" class="nav__profile-button" @click="toggleDropdown">
        <img class="nav__profile-avatar" src="./assets/profile_pic.jpg" alt="profile picture" />
        <span>Moje Konto</span>
        <img
          v-if="!isDropdownOpen"
          class="nav__profile-arrow"
          src="./assets/down-arrow.png"
          alt="nav arrow indicator"
        />
        <img
          v-else
          class="nav__profile-arrow"
          src="./assets/up-arrow.png"
          alt="nav arrow indicator"
        />
      </button>
      <div class="nav-auth-con" v-else>
        <RouterLink to="/login">Zaloguj się</RouterLink>
        <RouterLink to="/signup" id="nav-auth-con-signup">Zarejestruj Się</RouterLink>
      </div>
    </nav>
  </header>

  <div v-if="isDropdownOpen" class="nav__dropdown">
    <RouterLink to="/profile">Profil</RouterLink>
    <RouterLink to="/settings">Ustawienia</RouterLink>
    <RouterLink id="nav__dropdown-logout-btn" to="/login" @click="logout">Wyloguj</RouterLink>
  </div>
  <LoadingSpiner v-if="isLoading" />
  <RouterView />
  <FooterView />
</template>

<style scoped>
/* ---------------- HEADER ---------------- */
.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  padding: 0 1.5rem;
  z-index: 1000;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: white;
  color: black;

  font-size: 17px;
  font-family: 'Varela Round', sans-serif;
  font-weight: 400;
  font-style: normal;
  line-height: 1.5;
  max-height: 100vh;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.header__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.header__logo img {
  height: 100%;
}

/* ---------------- NAVIGATION ---------------- */
.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  height: 100%;

  letter-spacing: 0.5px;
}

/* PROFILE BUTTON */
.nav__profile-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  height: 90%;

  border: none;
  background-color: transparent;
  cursor: pointer;

  font-size: 17px;
  font-family: 'Varela Round', sans-serif;
  font-weight: 400;
  font-style: normal;
}

/* PROFILE AVATAR */
.nav__profile-avatar {
  height: 40px;
  aspect-ratio: 1 / 1;
  border-radius: 60px;

  object-fit: cover;
  object-position: center;
}

/* ARROW ICON */
.nav__profile-arrow {
  height: 13px;
  width: 13px;
  aspect-ratio: 1 / 1;
  padding-top: 3px;

  object-fit: cover;
  object-position: center;
}

/* DROPDOWN MENU */
.nav__dropdown {
  position: fixed;
  top: 60px;
  right: 0;
  width: 200px;
  padding: 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-bottom-left-radius: 4px;

  font-size: 17px;
  font-family: 'Varela Round', sans-serif;
  font-weight: 400;
  font-style: normal;
  letter-spacing: 0.5px;
  z-index: 999;
}

.nav__dropdown a {
  width: 90%;
  height: 28px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: black;
  border-radius: 13px;
}

.nav__dropdown a:hover {
  background-color: #eeeeee;
}

#nav__dropdown-logout-btn {
  background-color: red;
  color: white;
}

#nav__dropdown-logout-btn:hover {
  background-color: darkred;
}

.nav-auth-con {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-auth-con a {
  border: 1px solid #cccccc;
  padding: 6px 10px;
  border-radius: 8px;
}

#nav-auth-con-signup {
  background-color: #3b4bdc;
  color: white;
  text-decoration: none;
}

@media (min-width: 1024px) {
  /* Responsywne style tutaj */
}
</style>
