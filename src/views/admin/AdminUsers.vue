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
    <div class="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div class="flex flex-wrap gap-4 items-center">
        <h3 class="text-lg font-medium text-gray-700 mr-4">Filter:</h3>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="filterByRole('all')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'all' ? 'bg-primary-100 text-primary-700 font-medium border border-primary-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Alle
          </button>
          <button 
            @click="filterByRole('doctor')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'doctor' ? 'bg-success-100 text-success-700 font-medium border border-success-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Ärzte
          </button>
          <button 
            @click="filterByRole('clinic')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'clinic' ? 'bg-primary-100 text-primary-700 font-medium border border-primary-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Kliniken
          </button>
          <button 
            @click="filterByRole('admin')" 
            class="px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm"
            :class="currentFilter === 'admin' ? 'bg-warning-100 text-warning-700 font-medium border border-warning-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'"
          >
            Administratoren
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
            <option value="inactive">Inaktiv</option>
            <option value="pending">Ausstehend</option>
          </select>
        </div>
        
        <div class="flex items-center">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Suche..." 
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm shadow-sm"
          />
        </div>
      </div>
    </div>
    
    <!-- Tabelle -->
    <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Benutzer
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Typ
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontakt
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registriert am
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
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden">
                    <div v-if="user.avatar" class="h-full w-full">
                      <img :src="user.avatar" :alt="user.name" class="h-full w-full object-cover" />
                    </div>
                    <div v-else class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-700 text-lg font-semibold">
                      {{ getUserInitials(user.name) }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-success-100 text-success-800': user.role === 'doctor',
                    'bg-primary-100 text-primary-800': user.role === 'clinic',
                    'bg-warning-100 text-warning-800': user.role === 'admin'
                  }"
                >
                  {{ getRoleLabel(user.role) }}
                </span>
                <div class="text-xs text-gray-500 mt-1">{{ user.specialty || user.type || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
                <div class="text-sm text-gray-500">{{ user.phone || 'Keine Telefonnummer' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.registeredAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': user.status === 'active',
                    'bg-gray-100 text-gray-800': user.status === 'inactive',
                    'bg-yellow-100 text-yellow-800': user.status === 'pending'
                  }"
                >
                  {{ getStatusLabel(user.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="text-primary-600 hover:text-primary-900 mx-1"
                  @click="viewUser(user)"
                  title="Ansehen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  class="text-indigo-600 hover:text-indigo-900 mx-1"
                  @click="editUser(user)"
                  title="Bearbeiten"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  class="text-yellow-600 hover:text-yellow-800 mx-1"
                  @click="toggleUserStatus(user)"
                  :title="user.status === 'active' ? 'Deaktivieren' : 'Aktivieren'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </button>
                <button 
                  v-if="user.role !== 'admin'"
                  class="text-red-600 hover:text-red-900 mx-1"
                  @click="deleteUser(user)"
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
              <span class="font-medium">{{ filteredUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }}</span>
              bis
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredUsers.length) }}</span>
              von
              <span class="font-medium">{{ filteredUsers.length }}</span>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Zustandsvariablen
const users = ref([
  {
    id: '1001',
    name: 'Dr. Julia Weber',
    username: 'jweber',
    email: 'j.weber@arztpraxis.de',
    phone: '+49 176 12345678',
    role: 'doctor',
    specialty: 'Anästhesie',
    status: 'active',
    registeredAt: new Date('2024-12-15T08:30:00'),
    avatar: null
  },
  {
    id: '1002',
    name: 'Klinikum München',
    username: 'kmuenchen',
    email: 'personal@klinikum-muenchen.de',
    phone: '+49 89 87654321',
    role: 'clinic',
    type: 'Krankenhaus',
    status: 'active',
    registeredAt: new Date('2024-12-10T14:45:00'),
    avatar: null
  },
  {
    id: '1003',
    name: 'Sebas Admin',
    username: 'sadmin',
    email: 'admin@medmatch.de',
    phone: '+49 30 98765432',
    role: 'admin',
    status: 'active',
    registeredAt: new Date('2024-11-05T09:00:00'),
    avatar: null
  },
  {
    id: '1004',
    name: 'Dr. Thomas Schmidt',
    username: 'tschmidt',
    email: 't.schmidt@mail.de',
    phone: '+49 151 87654321',
    role: 'doctor',
    specialty: 'Radiologie',
    status: 'active',
    registeredAt: new Date('2024-12-18T11:20:00'),
    avatar: null
  },
  {
    id: '1005',
    name: 'Universitätsklinikum Hamburg',
    username: 'ukhamburg',
    email: 'karriere@uk-hamburg.de',
    phone: '+49 40 12345678',
    role: 'clinic',
    type: 'Universitätsklinikum',
    status: 'active',
    registeredAt: new Date('2024-12-08T13:15:00'),
    avatar: null
  },
  {
    id: '1006',
    name: 'Dr. Anna Müller',
    username: 'amueller',
    email: 'a.mueller@praxis.de',
    phone: '+49 177 23456789',
    role: 'doctor',
    specialty: 'Innere Medizin',
    status: 'pending',
    registeredAt: new Date('2025-01-05T16:40:00'),
    avatar: null
  },
  {
    id: '1007',
    name: 'Rehaklinik Schwarzwald',
    username: 'rkschwarzwald',
    email: 'personal@rehaklinik-schwarzwald.de',
    phone: '+49 7721 9876543',
    role: 'clinic',
    type: 'Rehaklinik',
    status: 'active',
    registeredAt: new Date('2024-12-20T10:00:00'),
    avatar: null
  },
  {
    id: '1008',
    name: 'Dr. Markus Klein',
    username: 'mklein',
    email: 'm.klein@doktor.de',
    phone: '+49 152 34567890',
    role: 'doctor',
    specialty: 'Chirurgie',
    status: 'inactive',
    registeredAt: new Date('2024-11-28T08:55:00'),
    avatar: null
  }
]);

const currentFilter = ref('all');
const statusFilter = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// Gefilterte und sortierte Benutzer
const filteredUsers = computed(() => {
  let result = [...users.value];
  
  // Nach Rolle filtern
  if (currentFilter.value !== 'all') {
    result = result.filter(user => user.role === currentFilter.value);
  }
  
  // Nach Status filtern
  if (statusFilter.value !== 'all') {
    result = result.filter(user => user.status === statusFilter.value);
  }
  
  // Nach Suchbegriff filtern
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      (user.specialty && user.specialty.toLowerCase().includes(query)) ||
      (user.type && user.type.toLowerCase().includes(query))
    );
  }
  
  // Nach Registrierungsdatum sortieren (neueste zuerst)
  result.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
  
  return result;
});

// Berechnung der Gesamtseitenzahl
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / pageSize.value) || 1;
});

