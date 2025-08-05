<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__background">
        <div class="hero__gradient"></div>
      </div>
      <div class="hero__content">
        <div class="hero__container">
          <h1 class="hero__title">
            <span class="hero__title-main">Zrozum Niemiecki</span>
            <span class="hero__title-accent">z pasją</span>
          </h1>
          <p class="hero__subtitle">
            Personalizowane notatki, codzienna praktyka i skuteczne metody nauki dopasowane do
            Twojego tempa
          </p>
          <div class="hero__stats">
            <div class="hero__stat">
              <span class="hero__stat-number">1000+</span>
              <span class="hero__stat-label">Zadań</span>
            </div>
            <div class="hero__stat">
              <span class="hero__stat-number">24/7</span>
              <span class="hero__stat-label">Dostęp</span>
            </div>
            <div class="hero__stat">
              <span class="hero__stat-number">95%</span>
              <span class="hero__stat-label">Skuteczność</span>
            </div>
          </div>
          <div class="hero__actions">
            <button
              v-if="!isLoggedIn"
              class="hero__btn hero__btn--primary"
              @click="goTo('./register')"
            >
              <span>Zacznij Teraz</span>
              <svg class="hero__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button
              v-if="!isLoggedIn"
              class="hero__btn hero__btn--secondary"
              @click="scrollToFeatures"
            >
              Dowiedz się więcej
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Intro Section -->
    <section class="intro-section" ref="featuresSection">
      <div class="intro-section__container">
        <h2 class="intro-section__title">Dlaczego wybieramy personalizację?</h2>
        <p class="intro-section__text">
          Dostosowujemy plan nauki do Twoich indywidualnych potrzeb, abyś mógł osiągnąć najlepsze
          efekty. Nasze spersonalizowane zadania i materiały pomagają rozwijać umiejętności w sposób
          skuteczny i dopasowany specjalnie do Ciebie.
        </p>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features-grid">
      <div class="features-grid__container">
        <div class="feature-card">
          <div class="feature-card__image-container">
            <img
              class="feature-card__image"
              src="../assets/images/john-schnobrich-2FPjlAyMQTA-unsplash.jpg"
              alt="Uczniowie z laptopem"
            />
            <div class="feature-card__overlay">
              <div class="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </div>
          <div class="feature-card__content">
            <h3 class="feature-card__title">Klasy z mentorami</h3>
            <p class="feature-card__description">
              Dołącz do klasy i ucz się pod okiem doświadczonych mentorów. Dzięki notatkom i
              ćwiczeniom praktycznym masz dostęp do najlepszych narzędzi edukacyjnych.
            </p>
            <button v-if="isLoggedIn" class="feature-card__btn" @click="goTo('./klasy')">
              <span>Przeglądaj klasy</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card__image-container">
            <img
              class="feature-card__image"
              src="../assets/images/carlos-muza-hpjSkU2UYSU-unsplash.jpg"
              alt="Wykresy postępu"
            />
            <div class="feature-card__overlay">
              <div class="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
            </div>
          </div>
          <div class="feature-card__content">
            <h3 class="feature-card__title">Analityka postępów</h3>
            <p class="feature-card__description">
              Uzyskaj zaawansowane narzędzia analityczne do śledzenia Twojego postępu. Szczegółowe
              raporty pomogą Ci skutecznie rozwijać umiejętności językowe.
            </p>
            <button v-if="isLoggedIn" class="feature-card__btn" @click="goTo('./profil')">
              <span>Zobacz profil</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card__image-container">
            <img
              class="feature-card__image"
              src="../assets/images/wes-hicks-4-EeTnaC1S4-unsplash.jpg"
              alt="Student z laptopem"
            />
            <div class="feature-card__overlay">
              <div class="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
          </div>
          <div class="feature-card__content">
            <h3 class="feature-card__title">Codzienna praktyka</h3>
            <p class="feature-card__description">
              Zapewniamy Ci codzienny kontakt z językiem poprzez świeże materiały i zadania, które
              pozwalają na systematyczne rozwijanie kompetencji językowych.
            </p>
            <button v-if="isLoggedIn" class="feature-card__btn" @click="goTo('./themenmix')">
              <span>Themenmix</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="cta-section">
      <div class="cta-section__container">
        <div class="cta-section__content">
          <h2 class="cta-section__title">Gotowy na przygodę z niemieckim?</h2>
          <p class="cta-section__text">
            Dołącz do rosnącej społeczności uczących się języka niemieckiego. Nasza bogata baza
            materiałów i przyjazna atmosfera czekają na Ciebie!
          </p>
          <div class="cta-section__benefits">
            <div class="cta-section__benefit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              <span>Darmowy start</span>
            </div>
            <div class="cta-section__benefit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              <span>Bez zobowiązań</span>
            </div>
            <div class="cta-section__benefit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              <span>Natychmiastowy dostęp</span>
            </div>
          </div>
          <button v-if="!isLoggedIn" class="cta-section__btn" @click="goTo('./register')">
            <span>Dołącz Teraz</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

