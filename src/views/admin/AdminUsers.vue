<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Benutzerverwaltung</h1>
      
      <div class="flex">
        <button 
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Neuer Benutzer
        </button>
      </div>
    </div>

    <!-- Filter-Optionen -->
    <div class="p-4 bg-white rounded-lg shadow">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button 
            @click="filterByRole('all')" 
            :class="[
              'px-3 py-1 rounded-md text-sm mr-2', 
              currentFilter === 'all' 
                ? 'bg-indigo-100 text-indigo-700 font-medium' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Alle
          </button>
          <button 
            @click="filterByRole('doctor')" 
            :class="[
              'px-3 py-1 rounded-md text-sm mr-2', 
              currentFilter === 'doctor' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Ärzte
          </button>
          <button 
            @click="filterByRole('clinic')" 
            :class="[
              'px-3 py-1 rounded-md text-sm mr-2', 
              currentFilter === 'clinic' 
                ? 'bg-green-100 text-green-700 font-medium' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Kliniken
          </button>
          <button 
            @click="filterByRole('admin')" 
            :class="[
              'px-3 py-1 rounded-md text-sm', 
              currentFilter === 'admin' 
                ? 'bg-violet-100 text-violet-700 font-medium' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Admins
          </button>
        </div>
        
        <div class="flex items-center space-x-2">
          <select 
            v-model="statusFilter" 
            class="p-2 text-sm border rounded-md bg-white"
          >
            <option value="all">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
            <option value="pending">Ausstehend</option>
          </select>
          
          <div class="relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Benutzer suchen..." 
              class="pl-8 pr-2 py-2 border rounded-md text-sm w-56"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Loading-Indikator -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
      
      <!-- Fehlermeldung -->
      <div v-else-if="error" class="py-8 text-center">
        <div class="mb-3 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-700">{{ error }}</p>
        <button 
          @click="fetchUsers" 
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
      
      <!-- Keine Benutzer -->
      <div v-else-if="users.length === 0" class="py-8 text-center">
        <div class="mb-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-700">Keine Benutzer gefunden</p>
      </div>
      
      <!-- Benutzertabelle -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benutzer</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rolle</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registriert am</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <span v-if="!user.avatar">{{ getUserInitials(user.name) }}</span>
                    <img v-else :src="user.avatar" alt="" class="h-10 w-10 rounded-full" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                    <div class="text-xs text-gray-500">{{ user.phone }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 max-w-[120px] truncate">{{ user._id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-blue-100 text-blue-800': user.role === 'doctor',
                    'bg-green-100 text-green-800': user.role === 'clinic',
                    'bg-violet-100 text-violet-800': user.role === 'admin'
                  }"
                >
                  {{ getRoleLabel(user.role) }}
                </span>
                <div v-if="user.specialty" class="text-xs text-gray-500 mt-1">{{ user.specialty }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-green-100 text-green-800': user.status === 'active',
                    'bg-gray-100 text-gray-800': user.status === 'inactive',
                    'bg-yellow-100 text-yellow-800': user.status === 'pending'
                  }"
                >
                  {{ getStatusLabel(user.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(user.registrationDate) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button @click="viewUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="toggleUserStatus(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                  <svg v-if="user.status === 'active'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button @click="deleteUser(user)" class="text-red-600 hover:text-red-900">
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
      <div v-if="users.length > 0" class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage === 1" 
            :class="[
              'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md', 
              currentPage === 1 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            ]"
          >
            Zurück
          </button>
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage === totalPages" 
            :class="[
              'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md', 
              currentPage === totalPages 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            ]"
          >
            Weiter
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Zeige <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> bis 
              <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> von 
              <span class="font-medium">{{ totalItems }}</span> Einträgen
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="goToPage(currentPage - 1)" 
                :disabled="currentPage === 1" 
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium', 
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">Zurück</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <template v-for="page in totalPages" :key="page">
                <button 
                  v-if="page === currentPage || 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)"
                  @click="goToPage(page)" 
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium', 
                    page === currentPage
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <span 
                  v-else-if="(page === currentPage - 2 && currentPage > 3) || 
                    (page === currentPage + 2 && currentPage < totalPages - 2)"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              </template>
              
              <button 
                @click="goToPage(currentPage + 1)" 
                :disabled="currentPage === totalPages" 
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium', 
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">Weiter</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Bearbeitungsdialog -->
  <div v-if="editingUser" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">{{ editingUser.name }} bearbeiten</h2>
          <button @click="cancelEdit" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveUser" class="space-y-6">
          <!-- Ladeindikator und Fehlermeldung -->
          <div v-if="formLoading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Speichere Änderungen...</p>
          </div>
          
          <div v-if="formError" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ formError }}</p>
              </div>
            </div>
          </div>
          
          <!-- Erfolgsmeldung -->
          <div v-if="formSuccess" class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700">{{ formSuccess }}</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="editUserData.name" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
            
            <!-- E-Mail -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input 
                type="email" 
                id="email" 
                v-model="editUserData.email" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
            
            <!-- Telefon -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="editUserData.phone" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <!-- Rolle -->
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
              <select 
                id="role" 
                v-model="editUserData.role" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              >
                <option value="doctor">Arzt</option>
                <option value="clinic">Klinik</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                id="status" 
                v-model="editUserData.status" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              >
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
                <option value="pending">Ausstehend</option>
              </select>
            </div>
            
            <!-- Fachrichtung/Typ (bedingt) -->
            <div v-if="editUserData.role === 'doctor'">
              <label for="specialty" class="block text-sm font-medium text-gray-700 mb-1">Fachrichtung</label>
              <input 
                type="text" 
                id="specialty" 
                v-model="editUserData.specialty" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div v-if="editUserData.role === 'clinic'">
              <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Kliniktyp</label>
              <input 
                type="text" 
                id="type" 
                v-model="editUserData.type" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button 
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
              :disabled="formLoading"
            >
              Abbrechen
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              :disabled="formLoading"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Benutzerdetails-Dialog -->
  <div v-if="viewingUser" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Benutzerdetails</h2>
          <button @click="closeUserDetails" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mb-6 flex items-center">
          <div class="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xl mr-4">
            <span v-if="!viewingUser.avatar">{{ getUserInitials(viewingUser.name) }}</span>
            <img v-else :src="viewingUser.avatar" alt="" class="h-16 w-16 rounded-full" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ viewingUser.name }}</h3>
            <p class="text-sm text-gray-600">
              <span 
                class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full mr-2"
                :class="{
                  'bg-blue-100 text-blue-800': viewingUser.role === 'doctor',
                  'bg-green-100 text-green-800': viewingUser.role === 'clinic',
                  'bg-violet-100 text-violet-800': viewingUser.role === 'admin'
                }"
              >
                {{ getRoleLabel(viewingUser.role) }}
              </span>
              <span 
                class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': viewingUser.status === 'active',
                  'bg-gray-100 text-gray-800': viewingUser.status === 'inactive',
                  'bg-yellow-100 text-yellow-800': viewingUser.status === 'pending'
                }"
              >
                {{ getStatusLabel(viewingUser.status) }}
              </span>
            </p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium text-gray-500 mb-1">ID</h4>
            <p class="text-sm text-gray-700 break-all">{{ viewingUser._id }}</p>
          </div>
          
          <div class="p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Benutzername</h4>
            <p class="text-sm text-gray-700">{{ viewingUser.username || 'Nicht angegeben' }}</p>
          </div>
          
          <div class="p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium text-gray-500 mb-1">E-Mail</h4>
            <p class="text-sm text-gray-700">{{ viewingUser.email }}</p>
          </div>
          
          <div class="p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Telefon</h4>
            <p class="text-sm text-gray-700">{{ viewingUser.phone || 'Nicht angegeben' }}</p>
          </div>
          
          <div v-if="viewingUser.role === 'doctor'" class="p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Fachrichtung</h4>
            <p class="text-sm text-gray-700">{{ viewingUser.specialty || 'Nicht angegeben' }}</p>
          </div>
          
          <div v-if="viewingUser.role === 'clinic'" class="p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Kliniktyp</h4>
            <p class="text-sm text-gray-700">{{ viewingUser.type || 'Nicht angegeben' }}</p>
          </div>
          
          <div class="p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Registriert am</h4>
            <p class="text-sm text-gray-700">{{ formatDate(viewingUser.registrationDate) }}</p>
          </div>
          
          <div class="p-3 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Zuletzt aktualisiert</h4>
            <p class="text-sm text-gray-700">{{ viewingUser.updatedAt ? formatDate(viewingUser.updatedAt) : 'Nicht verfügbar' }}</p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button 
            type="button"
            @click="closeUserDetails"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
          >
            Schließen
          </button>
          <button 
            type="button"
            @click="editUserFromDetails"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
          >
            Bearbeiten
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import userService from '@/services/user.service';

