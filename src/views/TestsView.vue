<template>
  <div class="tests-page">
    <!-- Hero Section -->
    <section class="tests-page__hero">
      <div class="tests-page__hero-content">
        <h1 class="tests-page__hero-title">Test Poziomujący</h1>
        <p class="tests-page__hero-subtitle">
          Sprawdź swój poziom językowy dzięki naszym precyzyjnym testom diagnostycznym
        </p>
      </div>
    </section>

    <!-- Tests Section -->
    <section class="tests-page__tests">
      <div class="container">
        <div class="tests-page__tests-grid">
          <!-- Test A1 -->
          <div class="tests-page__test-card tests-page__test-card--green">
            <div class="tests-page__test-image">
              <img
                src="../assets/images/annie-spratt-xKJUnFwfz3s-unsplash.jpg"
                alt="Test A1"
                class="tests-page__test-img"
              />
              <div class="tests-page__test-overlay">
                <div class="tests-page__test-level-badge">A1</div>
              </div>
            </div>
            <div class="tests-page__test-content">
              <div class="tests-page__test-header">
                <h3 class="tests-page__test-title">Poziom Podstawowy</h3>
                <span class="tests-page__test-badge tests-page__test-badge--green"
                  >Początkujący</span
                >
              </div>
              <p class="tests-page__test-description">
                Używasz prostych wyrażeń i zdań do podstawowej komunikacji. Idealne dla osób
                rozpoczynających naukę języka.
              </p>

              <button
                class="tests-page__btn tests-page__btn--primary tests-page__btn--green"
                @click="() => goTo('A1')"
              >
                Rozpocznij Test A1
              </button>
            </div>
          </div>

          <!-- Test A2 -->
          <div class="tests-page__test-card tests-page__test-card--blue">
            <div class="tests-page__test-image">
              <img
                src="../assets/images/ben-mullins-je240KkJIuA-unsplash.jpg"
                alt="Test A2"
                class="tests-page__test-img"
              />
              <div class="tests-page__test-overlay">
                <div class="tests-page__test-level-badge">A2</div>
              </div>
            </div>
            <div class="tests-page__test-content">
              <div class="tests-page__test-header">
                <h3 class="tests-page__test-title">Poziom Rozwijający</h3>
                <span class="tests-page__test-badge tests-page__test-badge--blue"
                  >Średniozaawansowany</span
                >
              </div>
              <p class="tests-page__test-description">
                Radzisz sobie w codziennych sytuacjach i prostych rozmowach. Następny krok w Twojej
                językowej podróży.
              </p>

              <button
                class="tests-page__btn tests-page__btn--primary tests-page__btn--blue"
                @click="() => goTo('A2')"
              >
                Rozpocznij Test A2
              </button>
            </div>
          </div>

          <!-- Test B1 -->
          <div class="tests-page__test-card tests-page__test-card--purple">
            <div class="tests-page__test-image">
              <img
                src="../assets/images/polina-eroshkina-IS2RNcXwCFs-unsplash.jpg"
                alt="Test B1"
                class="tests-page__test-img"
              />
              <div class="tests-page__test-overlay">
                <div class="tests-page__test-level-badge">B1</div>
              </div>
            </div>
            <div class="tests-page__test-content">
              <div class="tests-page__test-header">
                <h3 class="tests-page__test-title">Poziom Zaawansowany</h3>
                <span class="tests-page__test-badge tests-page__test-badge--purple"
                  >Zaawansowany</span
                >
              </div>
              <p class="tests-page__test-description">
                Rozumiesz i wyrażasz się na znane tematy w typowych sytuacjach. Dla osób gotowych na
                większe wyzwania.
              </p>

              <button
                class="tests-page__btn tests-page__btn--primary tests-page__btn--purple"
                @click="() => goTo('B1')"
              >
                Rozpocznij Test B1
              </button>
            </div>
          </div>
        </div>
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

<style lang="scss" scoped>
// Zmienne SCSS
$primary-color: #4f46e5;
$secondary-color: #f59e0b;
$text-dark: #111827;
$text-light: #ffffff;
$text-gray: #6b7280;
$bg-light: #f8fafc;

// Kolory dla kart
$green: #10b981;
$green-light: #d1fae5;
$blue: #3b82f6;
$blue-light: #dbeafe;
$purple: #8b5cf6;
$purple-light: #ede9fe;

