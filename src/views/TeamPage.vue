<template>
  <div>
    <section class="bg-primary text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Unser Team</h1>
        <p class="text-xl max-w-3xl">
          Lernen Sie die Köpfe hinter MedMatch kennen - Experten aus dem Gesundheitswesen und der Technologiebranche.
        </p>
      </div>
    </section>

    <section class="py-16 bg-light">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-6">Führungsteam</h2>
            <p class="text-gray-600 max-w-3xl mx-auto">
              Unser Führungsteam bringt umfangreiche Erfahrung aus dem Gesundheitswesen und der Technologiebranche mit, um die beste Vermittlungsplattform für Ärzte und Kliniken zu entwickeln.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <!-- Team Member 1 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="h-64 bg-gray-200 flex items-center justify-center">
                <svg class="w-32 h-32 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-1">Dr. Max Mustermann</h3>
                <p class="text-primary font-medium mb-4">Gründer & Geschäftsführer</p>
                <p class="text-gray-600 mb-4">
                  Facharzt für Anästhesiologie mit mehr als 15 Jahren Erfahrung in verschiedenen Kliniken. Max hat die Probleme der traditionellen Arztvermittlung selbst erlebt und MedMatch gegründet, um eine bessere Alternative zu schaffen.
                </p>
                <div class="flex space-x-3">
                  <a href="#" class="text-gray-400 hover:text-primary">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-primary">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.383 4.482 13.995 13.995 0 01-10.162-5.159 4.92 4.92 0 001.522 6.574 4.869 4.869 0 01-2.228-.616v.061a4.914 4.914 0 003.941 4.822 4.9 4.9 0 01-2.2.082 4.957 4.957 0 004.616 3.437 9.89 9.89 0 01-6.114 2.107c-.398 0-.79-.022-1.175-.068a13.909 13.909 0 007.548 2.214c9.057 0 14.01-7.503 14.01-14.01 0-.213-.003-.425-.012-.636A10.115 10.115 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Team Member 2 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="h-64 bg-gray-200 flex items-center justify-center">
                <svg class="w-32 h-32 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-1">Julia Schmidt</h3>
                <p class="text-primary font-medium mb-4">CTO & Mitgründerin</p>
                <p class="text-gray-600 mb-4">
                  Mit über 10 Jahren Erfahrung in der Entwicklung von Technologielösungen für das Gesundheitswesen bringt Julia das technische Know-how mit, um MedMatch zu einer benutzerfreundlichen und effizienten Plattform zu machen.
                </p>
                <div class="flex space-x-3">
                  <a href="#" class="text-gray-400 hover:text-primary">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-primary">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.383 4.482 13.995 13.995 0 01-10.162-5.159 4.92 4.92 0 001.522 6.574 4.869 4.869 0 01-2.228-.616v.061a4.914 4.914 0 003.941 4.822 4.9 4.9 0 01-2.2.082 4.957 4.957 0 004.616 3.437 9.89 9.89 0 01-6.114 2.107c-.398 0-.79-.022-1.175-.068a13.909 13.909 0 007.548 2.214c9.057 0 14.01-7.503 14.01-14.01 0-.213-.003-.425-.012-.636A10.115 10.115 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Team Member 3 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="h-64 bg-gray-200 flex items-center justify-center">
                <svg class="w-32 h-32 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-1">Dr. Laura Weber</h3>
                <p class="text-primary font-medium mb-4">Leiterin Kundenerfolg</p>
                <p class="text-gray-600 mb-4">
                  Als ehemalige Personalverantwortliche in einem großen Universitätsklinikum kennt Laura die Herausforderungen bei der Personalgewinnung im medizinischen Bereich. Sie sorgt dafür, dass sowohl Ärzte als auch Kliniken bei MedMatch optimal betreut werden.
                </p>
                <div class="flex space-x-3">
                  <a href="#" class="text-gray-400 hover:text-primary">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-primary">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.383 4.482 13.995 13.995 0 01-10.162-5.159 4.92 4.92 0 001.522 6.574 4.869 4.869 0 01-2.228-.616v.061a4.914 4.914 0 003.941 4.822 4.9 4.9 0 01-2.2.082 4.957 4.957 0 004.616 3.437 9.89 9.89 0 01-6.114 2.107c-.398 0-.79-.022-1.175-.068a13.909 13.909 0 007.548 2.214c9.057 0 14.01-7.503 14.01-14.01 0-.213-.003-.425-.012-.636A10.115 10.115 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-20 text-center">
            <h2 class="text-3xl font-bold mb-6">Unser Expertenteam</h2>
            <p class="text-gray-600 max-w-3xl mx-auto mb-10">
              Hinter MedMatch steht ein engagiertes Team von Experten aus verschiedenen Bereichen, die gemeinsam daran arbeiten, die Vermittlung zwischen Ärzten und Kliniken zu revolutionieren.
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <!-- Expert 1 -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold">Thomas Becker</h3>
                <p class="text-primary text-sm">Kundenerfolgsmanager</p>
              </div>
              
              <!-- Expert 2 -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold">Sarah Klein</h3>
                <p class="text-primary text-sm">Front-End Entwicklerin</p>
              </div>
              
              <!-- Expert 3 -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold">Michael Schulz</h3>
                <p class="text-primary text-sm">Back-End Entwickler</p>
              </div>
              
              <!-- Expert 4 -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold">Anna Müller</h3>
                <p class="text-primary text-sm">Marketing Managerin</p>
              </div>
            </div>
          </div>
          
          <div class="mt-16 text-center">
            <h2 class="text-3xl font-bold mb-6">Karriere bei MedMatch</h2>
            <p class="text-gray-600 max-w-3xl mx-auto mb-8">
              Wir sind immer auf der Suche nach talentierten Menschen, die unsere Vision einer besseren Vermittlung zwischen Ärzten und Kliniken teilen.
            </p>
            <a href="#" class="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-dark transition-colors duration-300">
              Offene Stellen ansehen
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template> 