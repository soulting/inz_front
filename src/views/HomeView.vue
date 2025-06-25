<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__overlay">
        <h1 class="hero__title">Zrozum Niemiecki</h1>
        <p class="hero__subtitle">Personalizowane notatki i codzienna praktyka</p>
        <button v-if="!isLoggedIn" class="btn btn--purple" @click="goTo('./register')">
          Zacznij Teraz
        </button>
      </div>
    </section>

    <!-- Intro Section -->
    <section class="intro">
      <div class="container">
        <p class="intro-text">
          Dostosowujemy plan nauki do Twoich potrzeb, abyś mógł osiągnąć najlepsze efekty – nasze
          spersonalizowane zadania i materiały pomagają rozwijać umiejętności w sposób skuteczny i
          dopasowany do Ciebie.
        </p>
      </div>
    </section>

    <!-- Feature Section 1: Image Left, Text Right -->
    <section class="feature feature-odd">
      <div class="container feature-wrapper">
        <div class="feature-image">
          <img
            src="../assets/images/john-schnobrich-2FPjlAyMQTA-unsplash.jpg"
            alt="Uczniowie z laptopem"
          />
        </div>
        <div class="feature-content">
          <p>
            Dobrze do klasy i ucz się pod okiem doświadczonych mentorów. Dzięki notatkom i
            ćwiczeniom praktycznym masz dostęp do najlepszych narzędzi, które pozwolą na efektywną.
          </p>
          <button v-if="isLoggedIn" class="btn btn--yellow" @click="goTo('./klasy')">klasy</button>
        </div>
      </div>
    </section>

    <!-- Feature Section 2: Text Left, Image Right -->
    <section class="feature feature-even">
      <div class="container feature-wrapper">
        <div class="feature-image">
          <img src="../assets/images/carlos-muza-hpjSkU2UYSU-unsplash.jpg" alt="Wykresy postępu" />
        </div>
        <div class="feature-content">
          <p>
            Uzyskaj narzędzia analityczne do śledzenia Twojego postępu i szybkie przeglądy całej
            Twojej nauki. Pokażemy monitor w Twoje wyniki, które pomogą Ci skutecznie rozwijać
            umiejętności językowe.
          </p>
          <button v-if="isLoggedIn" class="btn btn--yellow" @click="goTo('./profil')">
            Profil
          </button>
        </div>
      </div>
    </section>

    <!-- Feature Section 3: Image Left, Text Right -->
    <section class="feature feature-odd">
      <div class="container feature-wrapper">
        <div class="feature-image">
          <img src="../assets/images/wes-hicks-4-EeTnaC1S4-unsplash.jpg" alt="Student z laptopem" />
        </div>
        <div class="feature-content">
          <p>
            Zapewniamy Ci codzienny kontakt z językiem – ucz się poprzez codzienne nowości i
            zadania, które umożliwiają przyswajanie wiedzy i rozwijanie kompetencji językowych
            każdego dnia.
          </p>
          <button v-if="isLoggedIn" class="btn btn--yellow" @click="goTo('./themenmix')">
            Themenmix
          </button>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta">
      <div class="container final-wrapper">
        <p class="final-text">
          Dołącz, aby rozwijać swoje niemieckie umiejętności w przyjaznej społeczności. Nasza
          rosnąca baza materiałów czeka na Ciebie – rośnij razem z nami!
        </p>
        <button v-if="!isLoggedIn" class="btn btn--yellow" @click="goTo('./rejestruj')">
          Dołącz Teraz
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const isLoggedIn = authStore.isLoggedIn

const router = useRouter()

function goTo(route) {
  router.push(route)
}
</script>
