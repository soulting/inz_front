<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section contact-info">
        <h3>Kontakt</h3>
        <p>
          Email:
          <a :href="`mailto:czasnaniemiecki@gmail.com`">czasnaniemiecki@gmail.com</a>
        </p>
        <p>
          Telefon:
          <a :href="`tel:48506940830`">+48 506 940 830</a>
        </p>

        <p>
          Adres:
          <a
            :href="`https://www.google.com/maps/place/Micha%C5%82a+Drzyma%C5%82y+5C,+87-100+Toru%C5%84/@52.992938,18.5949033,17z/data=!3m1!4b1!4m6!3m5!1s0x47033514f54612c9:0x8c0e74916cea3230!8m2!3d52.9929348!4d18.5974782!16s%2Fg%2F11c5dtx7wr?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D`"
            target="_blank"
            >Michała Drzymały 5C, 87-100 Toruń</a
          >
        </p>
      </div>

      <div class="footer-section navigation">
        <h3>Nawigacja</h3>
        <div @click="goTo('/')">Strona główna</div>
        <div @click="goTo('/themenmix')">Themenmix</div>
        <div @click="goTo('/test')">Test</div>
        <div @click="goTo('/klassen')">Klasy</div>
      </div>

      <div class="footer-section legal">
        <h3>Informacje prawne</h3>
        <div @click="goTo('/privacy-policy')">Polityka prywatności</div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2025 Andrzej Insadowski. Wszelkie prawa zastrzeżone.</p>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (informationSite) => {
  router.push(informationSite)
}
</script>

<style scoped>
.footer {
  background-color: #1a1a1a;
  color: #f4f4f4;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  text-align: left;
  gap: 10px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  margin: 0 15px;
  gap: 5px;
  justify-content: start;
}

.footer-section h3 {
  font-size: 1.4em;
  margin-bottom: 15px;
  color: #e0e0e0;
}

.footer-section p {
  margin: 0;
  line-height: 1.6;
}

.info-link {
  text-decoration: none;
  color: #f4f4f4;
  transition: color 0.2s ease;
}

.info-link:hover {
  cursor: pointer;
  color: #007bff;
}

.navigation {
  display: none;
}

.legal div,
.navigation div {
  cursor: pointer;
  transition: color 0.2s;
  color: #f4f4f4;
}

.legal div:hover,
.navigation div:hover {
  cursor: pointer;
  color: #007bff;
}

.footer-bottom {
  margin-top: 30px;
  text-align: center;
  font-size: 0.9em;
  color: #a0a0a0;
  border-top: 1px solid #333;
  padding-top: 15px;
}
a {
  text-decoration: none;
  color: #f4f4f4;
}

a:hover {
  cursor: pointer;
  color: #007bff;
}

@media (min-width: 500px) {
  .footer-section {
    margin: 0 50px;
  }
}

@media (min-width: 825px) {
  .footer-content {
    justify-content: center;
    gap: 20px;
  }
}

@media (min-width: 1050px) {
  .navigation {
    display: flex;
  }
}
</style>