import { ref } from 'vue'

const authStore = useAuthStore()
const isLoggedIn = authStore.isLoggedIn
const featuresSection = ref(null)

const router = useRouter()

function goTo(route) {
  router.push(route)
}

function scrollToFeatures() {
  featuresSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>

<style scoped lang="scss">
.home-page {
  font-family: system-ui, sans-serif;
  color: #1f2937;
}

.hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  overflow: hidden;

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &__gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%);
    opacity: 0.9;
  }

  &__content {
    position: relative;
    width: 100%;
    z-index: 2;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
    text-align: center;
    color: white;
  }

  &__title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;

    &-main {
      display: block;
    }

    &-accent {
      display: block;
      background: linear-gradient(45deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__subtitle {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  &__stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-number {
      font-size: 2rem;
      font-weight: 700;
      color: #fbbf24;
      line-height: 1;
    }

    &-label {
      font-size: 0.875rem;
      opacity: 0.8;
      margin-top: 0.25rem;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;

    &--primary {
      background: #fbbf24;
      color: #1f2937;
      box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);

      &:hover {
        background: #f59e0b;
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(251, 191, 36, 0.4);
      }
    }

    &--secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
    }

    &-icon {
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
    }

    &:hover &-icon {
      transform: translateX(2px);
    }
  }
}

.intro-section {
  padding: 5rem 0;
  background: white;

  &__container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 2rem;
  }

  &__text {
    font-size: 1.25rem;
    line-height: 1.7;
    color: #4b5563;
  }
}

.features-grid {
  padding: 5rem 0;
  background: #f8f9fa;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
}

.feature-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  &__image-container {
    position: relative;
    height: 250px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(99, 102, 241, 0.8));
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover &__overlay {
    opacity: 1;
  }

  &:hover &__image {
    transform: scale(1.1);
  }

  &__icon {
    width: 60px;
    height: 60px;
    color: white;

    svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5;
    }
  }

  &__content {
    padding: 2rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  &__description {
    font-size: 1rem;
    line-height: 1.6;
    color: #4b5563;
    margin-bottom: 2rem;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #4338ca;
      transform: translateX(2px);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
}

.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;

  &__container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  &__content {
    text-align: center;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  &__text {
    font-size: 1.25rem;
    line-height: 1.7;
    margin-bottom: 3rem;
    opacity: 0.9;
  }

  &__benefits {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }

  &__benefit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;

    svg {
      width: 20px;
      height: 20px;
      color: #10b981;
      stroke-width: 2;
    }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 600;
    background: #fbbf24;
    color: #1f2937;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);

    &:hover {
      background: #f59e0b;
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(251, 191, 36, 0.4);
    }

    svg {
      width: 20px;
      height: 20px;
      transition: transform 0.2s ease;
    }

    &:hover svg {
      transform: translateX(2px);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .hero {
    &__stats {
      gap: 2rem;
    }

    &__stat-number {
      font-size: 2rem;
    }

    &__actions {
      flex-direction: column;
      align-items: center;
    }

    &__btn {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }
  }

  .intro-section {
    padding: 3rem 0;

    &__title {
      font-size: 2rem;
    }

    &__text {
      font-size: 1.125rem;
    }
  }

  .features-grid {
    padding: 3rem 0;

    &__container {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .feature-card {
    &__image-container {
      height: 200px;
    }

    &__content {
      padding: 1.5rem;
    }
  }

  .cta-section {
    padding: 3rem 0;

    &__title {
      font-size: 2rem;
    }

    &__text {
      font-size: 1.125rem;
    }

    &__benefits {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
  }
}

@media (max-width: 480px) {
  .hero {
    &__stats {
      flex-direction: column;
      gap: 1rem;
    }

    &__container {
      padding: 0 1rem;
    }
  }

  .intro-section,
  .features-grid,
  .cta-section {
    &__container {
      padding: 0 1rem;
    }
  }

  .feature-card {
    &__content {
      padding: 1.25rem;
    }
  }
}
</style>
