<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Stellenbörse - Verwaltung</h1>
      
      <div class="flex">
        <button 
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Neuer Eintrag
        </button>
      </div>
    </div>
    
    <!-- Filter-Optionen -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div class="flex flex-wrap gap-4 items-center">
        <h3 class="text-lg font-medium text-gray-700 mr-4">Filter:</h3>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="filterByType('all')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'all' ? 'bg-primary-100 text-primary-700 font-medium border border-primary-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Alle
          </button>
          <button 
            @click="filterByType('Angebot')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'Angebot' ? 'bg-success-100 text-success-700 font-medium border border-success-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Angebote
          </button>
          <button 
            @click="filterByType('Gesuch')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'Gesuch' ? 'bg-primary-100 text-primary-700 font-medium border border-primary-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Gesuche
          </button>
        </div>
        
        <div class="flex items-center ml-auto">
          <label for="statusFilter" class="mr-2 text-gray-700 text-sm font-medium">Status:</label>
          <select 
            id="statusFilter" 
            v-model="statusFilter" 
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm appearance-none text-sm"
          >
            <option value="all">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="pending">Ausstehend</option>
            <option value="archived">Archiviert</option>
          </select>
        </div>
        
        <div class="flex items-center">
          <label for="sortOrder" class="mr-2 text-gray-700 text-sm font-medium">Sortieren:</label>
          <select 
            id="sortOrder" 
            v-model="sortOrder" 
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm appearance-none text-sm"
          >
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Tabelle -->
    <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
        <p>Lade Stellenangebote und -gesuche...</p>
      </div>
      
      <div v-else-if="error" class="p-8 text-center text-red-600">
        <p>{{ error }}</p>
        <button 
          @click="fetchJobs" 
          class="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
        >
          Erneut versuchen
        </button>
      </div>
      
      <div v-else-if="filteredJobs.length === 0" class="p-8 text-center text-gray-500">
        <p>Keine Stellenangebote oder -gesuche gefunden.</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Typ
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titel
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fachrichtung
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bundesland/Start
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontakt
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="job in paginatedJobs" :key="job.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-success-100 text-success-800': job.messageType === 'Angebot',
                    'bg-primary-100 text-primary-800': job.messageType === 'Gesuch'
                  }"
                >
                  {{ job.messageType }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 truncate max-w-md">
                  {{ job.title }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ job.specialty || 'Nicht angegeben' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="job.userType === 'Klinik'" class="text-sm text-gray-900">
                  {{ job.federalState || 'Nicht angegeben' }}
                </div>
                <div v-else class="text-sm text-gray-900">
                  {{ formatDate(job.startDate || job.timestamp) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ job.name || 'Anonym' }}</div>
                <div class="text-sm text-gray-500">{{ job.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': job.status === 'active',
                    'bg-yellow-100 text-yellow-800': job.status === 'pending',
                    'bg-gray-100 text-gray-800': job.status === 'archived'
                  }"
                >
                  {{ getStatusLabel(job.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  v-if="job.status === 'pending'"
                  class="text-green-600 hover:text-green-900 mx-1"
                  @click="updateJobStatus(job.id, 'active')"
                  title="Freigeben"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button 
                  v-if="job.status === 'active'"
                  class="text-yellow-600 hover:text-yellow-900 mx-1"
                  @click="updateJobStatus(job.id, 'archived')"
                  title="Archivieren"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>
                <button 
                  v-if="job.status === 'archived'"
                  class="text-blue-600 hover:text-blue-900 mx-1"
                  @click="updateJobStatus(job.id, 'active')"
                  title="Wiederherstellen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button 
                  class="text-primary-600 hover:text-primary-900 mx-1"
                  @click="viewJob(job)"
                  title="Ansehen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  class="text-indigo-600 hover:text-indigo-900 mx-1"
                  @click="editJob(job)"
                  title="Bearbeiten"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  class="text-red-600 hover:text-red-900 mx-1"
                  @click="deleteJob(job.id)"
                  title="Löschen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginierung -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Zeige
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
              bis
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredJobs.length) }}</span>
              von
              <span class="font-medium">{{ filteredJobs.length }}</span>
              Einträgen
            </p>
          </div>
          <div>
            <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
              >
                <span class="sr-only">Zurück</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                :class="page === currentPage ? 'bg-primary-50 text-primary-600 border-primary-500 z-10' : 'text-gray-500 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
              >
                <span class="sr-only">Weiter</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Job-Detail-Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-2xl font-bold text-heading">{{ selectedJob.title }}</h3>
          <button 
            @click="closeDetailModal" 
            class="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p class="text-sm text-gray-500 mb-1">Typ</p>
            <p class="font-medium">{{ selectedJob.messageType }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Status</p>
            <p class="font-medium">{{ getStatusLabel(selectedJob.status) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Benutzertyp</p>
            <p class="font-medium">{{ selectedJob.userType }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Erstellt am</p>
            <p class="font-medium">{{ formatDate(selectedJob.timestamp) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Name</p>
            <p class="font-medium">{{ selectedJob.name || 'Anonym' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">E-Mail</p>
            <p class="font-medium">{{ selectedJob.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Fachrichtung</p>
            <p class="font-medium">{{ selectedJob.specialty || 'Nicht angegeben' }}</p>
          </div>
          <div v-if="selectedJob.userType === 'Klinik'">
            <p class="text-sm text-gray-500 mb-1">Bundesland</p>
            <p class="font-medium">{{ selectedJob.federalState || 'Nicht angegeben' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Verfügbar ab</p>
            <p class="font-medium">{{ formatDate(selectedJob.startDate || selectedJob.timestamp) }}</p>
          </div>
        </div>
        
        <div class="mb-6">
          <p class="text-sm text-gray-500 mb-1">Beschreibung</p>
          <p class="whitespace-pre-line">{{ selectedJob.content }}</p>
        </div>
        
        <div class="flex justify-end space-x-4">
          <button 
            v-if="selectedJob.status === 'pending'"
            @click="updateJobStatus(selectedJob.id, 'active')" 
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Freigeben
          </button>
          <button 
            v-if="selectedJob.status === 'active'"
            @click="updateJobStatus(selectedJob.id, 'archived')" 
            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archivieren
          </button>
          <button 
            v-if="selectedJob.status === 'archived'"
            @click="updateJobStatus(selectedJob.id, 'active')" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Wiederherstellen
          </button>
          <button 
            @click="openEditModal(selectedJob)"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Bearbeiten
          </button>
          <button 
            @click="closeDetailModal"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
    
    <!-- Job-Edit-Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-2xl font-bold text-heading">Stellenangebot/-gesuch bearbeiten</h3>
          <button 
            @click="closeEditModal" 
            class="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveJobChanges" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Titel -->
            <div class="col-span-2">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titel*</label>
              <input 
                type="text" 
                id="title" 
                v-model="editForm.title" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <!-- Name (optional) -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="editForm.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <!-- E-Mail -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-Mail*</label>
              <input 
                type="email" 
                id="email" 
                v-model="editForm.email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <!-- Benutzertyp -->
            <div>
              <label for="userType" class="block text-sm font-medium text-gray-700 mb-1">Benutzertyp*</label>
              <select 
                id="userType" 
                v-model="editForm.userType"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                @change="updateMessageType"
              >
                <option value="Arzt">Arzt</option>
                <option value="Klinik">Klinik</option>
              </select>
            </div>
            
            <!-- Nachrichtentyp -->
            <div>
              <label for="messageType" class="block text-sm font-medium text-gray-700 mb-1">Nachrichtentyp*</label>
              <select 
                id="messageType" 
                v-model="editForm.messageType"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Angebot">Angebot</option>
                <option value="Gesuch">Gesuch</option>
              </select>
            </div>
            
            <!-- Fachrichtung -->
            <div>
              <label for="specialty" class="block text-sm font-medium text-gray-700 mb-1">Fachrichtung</label>
              <select 
                id="specialty" 
                v-model="editForm.specialty"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Bitte wählen</option>
                <option value="Allgemeinmedizin">Allgemeinmedizin</option>
                <option value="Anästhesiologie">Anästhesiologie</option>
                <option value="Augenheilkunde">Augenheilkunde</option>
                <option value="Chirurgie">Chirurgie</option>
                <option value="Dermatologie">Dermatologie</option>
                <option value="Gynäkologie">Gynäkologie</option>
                <option value="HNO">HNO</option>
                <option value="Innere Medizin">Innere Medizin</option>
                <option value="Kardiologie">Kardiologie</option>
                <option value="Neurologie">Neurologie</option>
                <option value="Orthopädie">Orthopädie</option>
                <option value="Pädiatrie">Pädiatrie</option>
                <option value="Psychiatrie">Psychiatrie</option>
                <option value="Radiologie">Radiologie</option>
                <option value="Urologie">Urologie</option>
                <option value="Sonstige">Sonstige</option>
              </select>
            </div>
            
            <!-- Andere Fachrichtung (wenn "Sonstige" ausgewählt) -->
            <div v-if="editForm.specialty === 'Sonstige'">
              <label for="specialtyOther" class="block text-sm font-medium text-gray-700 mb-1">Andere Fachrichtung</label>
              <input 
                type="text" 
                id="specialtyOther" 
                v-model="editForm.specialtyOther"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <!-- Bundesland (nur für Kliniken) -->
            <div v-if="editForm.userType === 'Klinik'">
              <label for="federalState" class="block text-sm font-medium text-gray-700 mb-1">Bundesland</label>
              <select 
                id="federalState" 
                v-model="editForm.federalState"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Bitte wählen</option>
                <option value="Baden-Württemberg">Baden-Württemberg</option>
                <option value="Bayern">Bayern</option>
                <option value="Berlin">Berlin</option>
                <option value="Brandenburg">Brandenburg</option>
                <option value="Bremen">Bremen</option>
                <option value="Hamburg">Hamburg</option>
                <option value="Hessen">Hessen</option>
                <option value="Mecklenburg-Vorpommern">Mecklenburg-Vorpommern</option>
                <option value="Niedersachsen">Niedersachsen</option>
                <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
                <option value="Rheinland-Pfalz">Rheinland-Pfalz</option>
                <option value="Saarland">Saarland</option>
                <option value="Sachsen">Sachsen</option>
                <option value="Sachsen-Anhalt">Sachsen-Anhalt</option>
                <option value="Schleswig-Holstein">Schleswig-Holstein</option>
                <option value="Thüringen">Thüringen</option>
              </select>
            </div>
            
            <!-- Startdatum -->
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Verfügbar ab</label>
              <input 
                type="date" 
                id="startDate" 
                v-model="editForm.startDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status*</label>
              <select 
                id="status" 
                v-model="editForm.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Aktiv</option>
                <option value="pending">Ausstehend</option>
                <option value="archived">Archiviert</option>
              </select>
            </div>
          </div>
          
          <!-- Inhalt -->
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Beschreibung*</label>
            <textarea 
              id="content" 
              v-model="editForm.content"
              required
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Abbrechen
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              :disabled="isSaving"
            >
              {{ isSaving ? 'Speichern...' : 'Änderungen speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import bulletinProxyService from '@/services/bulletinProxyService';

// Zustandsvariablen
const jobs = ref([]);
const isLoading = ref(true);
const error = ref(null);

const currentFilter = ref('all');
const statusFilter = ref('all');
const sortOrder = ref('newest');
const currentPage = ref(1);
const pageSize = ref(10);

const showDetailModal = ref(false);
const selectedJob = ref({});

const showEditModal = ref(false);
const editForm = ref({});
const isSaving = ref(false);

// Stellenangebote und -gesuche vom Server holen
const fetchJobs = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('AdminJobs: Fetching job listings from server...');
    
    // Verwende den vorhandenen bulletin-Service und filtere clientseitig nach Angeboten/Gesuchen
    const response = await bulletinProxyService.getAllBulletins({
      messageType: 'Angebot,Gesuch'
    });
    
    console.log('AdminJobs: Response received:', response);
    
    if (!response || !response.data) {
      console.warn('AdminJobs: No data in response');
      throw new Error('Keine Daten vom Server erhalten');
    }
    
    // Log data stats before filtering
    console.log('AdminJobs: Total bulletins before filtering:', response.data.length);
    
    // Nur Angebote und Gesuche auswählen (keine Informationen)
    const jobListings = response.data
      .filter(item => item.messageType === 'Angebot' || item.messageType === 'Gesuch');
    
    console.log('AdminJobs: Job listings after filtering:', jobListings.length);
    
    // Log first item as sample
    if (jobListings.length > 0) {
      console.log('AdminJobs: Sample job listing:', jobListings[0]);
    }
    
    jobs.value = jobListings.map(item => ({
      ...item,
      id: item._id || item.id, // MongoDB verwendet _id, wir verwenden id für Konsistenz in der UI
      timestamp: new Date(item.timestamp || item.createdAt || Date.now())
    }));
    
    // Log stats about different message types
    const angebotCount = jobs.value.filter(job => job.messageType === 'Angebot').length;
    const gesuchCount = jobs.value.filter(job => job.messageType === 'Gesuch').length;
    
    console.log('AdminJobs: Message type stats - Angebot:', angebotCount, 'Gesuch:', gesuchCount);
    console.log('AdminJobs: Total job listings loaded:', jobs.value.length);
  } catch (err) {
    console.error('AdminJobs: Error fetching jobs:', err);
    console.error('AdminJobs: Error details:', err.response || err.message);
    error.value = 'Fehler beim Laden der Stellenangebote und -gesuche. Bitte versuchen Sie es später erneut.';
    jobs.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Gefilterte und sortierte Einträge
const filteredJobs = computed(() => {
  let result = [...jobs.value];
  
  // Nach Typ filtern
  if (currentFilter.value !== 'all') {
    result = result.filter(item => item.messageType === currentFilter.value);
  }
  
  // Nach Status filtern
  if (statusFilter.value !== 'all') {
    result = result.filter(item => item.status === statusFilter.value);
  }
  
  // Sortieren
  if (sortOrder.value === 'newest') {
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else {
    result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
  
  return result;
});

// Paginierte Einträge für die aktuelle Seite
const paginatedJobs = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredJobs.value.slice(startIndex, endIndex);
});

// Berechnung der Gesamtseitenzahl
const totalPages = computed(() => {
  return Math.ceil(filteredJobs.value.length / pageSize.value) || 1;
});

// Nach Typ filtern
const filterByType = (type) => {
  currentFilter.value = type;
  currentPage.value = 1;
};

// Zur Seite wechseln
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Datum formatieren
const formatDate = (date) => {
  if (!date) return 'Unbekannt';
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Status-Label abrufen
const getStatusLabel = (status) => {
  switch (status) {
    case 'active':
      return 'Aktiv';
    case 'pending':
      return 'Ausstehend';
    case 'archived':
      return 'Archiviert';
    default:
      return status || 'Unbekannt';
  }
};

// Stellenangebot/-gesuch ansehen
const viewJob = (job) => {
  selectedJob.value = job;
  showDetailModal.value = true;
};

// Detail-Modal schließen
const closeDetailModal = () => {
  showDetailModal.value = false;
  // Kleine Verzögerung, um den Übergangseffekt zu ermöglichen
  setTimeout(() => {
    selectedJob.value = {};
  }, 300);
};

// Stellenangebot/-gesuch bearbeiten
const editJob = (job) => {
  openEditModal(job);
};

// Edit-Modal öffnen
const openEditModal = (job) => {
  // Detail-Modal schließen, falls geöffnet
  showDetailModal.value = false;
  
  // Formular mit den Job-Daten initialisieren
  editForm.value = {
    id: job.id,
    title: job.title,
    name: job.name || '',
    email: job.email,
    userType: job.userType,
    messageType: job.messageType,
    content: job.content,
    status: job.status,
    specialty: job.specialty || '',
    specialtyOther: job.specialtyOther || '',
    federalState: job.federalState || '',
    startDate: job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : ''
  };
  
  // Edit-Modal öffnen
  showEditModal.value = true;
};

// Edit-Modal schließen
const closeEditModal = () => {
  showEditModal.value = false;
  // Formular zurücksetzen
  setTimeout(() => {
    editForm.value = {};
  }, 300);
};

// Aktualisiere den Nachrichtentyp basierend auf dem Benutzertyp
const updateMessageType = () => {
  if (editForm.value.userType === 'Arzt') {
    editForm.value.messageType = 'Gesuch';
  } else if (editForm.value.userType === 'Klinik') {
    editForm.value.messageType = 'Angebot';
  }
};

// Änderungen speichern
const saveJobChanges = async () => {
  isSaving.value = true;
  
  try {
    // Stelle sicher, dass wir beim Speichern den richtigen Spezialitätswert verwenden
    const updates = { ...editForm.value };
    
    // Behandle den Fall, wenn Spezialität "Sonstige" ausgewählt ist
    if (updates.specialty === 'Sonstige') {
      updates.specialtyOther = updates.specialtyOther || '';
    } else {
      // Wenn nicht "Sonstige", setze specialtyOther zurück
      updates.specialtyOther = '';
    }
    
    // Konvertiere das Datum in das richtige Format, falls es vorhanden ist
    if (updates.startDate) {
      updates.startDate = new Date(updates.startDate);
    }
    
    // Entferne die ID aus dem Objekt, da diese nicht aktualisiert werden soll
    const id = updates.id;
    delete updates.id;
    
    // Sende die Aktualisierungsanfrage
    const response = await bulletinProxyService.updateBulletin(id, updates);
    
    if (!response || !response.data) {
      throw new Error('Keine Daten vom Server erhalten');
    }
    
    // Aktualisiere den Job in der lokalen Liste
    const updatedJob = response.data;
    const index = jobs.value.findIndex(job => job.id === id);
    
    if (index !== -1) {
      // Stelle sicher, dass wir die ID korrekt beibehalten
      jobs.value[index] = {
        ...updatedJob,
        id: updatedJob._id || updatedJob.id,
        timestamp: new Date(updatedJob.timestamp)
      };
      
      // Wenn das Detail-Modal für diesen Job geöffnet ist, aktualisiere auch diese Ansicht
      if (showDetailModal.value && selectedJob.value.id === id) {
        selectedJob.value = jobs.value[index];
      }
    }
    
    // Schließe das Modal
    closeEditModal();
    
    // Zeige eine Erfolgsmeldung
    alert('Die Änderungen wurden erfolgreich gespeichert.');
  } catch (err) {
    console.error('Error updating job:', err);
    alert(`Fehler beim Speichern der Änderungen: ${err.message}`);
  } finally {
    isSaving.value = false;
  }
};

// Stellenangebot/-gesuch löschen
const deleteJob = async (id) => {
  if (!confirm('Sind Sie sicher, dass Sie dieses Stellenangebot/-gesuch löschen möchten?')) {
    return;
  }
  
  try {
    await bulletinProxyService.deleteBulletin(id);
    // Nach erfolgreichem Löschen den Eintrag aus der lokalen Liste entfernen
    jobs.value = jobs.value.filter(item => item.id !== id);
    // Detail-Modal schließen, falls das gelöschte Element angezeigt wurde
    if (showDetailModal.value && selectedJob.value.id === id) {
      closeDetailModal();
    }
  } catch (err) {
    console.error('Error deleting job:', err);
    alert('Fehler beim Löschen des Eintrags. Bitte versuchen Sie es später erneut.');
  }
};

// Status eines Stellenangebots/-gesuchs aktualisieren
const updateJobStatus = async (id, newStatus) => {
  try {
    await bulletinProxyService.updateBulletin(id, { status: newStatus });
    
    // Nach erfolgreicher Aktualisierung den Eintrag in der lokalen Liste aktualisieren
    const index = jobs.value.findIndex(item => item.id === id);
    if (index !== -1) {
      jobs.value[index].status = newStatus;
      // Wenn das Detail-Modal geöffnet ist, auch dort den Status aktualisieren
      if (showDetailModal.value && selectedJob.value.id === id) {
        selectedJob.value.status = newStatus;
      }
    }
  } catch (err) {
    console.error('Error updating job status:', err);
    alert('Fehler beim Aktualisieren des Status. Bitte versuchen Sie es später erneut.');
  }
};

// Initialisierung
onMounted(() => {
  fetchJobs();
});
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style> 