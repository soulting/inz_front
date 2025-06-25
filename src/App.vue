<script setup>
import { RouterView } from 'vue-router'
import LoadingSpiner from './components/LoadingSpiner.vue'
import { storeToRefs } from 'pinia'
import FooterView from './components/FooterView.vue'
import { useLoadingStore } from './stores/loading'
import HeaderView from './views/HeaderView.vue'

// const isDropdownOpen = ref(false)
// const authStore = useAuthStore()

// const { isLoggedIn } = storeToRefs(authStore)

const { isLoading } = storeToRefs(useLoadingStore())

// const logout = () => {
//   authStore.piniaLogout()
//   isDropdownOpen.value = false
// }

// const toggleDropdown = () => {
//   isDropdownOpen.value = !isDropdownOpen.value
// }
</script>

<template>
  <!-- <header class="header">
    <RouterLink class="header__logo-link" to="/">
      <img class="header__logo-image" src="./assets/logo.png" alt="site logo" />
    </RouterLink>
    <nav class="header__nav">
      <RouterLink class="header__link" to="/themenmix">Themenmix</RouterLink>
      <RouterLink class="header__link" to="/classes">Klasy</RouterLink>
      <RouterLink class="header__link" to="/test">Test</RouterLink>

      <button v-if="isLoggedIn" class="header__profile" @click="toggleDropdown">
        <img class="header__profile-avatar" src="./assets/profile_pic.jpg" alt="profile picture" />
        <span>Moje Konto</span>
        <img
          v-if="!isDropdownOpen"
          class="header__profile-arrow"
          src="./assets/down-arrow.png"
          alt="nav arrow indicator"
        />
        <img
          v-else
          class="header__profile-arrow"
          src="./assets/up-arrow.png"
          alt="nav arrow indicator"
        />
      </button>
      <div class="header__auth" v-else>
        <RouterLink class="header__auth-item" to="/login">Zaloguj się</RouterLink>
        <RouterLink class="header__auth-item header__auth-item--signup" to="/signup"
          >Zarejestruj Się</RouterLink
        >
      </div>
    </nav>
    <div v-if="isDropdownOpen" class="header__dropdown">
      <RouterLink class="header__dropdown-item" to="/profile">Profil</RouterLink>
      <RouterLink class="header__dropdown-item" to="/settings">Ustawienia</RouterLink>
      <RouterLink
        class="header__dropdown-item header__dropdown-item--logout"
        to="/login"
        @click="logout"
        >Wyloguj</RouterLink
      >
    </div>
  </header> -->
  <HeaderView />
  <LoadingSpiner v-if="isLoading" />
  <RouterView />
  <FooterView />
</template>

<style scoped lang="scss">
@use './styles/abstracts/mixins' as *;
@use './styles/abstracts/variables' as *;

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
  font-weight: 400;
  font-style: normal;
  line-height: 1.5;
  max-height: 100vh;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &__logo-link {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  &__logo-image {
    height: 100%;
  }

  &__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    height: 100%;
    letter-spacing: 0.5px;
  }

  &__profile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    height: 90%;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 17px;
    font-weight: 400;
    font-style: normal;

    &-avatar {
      height: 40px;
      aspect-ratio: 1 / 1;
      border-radius: 60px;

      object-fit: cover;
      object-position: center;
    }

    &-arrow {
      height: 13px;
      width: 13px;
      aspect-ratio: 1 / 1;
      padding-top: 3px;
      object-fit: cover;
      object-position: center;
    }
  }

  &__dropdown {
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

    font-weight: 400;
    font-style: normal;
    letter-spacing: 0.5px;
    z-index: 999;

    &-item {
      width: 90%;
      height: 28px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: black;
      border-radius: 13px;

      &:hover {
        background-color: #eeeeee;
      }

      &--logout {
        background-color: red;
        color: white;

        &:hover {
          background-color: darkred;
        }
      }
    }
  }

  &__auth {
    display: flex;
    align-items: center;
    gap: 1rem;

    &-item {
      border: 1px solid #cccccc;
      padding: 6px 10px;
      border-radius: 8px;

      &--signup {
        background-color: #3b4bdc;
        color: white;
        text-decoration: none;

        &:hover {
          background-color: #2a3bbd;
        }
      }
    }
  }
}
</style>