// Zustandsvariablen für die Benutzer
const users = ref([]);
const loading = ref(false);
const error = ref(null);

// Paginierung
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);

// Filter und Suche
const currentFilter = ref('all');
const statusFilter = ref('all');
const searchQuery = ref('');

// Zustandsvariablen für das Bearbeitungsformular
const editingUser = ref(null);
const editUserData = ref({});
const formLoading = ref(false);
const formError = ref(null);
const formSuccess = ref(null);

// Zustandsvariable für die Detailansicht
const viewingUser = ref(null);

// Benutzer laden
const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Filter und Paginierung vorbereiten
    const filters = {};
    if (currentFilter.value !== 'all') {
      filters.role = currentFilter.value;
    }
    if (statusFilter.value !== 'all') {
      filters.status = statusFilter.value;
    }
    if (searchQuery.value.trim()) {
      filters.search = searchQuery.value.trim();
    }
    
    const pagination = {
      page: currentPage.value,
      limit: pageSize.value
    };
    
    const sort = {
      field: 'registrationDate',
      direction: 'desc'
    };
    
    console.log('Fetching users with filters:', filters);
    const response = await userService.getAllUsers(filters, pagination, sort);
    console.log('Users response:', response);
    
    // API-Antwort verarbeiten
    if (response.data && response.data.data) {
      users.value = response.data.data;
      totalItems.value = response.data.results || 0;
      totalPages.value = response.data.totalPages || 1;
      
      // Stellen Sie sicher, dass currentPage nicht größer als totalPages ist
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
      }
    }
  } catch (err) {
    console.error('Error fetching users:', err);
    error.value = 'Fehler beim Laden der Benutzer. Bitte versuchen Sie es später erneut.';
    users.value = [];
  } finally {
    loading.value = false;
  }
};

