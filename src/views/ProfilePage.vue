<template>
  <div class="profile-page container mx-auto px-4 py-8">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg border-2 border-red-200 mb-4">
      <p class="font-semibold">Fehler:</p>
      <p>{{ error }}</p>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- User Info -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ user?.name || 'Mein Profil' }}</h1>
            <p class="text-gray-600">{{ user?.email }}</p>
            <p class="mt-2 text-sm">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ isDoctor ? 'Arzt' : isHospital ? 'Klinik' : 'Benutzer' }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Doctor Profile Form -->
      <div v-if="isDoctor" class="mb-6">
        <DoctorProfileForm @profile-updated="handleDoctorProfileUpdate" />
      </div>
      
      <!-- Hospital Profile Form -->
      <div v-if="isHospital" class="mb-6">
        <HospitalProfileForm @profile-updated="handleHospitalProfileUpdate" />
      </div>
      
      <!-- Job Postings Manager - Show for both doctors and hospitals -->
      <div class="mb-6">
        <JobPostingsManager />
      </div>
      
      <!-- Bulletin Board Manager - Show for both doctors and hospitals -->
      <div class="mb-6">
        <BulletinBoardManager />
      </div>

      <!-- Account Management -->
      <div class="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Konto-Verwaltung</h2>
        
        <div class="flex flex-col space-y-4">
          <button 
            @click="logout" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Abmelden
          </button>
          
          <button 
            @click="showDeleteConfirm = true" 
            class="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Konto löschen
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Konto löschen bestätigen</h3>
        <p class="text-gray-700 mb-6">Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        
        <div class="flex justify-end space-x-4">
          <button 
            @click="showDeleteConfirm = false" 
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Abbrechen
          </button>
          <button 
            @click="deleteAccount" 
            :disabled="confirmDeleteLoading" 
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {{ confirmDeleteLoading ? 'Wird gelöscht...' : 'Konto löschen' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import api from '@/services/api';

import DoctorProfileForm from '@/components/profile/DoctorProfileForm.vue';
import HospitalProfileForm from '@/components/profile/HospitalProfileForm.vue';
import JobPostingsManager from '@/components/profile/JobPostingsManager.vue';
import BulletinBoardManager from '@/components/profile/BulletinBoardManager.vue';

// Define interfaces
interface User {
  id?: string;
  email: string;
  role?: string;
  name?: string;
}

interface DoctorProfile {
  name: string;
  title?: string;
  specialty?: string;
  experience?: number;
  contact?: {
    phone?: string;
    email?: string;
  };
  availability?: {
    from?: string;
    federalState?: string;
  };
  qualifications?: string[];
  otherQualifications?: string;
  additionalInfo?: string;
  [key: string]: any;
}

interface HospitalProfile {
  name: string;
  type?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  specialties?: string[];
  description?: string;
  website?: string;
  [key: string]: any;
}

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const error = ref<string>('');

// State
const user = ref<User | null>(null);
const loading = ref<boolean>(true);
const isDoctor = ref<boolean>(false);
const isHospital = ref<boolean>(false);
const doctorProfile = ref<DoctorProfile>({
  name: '',
  contact: {
    email: '',
    phone: ''
  }
});
const hospitalProfile = ref<HospitalProfile>({
  name: '',
  contact: {
    email: '',
    phone: ''
  },
  address: {
    street: '',
    city: '',
    postalCode: ''
  },
  specialties: []
});
const isDoctorProfileComplete = ref<boolean>(false);
const isHospitalProfileComplete = ref<boolean>(false);
const showProfileForm = ref<boolean>(false);
const showDeleteConfirm = ref<boolean>(false);
const confirmDeleteLoading = ref<boolean>(false);

// Computed properties for profile completeness checks
const isProfileComplete = computed(() => {
  if (isDoctor.value) {
    return isDoctorProfileComplete.value;
  } else if (isHospital.value) {
    return isHospitalProfileComplete.value;
  }
  return false;
});

// Methods
const loadProfile = async () => {
  try {
    loading.value = true;
    
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      await authStore.initAuth();
      
      if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
      }
    }
    
    // Get user data
    user.value = authStore.user;
    console.log('User data loaded:', user.value);
    
    // Determine user type based on authStore
    isDoctor.value = authStore.isDoctor;
    isHospital.value = authStore.isHospital;
    
    console.log('User type:', { 
      isDoctor: isDoctor.value, 
      isHospital: isHospital.value,
      role: user.value?.role
    });
    
    // Pre-populate email from user data
    if (user.value?.email) {
      if (isDoctor.value) {
        doctorProfile.value.contact!.email = user.value.email;
      } else if (isHospital.value) {
        hospitalProfile.value.contact!.email = user.value.email;
      }
    }
    
    // The profile forms will handle loading their own data
    // We don't need to load profile data here as it might cause 404 errors
    // Each form component has its own error handling for 404s
    
  } catch (err) {
    console.error('Error in profile loading process:', err);
    error.value = 'Fehler beim Laden des Profils';
  } finally {
    loading.value = false;
  }
};

