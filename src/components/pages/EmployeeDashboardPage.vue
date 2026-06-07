<template>
  <DashboardLayout>
    <template #sidebar>
      <AppSidebar current-route="registrations" @logout="handleLogout" />
    </template>

    <template #header-actions>
      <SearchInput v-model="searchQuery" :placeholder="searchPlaceholder" style="max-width: 400px" />
    </template>

    <template #content>
      <div class="tabs-container">
        <button :class="['tab-btn', { active: activeTab === 'pending' }]" @click="activeTab = 'pending'">
          <AppText weight="bold">Pending Requests</AppText>
          <AppBadge v-if="employeeStore.pending.totalElements" type="warning">
          {{ employeeStore.pending.totalElements }}
        </AppBadge>
        </button>

        <button :class="['tab-btn', { active: activeTab === 'active' }]" @click="activeTab = 'active'">
          <AppText weight="bold">Active Customers</AppText>
          <AppBadge v-if="employeeStore.active.totalElements" type="info">
            {{ employeeStore.active.totalElements }}
          </AppBadge>
        </button>
      </div>

      <div class="content-header">
        <AppText tag="h1" size="xl">
          {{ activeTab === 'pending' ? 'Registration Requests' : 'Customer Database' }}
        </AppText>
      </div>

      <div class="table-section" :key="activeTab">
        <RegistrationTable 
          :users="tableUsers" 
          :is-read-only="activeTab === 'active'"
          @approve="handleApprove"
          @deny="handleDeny"
        />

        <div v-if="totalRows > 0" class="pagination-footer">
          <AppText size="sm" muted>
            Showing <b>{{ rowRangeStart }}</b> to <b>{{ rowRangeEnd }}</b> of <b>{{ totalRows }}</b> items
          </AppText>
          <div class="pagination-controls">
            <button class="nav-btn" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
            <span class="page-indicator">
              <AppText size="sm" weight="bold">Page {{ currentPage }} of {{ totalPages }}</AppText>
            </span>
            <button class="nav-btn" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useEmployeeStore } from '@/stores/employee.store';
import AppSidebar from '@/components/organisms/Sidebar/Sidebar.vue';
import RegistrationTable from '@/components/organisms/RegistrationTable/RegistrationTable.vue';
import SearchInput from '@/components/molecules/SearchInput/SearchInput.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import AppBadge from '@/components/atoms/Badge/Badge.vue';
import DashboardLayout from '@/components/templates/EmployeeDashboardLayout/EmployeeDashboardLayout.vue';
import EmployeeService from '@/services/employee.service';
import AuthService from '@/services/auth.service';
const router = useRouter();
const employeeStore = useEmployeeStore();

const activeTab = ref('pending');
const searchQuery = ref('');

const PAGE_SIZE = 8;
const pendingPage = ref(1);
const activePage = ref(1);

const currentPage = computed({
  get: () => (activeTab.value === 'pending' ? pendingPage.value : activePage.value),
  set: (val) => {
    if (activeTab.value === 'pending') {
      pendingPage.value = val;
    } else {
      activePage.value = val;
    }
  }
});

const searchPlaceholder = computed(() => {
  return activeTab.value === 'pending'
    ? "Search requests by name or BSN..."
    : "Search customers by name, BSN, or IBAN...";
});

const activeList = computed(() => (activeTab.value === 'pending' ? employeeStore.pending : employeeStore.active));

const tableUsers = computed(() => activeList.value.items);

const totalRows = computed(() => activeList.value.totalElements);
const totalPages = computed(() => activeList.value.totalPages || 1);

const rowRangeStart = computed(() => (totalRows.value === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1));
const rowRangeEnd = computed(() => Math.min(currentPage.value * PAGE_SIZE, totalRows.value));

const fetchActiveTab = async () => {
  const params = { page: currentPage.value - 1, size: PAGE_SIZE, search: searchQuery.value.trim() };
  if (activeTab.value === 'pending') {
    await employeeStore.fetchPending(params);
  } else {
    await employeeStore.fetchActive(params);
  }
};

const handleTabChange = (tabName) => {
  activeTab.value = tabName;
};

const handleApprove = async (id, limits = {}) => {
  await employeeStore.updateRegistrationStatus(id, { status: 'APPROVED', ...limits }, fetchActiveTab);
};

const handleDeny = async (id) => {
  if (confirm("Reject this application? This deletes the registration record.")) {
    await employeeStore.updateRegistrationStatus(id, { status: 'DENIED' }, fetchActiveTab);
  }
};

let searchDebounce;
watch(searchQuery, () => {
  currentPage.value = 1;
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(fetchActiveTab, 300);
});

watch(activeTab, () => { currentPage.value = 1; fetchActiveTab(); });
watch(currentPage, fetchActiveTab);

onMounted(() => {
  fetchActiveTab();
});

const handleLogout = async () => {
  try { await AuthService.logout(); } 
  catch (err) { console.warn("Backend session invalid, proceeding with local clear."); } 
  finally { router.push('/login'); }
};
</script>

<style scoped>
.tabs-container {
  display: flex;
  gap: var(--space-md);
  border-bottom: 2px solid var(--color-gray-200);
  margin-bottom: var(--space-xl);
  padding-bottom: 2px;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: var(--space-sm) var(--space-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-gray-500);
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  margin-bottom: -4px;
}

.tab-btn:hover {
  color: var(--color-primary-dark);
}

.tab-btn.active {
  color: var(--color-primary-dark);
  border-bottom-color: var(--color-secondary); 
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.table-section {
  animation: slideUp 0.3s ease-out;
}


.pagination-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-white);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.nav-btn {
  background: var(--color-gray-100);
  color: var(--color-primary-dark);
  border: 1px solid var(--color-gray-200);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-indicator {
  min-width: 100px;
  text-align: center;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>