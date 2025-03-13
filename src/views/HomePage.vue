<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary text-white w-full">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              Die direkte Verbindung zwischen Ärzten und Kliniken
            </h1>
            <p class="text-xl mb-8">
              MedMatch verbindet Ärzte und Kliniken ohne teure Vermittlungsgebühren. 
              Einfach, effizient und transparent.
            </p>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <router-link to="/for-doctors" class="bg-white text-primary font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-accent hover:text-dark transition-colors duration-300 text-center">
                Für Ärzte
              </router-link>
              <router-link to="/for-hospitals" class="bg-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-accent hover:text-dark transition-colors duration-300 text-center">
                Für Kliniken
              </router-link>
            </div>
          </div>
          <div class="md:w-1/2 flex justify-center">
            <img src="@/assets/hero-image.svg" alt="MedMatch - Direkte Vermittlung" class="rounded-lg shadow-xl max-w-full h-auto" />
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="py-16 bg-light">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-2">So funktioniert MedMatch</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Einfach, transparent und ohne versteckte Kosten - so gestalten wir die Vermittlung zwischen Ärzten und Kliniken.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span class="font-bold text-xl">1</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Profil erstellen</h3>
            <p class="text-gray-600">
              Ärzte und Kliniken erstellen ein Profil und geben ihre Bedürfnisse und Anforderungen an.
            </p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span class="font-bold text-xl">2</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Direkter Kontakt</h3>
            <p class="text-gray-600">
              Unsere Plattform bringt passende Ärzte und Kliniken direkt miteinander in Kontakt - ohne Zwischenhändler.
            </p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span class="font-bold text-xl">3</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Erfolgsbasierte Gebühr</h3>
            <p class="text-gray-600">
              Kliniken zahlen nur bei erfolgreicher Vermittlung eine faire Gebühr - deutlich günstiger als traditionelle Vermittlungsagenturen.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-2">Vorteile von MedMatch</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Warum immer mehr Ärzte und Kliniken MedMatch nutzen
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex items-start">
            <div class="bg-primary rounded-full p-2 mr-4 text-white flex-shrink-0" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="max-width: 20px; max-height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Kosteneinsparung</h3>
              <p class="text-gray-600">
                Bis zu 70% weniger Vermittlungsgebühren im Vergleich zu traditionellen Agenturen.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="bg-primary rounded-full p-2 mr-4 text-white flex-shrink-0" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="max-width: 20px; max-height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Transparenz</h3>
              <p class="text-gray-600">
                Vollständige Transparenz bei Konditionen und Vermittlungsprozessen.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="bg-primary rounded-full p-2 mr-4 text-white flex-shrink-0" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="max-width: 20px; max-height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Qualität</h3>
              <p class="text-gray-600">
                Hochwertige Matches durch präzise Anforderungsprofile und moderne Matching-Algorithmen.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="bg-primary rounded-full p-2 mr-4 text-white flex-shrink-0" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="max-width: 20px; max-height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Zeitersparnis</h3>
              <p class="text-gray-600">
                Schnelle und unkomplizierte Vermittlung ohne langwierige Prozesse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Bereit für eine bessere Vermittlung?</h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          Erstellen Sie jetzt Ihr Profil und erleben Sie den Unterschied zur klassischen Honorararzt-Vermittlung.
        </p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <router-link to="/for-doctors" class="bg-white text-primary font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-accent hover:text-dark transition-colors duration-300">
            Für Ärzte
          </router-link>
          <router-link to="/for-hospitals" class="bg-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-accent hover:text-dark transition-colors duration-300">
            Für Kliniken
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template> 