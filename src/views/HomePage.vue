<template>
  <div>
    <!-- Simplified Hero Section -->
    <section class="bg-gradient-banner relative overflow-hidden min-h-[500px] flex items-center">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full opacity-10">
          <div class="w-full h-full bg-pattern"></div>
        </div>
      </div>
      
      <div class="container mx-auto px-4 py-12 relative z-10">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <!-- Hero Content -->
          <div class="text-white animate-fade-in-up">
            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">Direkte Verbindung zwischen Ärzten und Kliniken</h1>
            <p class="text-xl mb-6 text-white/90">
              Unsere Pinnwand ermöglicht den einfachen Austausch zwischen medizinischen Fachkräften und Einrichtungen - mit minimaler Registrierung.
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link :to="{ name: 'BulletinBoard' }" class="btn-hero-primary px-6 py-3">
                Pinnwand ansehen
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </router-link>
              <router-link :to="{ name: 'Register' }" class="btn-hero-secondary px-6 py-3">
                Jetzt registrieren
              </router-link>
            </div>
            
            <div class="mt-8 grid grid-cols-2 gap-6">
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 class="font-semibold text-lg mb-2 text-white">Für Ärzte</h3>
                <p class="text-white/90">Finden Sie passende Kliniken oder teilen Sie Ihre Verfügbarkeit mit nur wenigen Klicks.</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 class="font-semibold text-lg mb-2 text-white">Für Kliniken</h3>
                <p class="text-white/90">Veröffentlichen Sie Stellenangebote und finden Sie qualifizierte Ärzte für Ihre Einrichtung.</p>
              </div>
            </div>
          </div>
          
          <!-- Hero Image -->
          <div class="hidden md:block">
            <div class="relative bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 class="font-bold text-xl text-white mb-4">Aktuelle Pinnwand-Einträge</h3>
              
              <!-- Dynamic Bulletin Board Entries -->
              <div v-if="loading" class="text-white text-center py-4">
                Lade Einträge...
              </div>
              <div v-else-if="error" class="text-white text-center py-4">
                <p>Konnte Einträge nicht laden</p>
                <p class="text-sm">{{ error }}</p>
              </div>
              <div v-else class="space-y-3">
                <div v-for="(entry, index) in bulletinEntries" :key="index" class="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                  <div class="flex justify-between items-start">
                    <span class="bg-warning text-white text-xs px-2 py-1 rounded-full">{{ entry.messageType }}</span>
                    <span class="text-white/80 text-sm">{{ formatDate(entry.timestamp) }}</span>
                  </div>
                  <h4 class="font-medium text-white mt-2">{{ entry.title }}</h4>
                  <p class="text-white/90 text-sm mt-1">{{ entry.content.substring(0, 60) }}...</p>
                </div>
                
                <!-- Fallback for no entries -->
                <div v-if="bulletinEntries.length === 0" class="text-white text-center py-4">
                  Keine Einträge gefunden
                </div>
              </div>
              
              <div class="mt-4 text-center">
                <router-link :to="{ name: 'BulletinBoard' }" class="text-white hover:text-secondary-300 inline-flex items-center">
                  Alle Einträge ansehen
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-primary-800 mb-6">Warum MedMatch?</h2>
          <p class="text-xl text-neutral-600 max-w-3xl mx-auto">
            Unsere Plattform verbindet Ärzte und medizinische Einrichtungen direkt für kurzfristige Einsätze von einer Woche bis zu drei Monaten – ohne teure Vermittlungsgebühren.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div class="feature-card">
            <div class="feature-icon bg-primary-100 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary-800 mb-3">Übertarifliche Vergütung</h3>
            <p class="text-neutral-600">
              Ärzte erhalten für kurzfristige Einsätze eine attraktive übertarifliche Vergütung. Kliniken sparen trotzdem im Vergleich zu klassischen Personaldienstleistern.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon bg-secondary-100 text-secondary-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary-800 mb-3">Schnelle Vertretungslösungen</h3>
            <p class="text-neutral-600">
              Kurzfristige Engpässe im Klinikbetrieb überbrücken oder als Arzt flexible Kurzeinsätze finden – meist innerhalb weniger Tage vermittelt.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon bg-accent-100 text-accent-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary-800 mb-3">Maximale Flexibilität</h3>
            <p class="text-neutral-600">
              Nur kurzfristige Einsätze zwischen 1 Woche und 3 Monaten. Keine langen Vertragsbindungen, hohe Planbarkeit für beide Seiten.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-neutral-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-primary-800 mb-6">So funktioniert's</h2>
          <p class="text-xl text-neutral-600 max-w-3xl mx-auto">
            Einfacher Prozess für Ärzte und Kliniken, um schnell kurzfristige Einsätze zu vereinbaren.
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
              <h3 class="text-2xl font-bold text-primary-800">Für Ärzte</h3>
            </div>
            <ol class="relative border-l-2 border-primary-200 pl-8 space-y-8">
              <li class="process-step">
                <div class="process-number">1</div>
                <h4 class="text-lg font-bold text-primary-700 mb-2">Verfügbarkeit angeben</h4>
                <p class="text-neutral-600">Teilen Sie mit, für welche Zeiträume (1 Woche bis 3 Monate) und Regionen Sie verfügbar sind.</p>
              </li>
              <li class="process-step">
                <div class="process-number">2</div>
                <h4 class="text-lg font-bold text-primary-700 mb-2">Passende Kurzeinsätze finden</h4>
                <p class="text-neutral-600">Durchsuchen Sie attraktiv vergütete Vertretungsstellen und kurzfristige Einsätze in Kliniken.</p>
              </li>
              <li class="process-step">
                <div class="process-number">3</div>
                <h4 class="text-lg font-bold text-primary-700 mb-2">Schnelle Vereinbarung</h4>
                <p class="text-neutral-600">Verhandeln Sie direkt mit den Kliniken über Honorar, Unterkunft und Konditionen für Ihren Kurzeinsatz.</p>
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
              <h3 class="text-2xl font-bold text-primary-800">Für Kliniken</h3>
            </div>
            <ol class="relative border-l-2 border-secondary-200 pl-8 space-y-8">
              <li class="process-step">
                <div class="process-number secondary">1</div>
                <h4 class="text-lg font-bold text-primary-700 mb-2">Bedarf veröffentlichen</h4>
                <p class="text-neutral-600">Beschreiben Sie Ihren kurzfristigen Personalbedarf, Zeitraum (1 Woche bis 3 Monate) und angebotene Vergütung.</p>
              </li>
              <li class="process-step">
                <div class="process-number secondary">2</div>
                <h4 class="text-lg font-bold text-primary-700 mb-2">Sofort verfügbare Ärzte finden</h4>
                <p class="text-neutral-600">Durchsuchen Sie Profile von Ärzten, die aktuell für Kurzeinsätze verfügbar sind und Ihren Anforderungen entsprechen.</p>
              </li>
              <li class="process-step">
                <div class="process-number secondary">3</div>
                <h4 class="text-lg font-bold text-primary-700 mb-2">Direkte Vereinbarung</h4>
                <p class="text-neutral-600">Handeln Sie Konditionen direkt mit dem Arzt aus – keine versteckten Gebühren, nur die vereinbarte Vergütung.</p>
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
          <h2 class="text-3xl md:text-4xl font-bold mb-6 text-white">Das sagen unsere Nutzer</h2>
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
              "Über MedMatch habe ich innerhalb von drei Tagen eine zweimonatige Vertretung als Notarzt gefunden. Übertarifliche Vergütung und die direkte Kommunikation haben mich sofort überzeugt."
            </p>
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold mr-4">
                TM
              </div>
              <div>
                <h4 class="font-bold text-white">Dr. Thomas Müller</h4>
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
              "Als kleine Fachklinik müssen wir regelmäßig Engpässe überbrücken. MedMatch ermöglicht uns, qualifizierte Ärzte für Kurzeinsätze zu finden – trotz höherer Honorare sparen wir im Vergleich zu Personalvermittlern."
            </p>
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full bg-secondary-700 flex items-center justify-center text-white font-bold mr-4">
                MS
              </div>
              <div>
                <h4 class="font-bold text-white">Maria Schmidt</h4>
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
              "Zwischen zwei Festanstellungen konnte ich durch dreimonatige Kurzeinsätze nicht nur meine Finanzen aufbessern, sondern auch wertvolle Kontakte knüpfen. Dank der übertariflichen Vergütung konnte ich meinen geplanten Urlaub verlängern."
            </p>
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full bg-accent-700 flex items-center justify-center text-white font-bold mr-4">
                SW
              </div>
              <div>
                <h4 class="font-bold text-white">Dr. Sarah Weber</h4>
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
              Bereit für übertarifliche Kurzeinsätze?
            </h2>
            <p class="text-xl text-white/90 mb-8">
              Ärzte: Erhöhen Sie Ihr Einkommen durch flexible Kurzeinsätze (1 Woche bis 3 Monate) mit attraktivem Honorarzuschlag. Kliniken: Überbrücken Sie Personalengpässe schnell und unkompliziert mit qualifizierten Fachärzten.
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
          <h2 class="text-3xl md:text-4xl font-bold text-primary-800 mb-6">Aktuelle Kurzeinsätze & Vertretungen</h2>
          <p class="text-xl text-neutral-600 max-w-3xl mx-auto">
            Die neuesten Angebote für Vertretungen (1 Woche bis 3 Monate) mit übertariflicher Vergütung und kurzfristig verfügbare Ärzte auf unserer Plattform.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div class="bg-white rounded-xl shadow-card overflow-hidden border border-neutral-200 hover:shadow-strong transition-shadow">
            <div class="bg-primary-100 text-primary-700 py-2 px-4 text-sm font-semibold">
              Stellenangebot
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-primary-800 mb-3">Facharzt Anästhesie – 8 Wochen (übertariflich)</h3>
              <p class="text-neutral-600 mb-4 line-clamp-3">
                Universitätsklinikum Frankfurt sucht für Juli-August 2025 einen Facharzt für Anästhesie. Übertarifliche Vergütung, flexible Arbeitszeiten, Unterkunft kann gestellt werden.
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
              <h3 class="text-xl font-bold text-primary-800 mb-3">Chirurg für Kurzeinsätze verfügbar</h3>
              <p class="text-neutral-600 mb-4 line-clamp-3">
                Facharzt für Allgemeinchirurgie mit 8 Jahren Erfahrung bietet Vertretungen (1-12 Wochen) im Raum München/Bayern. Sofort verfügbar für Engpassüberbrückung, auch kurzfristig.
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
              <h3 class="text-xl font-bold text-primary-800 mb-3">Kurzzeitvertretung Gynäkologie (6 Wochen)</h3>
              <p class="text-neutral-600 mb-4 line-clamp-3">
                Praxisklinik in Berlin sucht für den Zeitraum 15.08.-30.09. eine Vertretung für Gynäkologie. Übertarifliche Vergütung, flexible Arbeitszeiten möglich.
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
import { onMounted, ref } from 'vue';
import axios from 'axios';

