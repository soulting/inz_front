<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__content">
        <!-- Contact Section -->
        <div class="footer__section">
          <h3 class="footer__title">Kontakt</h3>
          <div class="footer__contact">
            <a href="mailto:czasnaniemiecki@gmail.com" class="footer__link">
              czasnaniemiecki@gmail.com
            </a>
            <a href="tel:+48506940830" class="footer__link"> +48 506 940 830 </a>
            <a
              href="https://www.google.com/maps/place/Micha%C5%82a+Drzyma%C5%82y+5C,+87-100+Toru%C5%84/@52.992938,18.5949033,17z/data=!3m1!4b1!4m6!3m5!1s0x47033514f54612c9:0x8c0e74916cea3230!8m2!3d52.9929348!4d18.5974782!16s%2Fg%2F11c5dtx7wr?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              class="footer__link"
            >
              Michała Drzymały 5C, 87-100 Toruń
            </a>
          </div>
        </div>

        <!-- Navigation Section -->
        <div class="footer__section">
          <h3 class="footer__title">Nawigacja</h3>
          <div class="footer__links">
            <a @click="goTo('/')" class="footer__link">Strona główna</a>
            <a @click="goTo('/themenmix')" class="footer__link">Themenmix</a>
            <a @click="goTo('/test')" class="footer__link">Test</a>
            <a @click="goTo('/classes')" class="footer__link">Klasy</a>
          </div>
        </div>

        <!-- Legal Section -->
        <div class="footer__section">
          <h3 class="footer__title">Informacje prawne</h3>
          <div class="footer__links">
            <a @click="goTo('/privacy-policy')" class="footer__link">Polityka prywatności</a>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© 2025 Andrzej Insadowski. Wszelkie prawa zastrzeżone.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (route) => {
  router.push(route)
}
</script>

<style scoped lang="scss">
.footer {
  background: #1f2937;
  color: #f9fafb;
  font-family: system-ui, sans-serif;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 3rem 0 2rem;
  }

  &__section {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #fbbf24;
    margin-bottom: 1rem;
    margin-top: 0;
  }

  &__contact,
  &__links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__link {
    color: #d1d5db;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
    cursor: pointer;

    &:hover {
      color: #fbbf24;
    }
  }

  &__bottom {
    border-top: 1px solid #374151;
    padding: 1.5rem 0;
    text-align: center;

    p {
      color: #9ca3af;
      font-size: 0.875rem;
      margin: 0;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .footer {
    &__container {
      padding: 0 1rem;
    }

    &__content {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 2rem 0 1.5rem;
    }
  }
}
</style>