// Nach Rolle filtern
const filterByRole = (role) => {
  currentFilter.value = role;
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
  // Implementierung der Detailansicht
};

// Benutzer bearbeiten
const editUser = (user) => {
  console.log('Benutzer bearbeiten:', user);
  // Implementierung des Bearbeitungs-Dialogs
};

// Benutzer Status umschalten
const toggleUserStatus = (user) => {
  if (user.status === 'active') {
    if (confirm(`Möchten Sie den Benutzer "${user.name}" wirklich deaktivieren?`)) {
      console.log('Benutzer deaktivieren:', user);
      user.status = 'inactive';
    }
  } else {
    if (confirm(`Möchten Sie den Benutzer "${user.name}" aktivieren?`)) {
      console.log('Benutzer aktivieren:', user);
      user.status = 'active';
    }
  }
};

// Benutzer löschen
const deleteUser = (user) => {
  if (confirm(`Möchten Sie den Benutzer "${user.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
    console.log('Benutzer löschen:', user);
    users.value = users.value.filter(item => item.id !== user.id);
  }
};

// Initialisierung
onMounted(() => {
  // Hier würden normalerweise API-Aufrufe erfolgen, um die Daten zu laden
  console.log('AdminUsers initialisiert');
});
</script>

<style scoped>
/* Zusätzliche Stile können hier hinzugefügt werden */
</style> 