// State for bulletin board entries
const bulletinEntries = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch bulletin board entries from the API
const fetchBulletinEntries = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Fix URL construction for production vs development
    let apiUrl = '';
    
    // Use the full domain URL in production
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // Log the environment and base URL for debugging
    console.log(`Environment: ${import.meta.env.VITE_NODE_ENV}`);
    console.log(`Base URL from env: ${baseUrl}`);
    
    // Properly construct API URL based on if it already contains /api
    if (baseUrl.includes('/api')) {
      apiUrl = `${baseUrl}/bulletin`;
    } else {
      apiUrl = `${baseUrl}/api/bulletin`;
    }
    
    console.log('Fetching from URL:', apiUrl); // For debugging
    
    const response = await axios.get(apiUrl, {
      params: {
        messageType: 'Information',
        limit: 3,
        sort: '-timestamp'
      }
    });
    
    if (response.data && response.data.data) {
      bulletinEntries.value = response.data.data;
    }
  } catch (err) {
    console.error('Error fetching bulletin entries:', err);
    error.value = 'Fehler beim Laden der Daten';
    
    // Fallback to demo data if API fails
    useDemoData();
  } finally {
    loading.value = false;
  }
};

// Use demo data as fallback
const useDemoData = () => {
  bulletinEntries.value = [
    {
      id: 4,
      messageType: 'Information',
      title: 'Fachärztliche Vertretungs-Pool Radiologie',
      content: 'Organisiere Vertretungs-Pool für kurzfristige Radiologie-Einsätze (max. 3 Monate).',
      timestamp: new Date('2025-05-08T11:20:00')
    },
    {
      id: 7,
      messageType: 'Information',
      title: 'Fortbildung: Aktuelle Entwicklungen in der Notfallmedizin',
      content: 'Die Ärztekammer Berlin bietet am 15.-16.07.2025 eine zertifizierte Fortbildung zu aktuellen Entwicklungen in der Notfallmedizin an.',
      timestamp: new Date('2025-05-01T10:00:00')
    },
    {
      id: 8,
      messageType: 'Information',
      title: 'Internationaler Kongress für Innere Medizin',
      content: 'Vom 10.-12.09.2025 findet an der MH Hannover der 35. Internationale Kongress für Innere Medizin statt.',
      timestamp: new Date('2025-04-28T14:30:00')
    }
  ];
};