// Check if doctor profile is complete
const checkDoctorProfileComplete = (): void => {
  if (!doctorProfile.value) {
    isDoctorProfileComplete.value = false;
    return;
  }
  
  isDoctorProfileComplete.value = Boolean(
    doctorProfile.value.name &&
    doctorProfile.value.specialty &&
    doctorProfile.value.contact?.email
  );
  
  // If profile is not complete, show the form
  if (!isDoctorProfileComplete.value) {
    showProfileForm.value = true;
  }
};

// Check if hospital profile is complete
const checkHospitalProfileComplete = (): void => {
  if (!hospitalProfile.value) {
    isHospitalProfileComplete.value = false;
    return;
  }
  
  isHospitalProfileComplete.value = Boolean(
    hospitalProfile.value.name &&
    hospitalProfile.value.type &&
    hospitalProfile.value.contact?.phone &&
    hospitalProfile.value.address?.street &&
    hospitalProfile.value.address?.postalCode &&
    hospitalProfile.value.address?.city &&
    hospitalProfile.value.specialties?.length
  );
  
  // If profile is not complete, show the form
  if (!isHospitalProfileComplete.value) {
    showProfileForm.value = true;
  }
};

// Handle profile updates
const handleDoctorProfileUpdate = (updatedProfile: DoctorProfile) => {
  // Create a new object to avoid mutating the ref directly
  doctorProfile.value = { ...doctorProfile.value, ...updatedProfile };
  checkDoctorProfileComplete();
  showProfileForm.value = false;
  toast.showToast('Profil erfolgreich aktualisiert', 'success');
};

const handleHospitalProfileUpdate = (updatedProfile: HospitalProfile) => {
  // Create a new object to avoid mutating the ref directly
  hospitalProfile.value = { ...hospitalProfile.value, ...updatedProfile };
  checkHospitalProfileComplete();
  showProfileForm.value = false;
  toast.showToast('Profil erfolgreich aktualisiert', 'success');
};

// Logout user
const logout = (): void => {
  authStore.logout().then(() => router.push('/login'));
};

// Delete account
const deleteAccount = async (): Promise<void> => {
  try {
    confirmDeleteLoading.value = true;
    await api.delete('/user/account');
    toast.showToast('Ihr Konto wurde erfolgreich gelöscht', 'success');
    await logout();
  } catch (err) {
    console.error('Error deleting account:', err);
    toast.showToast('Fehler beim Löschen des Kontos', 'error');
  } finally {
    confirmDeleteLoading.value = false;
    showDeleteConfirm.value = false;
  }
};

// Load profile when component is mounted
onMounted(async () => {
  await loadProfile();
  
  // Automatically show profile form for new users or incomplete profiles
  if (!isProfileComplete.value) {
    showProfileForm.value = true;
  }
});
</script>