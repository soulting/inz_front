<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay">
        <h1 class="hero-title">Test poziomującyc</h1>
        <p class="hero-subtitle">
          Aby ocenić Twój poziom językowy i zidentyfikować mocne oraz słabsze obszary, przygotowano
          dwa testy diagnostyczne:
        </p>
      </div>
    </section>

    <!-- Intro Section -->
    <section class="intro">
      <div class="container">
        <p class="intro-text"></p>
      </div>
    </section>

    <!-- Feature Section 1: Image Left, Text Right -->
    <section class="feature feature-odd">
      <div class="container feature-wrapper">
        <div class="feature-image">
          <img
            src="../assets/images/annie-spratt-xKJUnFwfz3s-unsplash.jpg"
            alt="Uczniowie z laptopem"
          />
        </div>
        <div class="feature-content">
          <p>A1: Używasz prostych wyrażeń i zdań do podstawowej komunikacji.</p>
          <button class="btn btn-primary" @click="() => goTo('A1')">TEST A1</button>
        </div>
      </div>
    </section>

    <!-- Feature Section 2: Text Left, Image Right -->
    <section class="feature feature-even">
      <div class="container feature-wrapper">
        <div class="feature-image">
          <img src="../assets/images/ben-mullins-je240KkJIuA-unsplash.jpg" alt="Wykresy postępu" />
        </div>
        <div class="feature-content">
          <p>A2: Radzisz sobie w codziennych sytuacjach i prostych rozmowach.</p>
          <button class="btn btn-primary" @click="() => goTo('A2')">TEST A2</button>
        </div>
      </div>
    </section>

    <!-- Feature Section 3: Image Left, Text Right -->
    <section class="feature feature-odd">
      <div class="container feature-wrapper">
        <div class="feature-image">
          <img
            src="../assets/images/polina-eroshkina-IS2RNcXwCFs-unsplash.jpg"
            alt="Student z laptopem"
          />
        </div>
        <div class="feature-content">
          <p>B1: Rozumiesz i wyrażasz się na znane tematy w typowych sytuacjach.</p>
          <button class="btn btn-primary" @click="() => goTo('B1')">TEST B1</button>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta">
      <div class="container final-wrapper">
        <p class="final-text"></p>
        <button v-if="!isLoggedIn" class="btn btn-secondary">
          <router-link to="signup"> Dołącz Teraz</router-link>
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

function goTo(level) {
  router.push({ name: 'test-detail', params: { level: level } })
}
</script>

<style scoped>
/* Reset i podstawowe style */
.home-page {
  color: #333;
  margin: 0;
  padding: 0;
  background-color: white;
}

/* --- Hero Section --- */
.hero {
  position: relative;
  width: 100%;
  height: 60vh;
  min-height: 350px;
  background: url('../assets/images/element5-digital-OyCl7Y4y0Bk-unsplash.jpg') no-repeat
    center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 45%;
}

.hero-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #fff;
  margin-bottom: 1rem;
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: 10px;
  font-weight: 600;
}

.btn-primary {
  background-color: #3b4bdc;
  color: #fff;
  padding: 1rem 1rem;
  font-size: 2rem;
  transition: background-color 0.3s ease;
  width: 90%;
}

.btn-primary:hover {
  background-color: #2e36a8;
}

/* --- Intro Section --- */
.intro {
  background-color: #3b4bdc;
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.intro-text {
  color: #ffd700;
  font-size: 1.1rem;
  line-height: 1.5;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

/* --- Feature Sections --- */
.feature {
  padding: 2rem 0;
}

.feature-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

/* Obrazki */
.feature-image {
  flex: 1 1 50%;
  padding: 1rem;
  box-sizing: border-box;
}

.feature-image img {
  width: 100%;
  border-radius: 8px;
  display: block;
}

/* Treść */
.feature-content {
  flex: 1 1 50%;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.feature-content p {
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.6;
}

/* Odwrócenie układu na większych ekranach */
.feature-even .feature-wrapper {
  flex-direction: column-reverse;
}

@media (min-width: 768px) {
  .feature-even .feature-wrapper {
    flex-direction: row-reverse;
  }
}

/* --- Final CTA Section --- */
.final-cta {
  background-color: #3b4bdc;
  padding: 2rem 1rem;
}

.final-wrapper {
  text-align: center;
}

.final-text {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.btn-secondary {
  background-color: #ffd700;
  /* width: auto; */
  color: #333;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #e6c200;
}

/* --- Media Queries --- */
@media (max-width: 600px) {
  .hero-overlay {
    padding: 1rem;
  }
  .hero-title {
    font-size: 1.5rem;
  }
  .hero-subtitle {
    font-size: 0.9rem;
  }
  .btn-primary,
  .btn-secondary {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
  .intro-text,
  .final-text {
    font-size: 0.9rem;
  }
  .feature-content p {
    font-size: 0.9rem;
  }
}

@media (max-width: 400px) {
  .hero {
    height: 50vh;
  }
  .hero-title {
    font-size: 1.2rem;
  }
  .hero-subtitle {
    font-size: 0.8rem;
  }
  .btn-primary,
  .btn-secondary {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  .feature-wrapper {
    flex-direction: column;
  }
  .feature-image,
  .feature-content {
    flex: 1 1 100%;
    padding: 0.5rem;
  }
  .feature-content p {
    font-size: 0.85rem;
  }
}
</style>