// Berechnung der gefilterten Benutzer (nur für lokale Filterung, falls API nicht verwendet wird)
const filteredUsers = computed(() => {
  // Bei API-basierter Filterung einfach die users-Array zurückgeben
  return users.value;
});

// Zur Seite wechseln
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Nach Rolle filtern
const filterByRole = (role) => {
  currentFilter.value = role;
  currentPage.value = 1;
  fetchUsers();
};

// Filter bei Änderungen aktualisieren
watch(statusFilter, () => {
  currentPage.value = 1;
  fetchUsers();
});

watch(searchQuery, () => {
  // Warten Sie 300ms nach Eingabe, bevor die Suche ausgeführt wird (Debounce)
  const timeoutId = setTimeout(() => {
    currentPage.value = 1;
    fetchUsers();
  }, 300);
  
  return () => clearTimeout(timeoutId);
});

// Datum formatieren
const formatDate = (date) => {
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
    case 'inactive':
      return 'Inaktiv';
    case 'pending':
      return 'Ausstehend';
    default:
      return status;
  }
};

// Rollen-Label abrufen
const getRoleLabel = (role) => {
  switch (role) {
    case 'doctor':
      return 'Arzt';
    case 'clinic':
      return 'Klinik';
    case 'admin':
      return 'Admin';
    default:
      return role;
  }
};

