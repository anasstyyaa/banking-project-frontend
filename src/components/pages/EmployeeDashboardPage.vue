<template>
  <DashboardLayout>
    <template #sidebar>
      <AppSidebar current-route="registrations" @logout="handleLogout" />
    </template>

    <template #header-actions>
      <SearchInput 
        v-model="searchQuery" 
        placeholder="Search by name or BSN..." 
        style="max-width: 400px" 
      />
    </template>


    <template #content>
      <div class="content-header">
        <AppText tag="h1" size="xl">Registration Requests</AppText>
        <AppBadge v-if="pendingUsers.length" type="warning">
          {{ pendingUsers.length }} New
        </AppBadge>
      </div>

      <RegistrationTable 
        :users="filteredUsers" 
        @approve="handleApprove"
        @deny="handleDeny"
      />
    </template>
  </DashboardLayout>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import AppSidebar from '@/components/organisms/Sidebar/Sidebar.vue';
import RegistrationTable from '@/components/organisms/RegistrationTable/RegistrationTable.vue';
import SearchInput from '@/components/molecules/SearchInput/SearchInput.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import AppBadge from '@/components/atoms/Badge/Badge.vue';
import DashboardLayout from '@/components/templates/EmployeeDashboardLayout/EmployeeDashboardLayout.vue';
import EmployeeService from '@/services/employee.service';
import AuthService from '@/services/auth.service';
import { useRouter } from 'vue-router';

const pendingUsers = ref([]);
const searchQuery = ref('');
const router = useRouter();

const filteredUsers = computed(() => {
  return pendingUsers.value.filter(user => {
    const term = searchQuery.value.toLowerCase();
    return user.firstName.toLowerCase().includes(term) || 
           user.lastName.toLowerCase().includes(term) ||
           user.bsn.includes(term);
  });
});

const fetchUsers = async () => {
  try {
    const response = await EmployeeService.getPendingRegistrations();
    pendingUsers.value = response.data;
  } catch (err) {
    console.error("Auth Error", err);
  }
};

const handleApprove = async (id) => {
  await EmployeeService.approveUser(id);
  fetchUsers();
};

const handleDeny = async (id) => {
  if (confirm("Reject this application?")) {
    await EmployeeService.denyUser(id);
    fetchUsers();
  }
};

const handleLogout = async () => {
  try {
    await AuthService.logout(); 
  } catch (err) {
    console.warn("Backend logout failed, continuing with client-side cleanup");
  } finally {
    router.push('/login'); 
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  background: var(--color-gray-100);
  min-height: 100vh;
}

.dashboard-content {
  flex: 1;
  margin-left: 280px; 
  padding: var(--space-xl);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.header-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.search-bar {
  width: 320px;
}

.table-section {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>