<template>
  <div>
    <!-- Hero Section with Gradient Background -->
    <section class="bg-gradient-banner relative overflow-hidden">
      <div class="absolute -bottom-24 right-0 w-1/2 h-full opacity-10">
        <div class="w-full h-full bg-opacity-10 bg-pattern"></div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Direkte Vermittlung für Ärzte und Kliniken
            </h1>
            <p class="text-xl text-white/90 mb-8 max-w-lg">
              Verbinden Sie sich direkt mit Ärzten oder Kliniken ohne Umwege. Schnell, einfach und 
              kosteneffizient.
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link :to="{ name: 'ForDoctors' }" class="btn-primary text-lg px-6 py-3">
                Für Ärzte
              </router-link>
              <router-link :to="{ name: 'ForHospitals' }" class="btn-secondary text-lg px-6 py-3">
                Für Kliniken
              </router-link>
            </div>
          </div>
          <div class="hidden md:block">
            <img 
              src="@/assets/hero-image.svg" 
              alt="Arztvermittlung" 
              class="w-full h-auto rounded-xl shadow-2xl transform rotate-1 border-4 border-white/30"
            />
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-heading mb-6">Warum MedMatch?</h2>
          <p class="text-xl text-neutral-600 max-w-3xl mx-auto">
            Unsere Plattform verbindet medizinische Fachkräfte und Einrichtungen direkt, ohne teure Vermittlungsgebühren.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div class="feature-card">
            <div class="feature-icon bg-primary-100 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-heading mb-3">Kein Vermittlungshonorar</h3>
            <p class="text-neutral-600">
              Direkte Vermittlung ohne zusätzliche Kosten. Sie zahlen keine hohen Vermittlungsgebühren wie bei traditionellen Agenturen.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon bg-secondary-100 text-secondary-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-heading mb-3">Schnelle Vermittlung</h3>
            <p class="text-neutral-600">
              Direkter Kontakt zwischen Ärzten und Kliniken beschleunigt den Vermittlungsprozess erheblich.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon bg-accent-100 text-accent-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-heading mb-3">Sichere Plattform</h3>
            <p class="text-neutral-600">
              Daten werden sicher verarbeitet und der Kontakt erfolgt nur zwischen verifizierten Partnern.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-neutral-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-heading mb-6">So funktioniert's</h2>
          <p class="text-xl text-neutral-600 max-w-3xl mx-auto">
            Einfacher Prozess für Ärzte und Kliniken, um schnell zusammenzufinden.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
          <!-- For Doctors -->
          <div class="bg-white rounded-xl shadow-card p-8 border border-neutral-200">
            <div class="flex items-center gap-4 mb-6">
              <div class="bg-gradient-primary text-white p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-heading">Für Ärzte</h3>
            </div>
            <ol class="relative border-l-2 border-primary-200 pl-8 space-y-8">
              <li class="process-step">
                <div class="process-number">1</div>
                <h4 class="text-lg font-bold text-heading mb-2">Profil erstellen</h4>
                <p class="text-neutral-600">Geben Sie Ihre Qualifikationen, Erfahrungen und Präferenzen an.</p>
              </li>
              <li class="process-step">
                <div class="process-number">2</div>
                <h4 class="text-lg font-bold text-heading mb-2">Stellenangebote finden</h4>
                <p class="text-neutral-600">Durchsuchen Sie passende Stellenangebote von Kliniken und Krankenhäusern.</p>
              </li>
              <li class="process-step">
                <div class="process-number">3</div>
                <h4 class="text-lg font-bold text-heading mb-2">Direkter Kontakt</h4>
                <p class="text-neutral-600">Nehmen Sie ohne Umwege direkten Kontakt mit den Einrichtungen auf.</p>
              </li>
            </ol>
            <div class="mt-8">
              <router-link :to="{ name: 'ForDoctors' }" class="btn-primary w-full text-center py-3">
                Als Arzt registrieren
              </router-link>
            </div>
          </div>

          <!-- For Hospitals -->
          <div class="bg-white rounded-xl shadow-card p-8 border border-neutral-200">
            <div class="flex items-center gap-4 mb-6">
              <div class="bg-gradient-secondary text-white p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-heading">Für Kliniken</h3>
            </div>
            <ol class="relative border-l-2 border-secondary-200 pl-8 space-y-8">
              <li class="process-step">
                <div class="process-number secondary">1</div>
                <h4 class="text-lg font-bold text-heading mb-2">Stellenangebote erstellen</h4>
                <p class="text-neutral-600">Beschreiben Sie Ihre offenen Stellen und benötigten Qualifikationen.</p>
              </li>
              <li class="process-step">
                <div class="process-number secondary">2</div>
                <h4 class="text-lg font-bold text-heading mb-2">Nach Ärzten suchen</h4>
                <p class="text-neutral-600">Finden Sie qualifizierte Ärzte, die Ihren Anforderungen entsprechen.</p>
              </li>
              <li class="process-step">
                <div class="process-number secondary">3</div>
                <h4 class="text-lg font-bold text-heading mb-2">Direkte Kontaktaufnahme</h4>
                <p class="text-neutral-600">Kontaktieren Sie interessante Kandidaten ohne Vermittlungsgebühren.</p>
              </li>
            </ol>
            <div class="mt-8">
              <router-link :to="{ name: 'ForHospitals' }" class="btn-secondary w-full text-center py-3">
                Als Klinik registrieren
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bg-gradient-banner py-20 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Das sagen unsere Nutzer</h2>
          <p class="text-xl text-white/80 max-w-3xl mx-auto">
            Erfahrungen von Ärzten und Kliniken, die unsere Plattform bereits erfolgreich genutzt haben.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="testimonial-card">
            <div class="mb-4 text-accent-300">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
              </svg>
            </div>
            <p class="text-white/90 mb-6">
              "Über MedMatch habe ich innerhalb von zwei Wochen meine neue Stelle als Oberarzt gefunden. Der direkte Kontakt hat den Prozess sehr beschleunigt."
            </p>
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold mr-4">
                TM
              </div>
              <div>
                <h4 class="font-bold">Dr. Thomas Müller</h4>
                <p class="text-white/70 text-sm">Facharzt für Innere Medizin</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="mb-4 text-accent-300">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
              </svg>
            </div>
            <p class="text-white/90 mb-6">
              "Als kleine Fachklinik konnten wir uns teure Personalvermittler nicht leisten. MedMatch hat uns ermöglicht, trotzdem qualifizierte Fachärzte zu finden."
            </p>
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full bg-secondary-700 flex items-center justify-center text-white font-bold mr-4">
                MS
              </div>
              <div>
                <h4 class="font-bold">Maria Schmidt</h4>
                <p class="text-white/70 text-sm">Personalleiterin, Fachklinik Heidelberg</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="mb-4 text-accent-300">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
              </svg>
            </div>
            <p class="text-white/90 mb-6">
              "Nach meiner Facharztausbildung wollte ich in eine andere Region wechseln. Durch MedMatch fand ich Kliniken, die genau meinen Vorstellungen entsprachen."
            </p>
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full bg-accent-700 flex items-center justify-center text-white font-bold mr-4">
                SW
              </div>
              <div>
                <h4 class="font-bold">Dr. Sarah Weber</h4>
                <p class="text-white/70 text-sm">Fachärztin für Neurologie</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-secondary rounded-2xl shadow-xl p-8 md:p-12">
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
              Bereit, den nächsten Schritt zu gehen?
            </h2>
            <p class="text-xl text-white/90 mb-8">
              Ob als Arzt auf der Suche nach neuen Möglichkeiten oder als Klinik auf der Suche nach qualifizierten Fachkräften – MedMatch hilft Ihnen dabei, schnell und direkt die passenden Kontakte zu knüpfen.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <router-link :to="{ name: 'ForDoctors' }" class="btn-white text-lg px-8 py-3 bg-white text-secondary-700 hover:bg-neutral-100">
                Für Ärzte
              </router-link>
              <router-link :to="{ name: 'ForHospitals' }" class="btn-outline text-lg px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10">
                Für Kliniken
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest News/Bulletin Board Preview -->
    <section class="py-20 bg-neutral-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-heading mb-6">Aktuelle Pinnwand-Einträge</h2>
          <p class="text-xl text-neutral-600 max-w-3xl mx-auto">
            Die neuesten Angebote und Gesuche von Ärzten und Kliniken auf unserer Plattform.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div class="bg-white rounded-xl shadow-card overflow-hidden border border-neutral-200 hover:shadow-strong transition-shadow">
            <div class="bg-primary-100 text-primary-700 py-2 px-4 text-sm font-semibold">
              Stellenangebot
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-heading mb-3">Facharzt für Anästhesie (m/w/d)</h3>
              <p class="text-neutral-600 mb-4 line-clamp-3">
                Klinikum Frankfurt sucht zum nächstmöglichen Zeitpunkt einen Facharzt für Anästhesie in Vollzeit. Wir bieten ein kollegiales Team und attraktive Arbeitsbedingungen.
              </p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-neutral-500">Vor 2 Tagen</span>
                <router-link :to="{ name: 'BulletinBoard' }" class="text-primary-600 font-medium hover:text-primary-800">
                  Details ansehen
                </router-link>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-card overflow-hidden border border-neutral-200 hover:shadow-strong transition-shadow">
            <div class="bg-secondary-100 text-secondary-700 py-2 px-4 text-sm font-semibold">
              Stellengesuch
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-heading mb-3">Chirurg sucht neue Herausforderung</h3>
              <p class="text-neutral-600 mb-4 line-clamp-3">
                Facharzt für Allgemeinchirurgie mit 8 Jahren Erfahrung sucht neue Position in München oder Umgebung. Spezialgebiete: Laparoskopische Chirurgie und Traumatologie.
              </p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-neutral-500">Vor 3 Tagen</span>
                <router-link :to="{ name: 'BulletinBoard' }" class="text-primary-600 font-medium hover:text-primary-800">
                  Details ansehen
                </router-link>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-card overflow-hidden border border-neutral-200 hover:shadow-strong transition-shadow">
            <div class="bg-accent-100 text-accent-700 py-2 px-4 text-sm font-semibold">
              Vertretung
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-heading mb-3">Kurzzeitige Vertretung für Gynäkologie</h3>
              <p class="text-neutral-600 mb-4 line-clamp-3">
                Praxisklinik in Berlin sucht für den Zeitraum 15.08.-30.09. eine Vertretung für Gynäkologie. Flexible Arbeitszeiten möglich, attraktive Vergütung.
              </p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-neutral-500">Vor 5 Tagen</span>
                <router-link :to="{ name: 'BulletinBoard' }" class="text-primary-600 font-medium hover:text-primary-800">
                  Details ansehen
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <router-link :to="{ name: 'BulletinBoard' }" class="btn-primary px-6 py-3 inline-flex items-center">
            Alle Einträge ansehen
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// No additional script needed
</script>

<style scoped>
.feature-card {
  @apply bg-white p-6 rounded-xl shadow-card border border-neutral-200;
  @apply transition-all duration-300 hover:shadow-strong hover:-translate-y-1;
}

.feature-icon {
  @apply p-4 rounded-full inline-flex items-center justify-center mb-4;
}

.testimonial-card {
  @apply bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/30 shadow-lg;
}

.process-step {
  @apply relative mb-6 pb-2;
}

.process-number {
  @apply absolute -left-10 flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white font-bold text-sm;
}

.process-number.secondary {
  @apply bg-secondary-500;
}

/* Hintergrundmuster für medizinisches Design */
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L10 20M0 10L20 10' stroke='white' opacity='0.3' stroke-width='1'/%3E%3C/svg%3E");
  background-size: 20px 20px;
}
</style> 