$shadow:
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg:
  0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05);
$border-radius: 16px;

// Reset i podstawowe style
.tests-page {
  color: $text-dark;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;

  // Hero Section
  &__hero {
    padding: 5rem 0;
    text-align: center;
    color: $text-light;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        repeat;
      opacity: 0.5;
    }
  }

  &__hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 2;
  }

  &__hero-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 2rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  &__hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: $text-light;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  &__hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }

  // Section Title
  &__section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 3rem;
  }

  // Tests Section
  &__tests {
    padding: 5rem 0;
    background: white;
  }

  &__tests-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
  }

  &__test-card {
    background: white;
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: $shadow;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    flex: 0 1 350px;
    max-width: 350px;

    &:hover {
      transform: translateY(-8px);
      box-shadow: $shadow-lg;
    }

    &--green {
      &:hover {
        border-color: $green;
      }
    }

    &--blue {
      &:hover {
        border-color: $blue;
      }
    }

    &--purple {
      &:hover {
        border-color: $purple;
      }
    }
  }

  &__test-image {
    position: relative;
    height: 220px;
    overflow: hidden;
  }

  &__test-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &__test-card:hover &__test-img {
    transform: scale(1.05);
  }

  &__test-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__test-level-badge {
    background: rgba(255, 255, 255, 0.9);
    color: $text-dark;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 1.25rem;
    font-weight: bold;
    backdrop-filter: blur(10px);
  }

  &__test-content {
    padding: 2rem;
  }

  &__test-header {
    margin-bottom: 1rem;
  }

  &__test-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 0.5rem;
  }

  &__test-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;

    &--green {
      background-color: $green;
    }

    &--blue {
      background-color: $blue;
    }

    &--purple {
      background-color: $purple;
    }
  }

  &__test-description {
    color: $text-gray;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  &__test-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  &__test-feature {
    font-size: 0.875rem;
    color: $text-gray;
    background: $bg-light;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
  }

  // CTA Section
  &__cta {
    padding: 5rem 0;
    background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 10%) 100%);
    color: $text-light;
    text-align: center;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E")
        repeat;
    }
  }

  &__cta-content {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 2;
  }

  &__cta-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  &__cta-text {
    font-size: 1.125rem;
    opacity: 0.9;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
}

// Container
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

// Tests Page Button Component (BEM)
.tests-page__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: $border-radius;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;

  &--primary {
    color: $text-light;

    &.tests-page__btn--green {
      background: linear-gradient(135deg, $green, darken($green, 10%));

      &:hover {
        background: linear-gradient(135deg, darken($green, 5%), darken($green, 15%));
        transform: translateY(-2px);
      }
    }

    &.tests-page__btn--blue {
      background: linear-gradient(135deg, $blue, darken($blue, 10%));

      &:hover {
        background: linear-gradient(135deg, darken($blue, 5%), darken($blue, 15%));
        transform: translateY(-2px);
      }
    }

    &.tests-page__btn--purple {
      background: linear-gradient(135deg, $purple, darken($purple, 10%));

      &:hover {
        background: linear-gradient(135deg, darken($purple, 5%), darken($purple, 15%));
        transform: translateY(-2px);
      }
    }
  }

  &--secondary {
    background: linear-gradient(135deg, $secondary-color, darken($secondary-color, 10%));
    color: $text-dark;

    &:hover {
      background: linear-gradient(
        135deg,
        darken($secondary-color, 5%),
        darken($secondary-color, 15%)
      );
      transform: translateY(-2px);
    }
  }

  &-arrow {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  &:hover &-arrow {
    transform: translateX(4px);
  }

  &-link {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

// Media Queries
@media (max-width: 768px) {
  .tests-page {
    &__hero {
      padding: 4rem 0;
    }

    &__hero-title {
      font-size: 2.5rem;
    }

    &__hero-subtitle {
      font-size: 1rem;
    }

    &__section-title {
      font-size: 2rem;
    }

    &__tests {
      padding: 4rem 0;
    }

    &__tests-grid {
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    &__test-card {
      max-width: 100%;
      flex: none;
    }

    &__cta {
      padding: 4rem 0;
    }

    &__cta-title {
      font-size: 2rem;
    }
  }

  .tests-page__btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .tests-page {
    &__hero-title {
      font-size: 2rem;
    }

    &__test-content {
      padding: 1.5rem;
    }

    &__test-features {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}
</style>
