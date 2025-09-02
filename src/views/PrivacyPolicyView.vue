<template>
  <div class="privacy-policy">
    <div class="container">
      <header>
        <h1>Polityka Prywatności</h1>
        <p class="date">Ostatnia aktualizacja: {{ lastUpdated }}</p>
      </header>

      <main>
        <section>
          <h2>1. Informacje ogólne</h2>
          <p>
            Niniejsza polityka prywatności określa zasady przetwarzania i ochrony danych osobowych
            użytkowników naszej strony internetowej zgodnie z RODO.
          </p>
        </section>

        <section>
          <h2>2. Jakie dane zbieramy</h2>
          <div class="data-grid">
            <div class="data-card">
              <h3>Dane kontaktowe</h3>
              <ul>
                <li>Imię i nazwisko</li>
                <li>Adres e-mail</li>
                <li>Numer telefonu</li>
                <li>Treść wiadomości</li>
              </ul>
            </div>
            <div class="data-card">
              <h3>Dane techniczne</h3>
              <ul>
                <li>Adres IP</li>
                <li>Typ i wersja przeglądarki</li>
                <li>System operacyjny</li>
                <li>Czas wizyty na stronie</li>
                <li>Odwiedzane podstrony</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2>3. Jak wykorzystujemy dane</h2>
          <ul class="purpose-list">
            <li>Świadczenie usług i obsługa klienta</li>
            <li>Komunikacja z użytkownikami</li>
            <li>Analiza i ulepszanie naszych usług</li>
            <li>Zapewnienie bezpieczeństwa</li>
          </ul>
        </section>

        <section>
          <h2>4. Pliki cookie</h2>
          <p>
            Nasza strona używa plików cookie do poprawy funkcjonalności i analizy ruchu. Możesz
            zarządzać ustawieniami cookie w swojej przeglądarce.
          </p>
        </section>

        <section>
          <h2>5. Twoje prawa</h2>
          <div class="rights-list">
            <div class="right">
              <strong>Dostęp do danych</strong> - możesz poprosić o kopię swoich danych
            </div>
            <div class="right">
              <strong>Poprawianie danych</strong> - możesz poprawić nieprawidłowe informacje
            </div>
            <div class="right">
              <strong>Usunięcie danych</strong> - możesz poprosić o usunięcie swoich danych
            </div>
            <div class="right">
              <strong>Przenoszenie danych</strong> - możesz otrzymać dane w czytelnym formacie
            </div>
          </div>
        </section>

        <section>
          <h2>6. Kontakt</h2>
          <div class="contact">
            <p>
              <strong>E-mail:</strong>
              <a href="mailto:czasnaniemiecki@gmail.com">czasnaniemiecki@gmail.com</a>
            </p>
            <p><strong>Telefon:</strong> <a href="tel:+48506940830">+48 506 940 830</a></p>
            <p>
              <strong>Adres:</strong>
              <a
                href="https://www.google.com/maps/place/Micha%C5%82a+Drzyma%C5%82y+5C,+87-100+Toru%C5%84/@52.992938,18.5949033,17z/data=!3m1!4b1!4m6!3m5!1s0x47033514f54612c9:0x8c0e74916cea3230!8m2!3d52.9929348!4d18.5974782!16s%2Fg%2F11c5dtx7wr?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                >Michała Drzymały 5C, 87-100 Toruń</a
              >
            </p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  data() {
    return {
      lastUpdated: '15 sierpnia 2025',
    }
  },
  methods: {},
}
</script>