// Initialen eines Benutzers abrufen
const getUserInitials = (name) => {
  if (!name) return 'NN';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Benutzer ansehen
const viewUser = (user) => {
  console.log('Benutzer ansehen:', user);
  viewingUser.value = { ...user };
};

// Detailansicht schließen
const closeUserDetails = () => {
  viewingUser.value = null;
};

// Von Detailansicht zur Bearbeitung wechseln
const editUserFromDetails = () => {
  const user = viewingUser.value;
  closeUserDetails();
  editUser(user);
};

// Benutzer bearbeiten
const editUser = (user) => {
  console.log('Benutzer bearbeiten:', user);
  
  // Tiefe Kopie des Benutzers erstellen, um die Originalquelle nicht zu verändern
  editingUser.value = { ...user };
  
  // Formulardaten mit den Benutzerdaten vorausfüllen
  editUserData.value = {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || 'doctor',
    status: user.status || 'active',
    specialty: user.specialty || '',
    type: user.type || ''
  };
  
  // Formularstatus zurücksetzen
  formError.value = null;
  formSuccess.value = null;
};

// Bearbeitung abbrechen
const cancelEdit = () => {
  editingUser.value = null;
  editUserData.value = {};
  formError.value = null;
  formSuccess.value = null;
};

// Benutzer speichern
const saveUser = async () => {
  formLoading.value = true;
  formError.value = null;
  formSuccess.value = null;
  
  try {
    // Daten für die API vorbereiten
    const userData = { ...editUserData.value };
    
    console.log('Speichere Benutzer:', userData);
    const response = await userService.updateUser(editingUser.value._id, userData);
    console.log('Benutzer gespeichert:', response);
    
    // Daten im lokalen Array aktualisieren
    const index = users.value.findIndex(u => u._id === editingUser.value._id);
    if (index !== -1) {
      // Aktualisierte Daten mit vorhandenem Objekt zusammenführen
      users.value[index] = { ...users.value[index], ...userData };
    }
    
    formSuccess.value = 'Benutzer erfolgreich aktualisiert';
    
    // Nach 1,5 Sekunden automatisch schließen, damit die Erfolgsmeldung gesehen werden kann
    setTimeout(() => {
      cancelEdit();
    }, 1500);
    
  } catch (err) {
    console.error('Fehler beim Speichern des Benutzers:', err);
    formError.value = 'Der Benutzer konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.';
  } finally {
    formLoading.value = false;
  }
};

// Benutzer Status umschalten
const toggleUserStatus = async (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active';
  const action = user.status === 'active' ? 'deaktivieren' : 'aktivieren';

  if (confirm(`Möchten Sie den Benutzer "${user.name}" wirklich ${action}?`)) {
    try {
      console.log(`Benutzer ${action}:`, user);
      await userService.updateUserStatus(user._id, newStatus);
      // Status im lokalen Array aktualisieren
      user.status = newStatus;
    } catch (err) {
      console.error(`Fehler beim ${action} des Benutzers:`, err);
      alert(`Der Benutzer konnte nicht ${action} werden. Bitte versuchen Sie es später erneut.`);
    }
  }
};

// Benutzer löschen
const deleteUser = async (user) => {
  if (confirm(`Möchten Sie den Benutzer "${user.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
    try {
      console.log('Benutzer löschen:', user);
      await userService.deleteUser(user._id);
      // Benutzer aus der lokalen Liste entfernen
      users.value = users.value.filter(item => item._id !== user._id);
    } catch (err) {
      console.error('Fehler beim Löschen des Benutzers:', err);
      alert('Der Benutzer konnte nicht gelöscht werden. Bitte versuchen Sie es später erneut.');
    }
  }
};

// Initialisierung
onMounted(() => {
  console.log('AdminUsers initialisiert');
  fetchUsers();
});
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style> 