// Format date
const formatDate = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const postDate = new Date(date);
  const diffTime = Math.abs(now - postDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return 'Heute';
  if (diffDays <= 2) return 'Gestern';
  if (diffDays <= 7) return `Vor ${diffDays} Tagen`;
  
  return postDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

onMounted(() => {
  // Fetch bulletin entries
  fetchBulletinEntries();
  
  // Animate the counters
  const counters = document.querySelectorAll('.counter');
  const speed = 200; // The lower the faster
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const increment = target / speed;
    
    const updateCount = () => {
      const count = +counter.innerText;
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target;
      }
    };
    
    updateCount();
  });
});
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

/* Hero Section Animations */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease forwards;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.animation-delay-700 {
  animation-delay: 0.7s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1200 {
  animation-delay: 1.2s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(-5px);
  }
}

.animate-ping-slow {
  animation: pingSlow 4s ease-in-out infinite;
}

@keyframes pingSlow {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

.particle {
  animation: floatParticle linear infinite;
}

@keyframes floatParticle {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}

.connection-line {
  animation: drawLine 3s ease-in-out infinite alternate;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

.window-lit {
  background-color: rgba(255, 253, 130, 0.8);
  box-shadow: 0 0 15px rgba(255, 253, 130, 0.6);
  animation: windowGlow 4s ease-in-out infinite alternate;
}

@keyframes windowGlow {
  0% {
    background-color: rgba(255, 253, 130, 0.8);
    box-shadow: 0 0 5px rgba(255, 253, 130, 0.3);
  }
  100% {
    background-color: rgba(255, 253, 130, 0.8);
    box-shadow: 0 0 15px rgba(255, 253, 130, 0.6);
  }
}

/* Enhanced Button Styles */
.btn-hero-primary {
  @apply bg-primary-600 text-white rounded-md font-semibold transition-all hover:bg-primary-700 hover:shadow-md;
}

.btn-hero-secondary {
  @apply bg-white text-primary-700 rounded-md font-semibold transition-all hover:bg-gray-100 hover:shadow-md;
}

/* Stat Counter Styles */
.stat-counter {
  @apply flex flex-col items-center;
}

/* Animated Hero Image Container */
.animated-hero-image {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.hero-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f2b5b, #1e5799);
}

.hero-content {
  position: relative;
  z-index: 10;
}

.shadow-strong {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.window {
  transition: all 0.5s ease;
}

.network-highlight {
  @apply flex flex-col items-center text-center;
}

.network-icon {
  @apply flex items-center justify-center;
}

.network-line {
  animation: dash 15s linear infinite;
  stroke-dasharray: 5;
}

@keyframes dash {
  to {
    stroke-dashoffset: 100;
  }
}

@media (max-width: 768px) {
  .animated-hero-image {
    min-height: 300px;
  }
}
</style> 