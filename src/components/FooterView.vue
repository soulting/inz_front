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
