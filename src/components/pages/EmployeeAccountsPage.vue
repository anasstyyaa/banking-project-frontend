<template>
  <DashboardLayout @logout="handleLogout">
    <template #header-actions>
      <SearchInput 
        v-model="searchQuery" 
        placeholder="Search active accounts by customer name or IBAN..." 
        style="max-width: 450px" 
      />
    </template>

    <template #content>
      <div class="page-header">
        <div class="header-titles">
          <AppText tag="h1" size="xl">Bank Accounts Ledger</AppText>
          <AppText size="sm" muted>Global monitoring, modification, and provisioning of active customer portfolios.</AppText>
        </div>
        
        <AppButton variant="primary" size="sm" @click="openCreationModal">
          + Provision New Account
        </AppButton>
      </div>

      <div class="animated-table-section">
        <div class="table-card-wrapper">
          <table class="ledger-table">
            <thead>
              <tr>
                <th><AppText size="xs" weight="bold" muted>CUSTOMER</AppText></th>
                <th><AppText size="xs" weight="bold" muted>IBAN</AppText></th>
                <th><AppText size="xs" weight="bold" muted>PRODUCT TYPE</AppText></th>
                <th class="text-right"><AppText size="xs" weight="bold" muted>ABSOLUTE LIMIT</AppText></th>
                <th class="text-right"><AppText size="xs" weight="bold" muted>DAILY LIMIT</AppText></th>
                <th class="text-right"><AppText size="xs" weight="bold" muted>AVAILABLE BALANCE</AppText></th>
                <th class="text-right"><AppText size="xs" weight="bold" muted>ACTIONS</AppText></th>
              </tr>
            </thead>
            <tbody v-if="paginatedAccounts.length > 0">
              <tr v-for="account in paginatedAccounts" :key="account.iban">
                <td>
                  <div class="customer-cell">
                    <AppText weight="bold" size="base">{{ account.customerName }}</AppText>
                    <AppText size="xs" muted>{{ account.customerEmail }}</AppText>
                  </div>
                </td>
                <td><AppText size="sm" class="monospace-text">{{ account.iban }}</AppText></td>
                <td>
                  <AppBadge :type="account.type === 'CHECKING' ? 'info' : 'success'">
                    {{ account.type }}
                  </AppBadge>
                </td>
                <td class="text-right"><AppText size="sm">{{ formatMoney(account.absoluteLimit) }}</AppText></td>
                <td class="text-right"><AppText size="sm">{{ formatMoney(account.dailyLimit) }}</AppText></td>
                <td class="text-right">
                  <AppText weight="bold" :class="{ 'negative-funds': account.balance < 0 }">
                    € {{ Number(account.balance).toFixed(2) }}
                  </AppText>
                </td>
                <td class="text-right">
                  <AppButton variant="ghost" size="sm" @click="openLimitEditor(account)">
                    Edit limits
                  </AppButton>
                  <AppButton
                    variant="ghost"
                    size="sm"
                    :disabled="account.balance != 0"
                    @click="closeAccount(account)"
                  >
                    Close account
                  </AppButton>
                </td>
              </tr>
            </tbody>
            
            <tbody v-else>
              <tr>
                <td colspan="7" class="empty-state-cell">
                  <div class="empty-state-content">
                    <AppIcon name="Inbox" :size="44" class="empty-icon" />
                    <AppText size="base" weight="bold" class="empty-title">No Matching Accounts</AppText>
                    <AppText size="sm" muted>We couldn't find any portfolios matching your current search parameters.</AppText>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div v-if="!selectedUser" class="selection-view">
            <div class="modal-header">
              <AppText tag="h3" size="lg" weight="bold">Target Profile Selection</AppText>
              <AppText size="sm" muted>Locate verified customer inside the registry context:</AppText>
            </div>
            <SearchInput v-model="userSearchQuery" placeholder="Type customer name to filter catalog..." />
            <div class="user-select-list">
              <div 
                v-for="user in filteredActiveUsers" 
                :key="user.id" 
                class="user-select-row"
                @click="selectedUser = user"
              >
                <AppText weight="bold">{{ user.firstName }} {{ user.lastName }}</AppText>
                <AppText size="xs" muted>{{ user.email }}</AppText>
              </div>
            </div>
          </div>

          <CreateAccountForm 
            v-else
            :customer-name="`${selectedUser.firstName} ${selectedUser.lastName}`"
            :loading="employeeStore.isCreatingAccount"
            @submit="handleAccountGeneration"
            @cancel="closeModal"
          />
        </div>
      </div>

      <div v-if="editingAccount" class="modal-overlay" @click.self="closeLimitEditor">
        <form class="modal-card limit-form" @submit.prevent="submitLimitUpdate">
          <div class="modal-header">
            <AppText tag="h3" size="lg" weight="bold">Edit Account Limits</AppText>
            <AppText size="sm" muted>{{ editingAccount.iban }}</AppText>
          </div>

          <label class="field">
            <AppText size="sm" weight="bold">Absolute limit</AppText>
            <input v-model="limitForm.absoluteLimit" class="limit-input" type="number" step="0.01" />
          </label>

          <label class="field">
            <AppText size="sm" weight="bold">Daily transfer limit</AppText>
            <input v-model="limitForm.dailyLimit" class="limit-input" type="number" step="0.01" min="0.01" />
          </label>

          <AppText v-if="limitError" size="sm" class="error-text">{{ limitError }}</AppText>

          <div class="form-actions">
            <AppButton type="button" variant="ghost" size="sm" :disabled="isUpdatingLimits" @click="closeLimitEditor">
              Cancel
            </AppButton>
            <AppButton type="submit" variant="primary" size="sm" :loading="isUpdatingLimits">
              Save limits
            </AppButton>
          </div>
        </form>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useEmployeeStore } from '@/stores/employee.store';
import DashboardLayout from '@/components/templates/EmployeeDashboardLayout/EmployeeDashboardLayout.vue';
import CreateAccountForm from '@/components/organisms/CreateAccountForm/CreateAccountForm.vue';
import SearchInput from '@/components/molecules/SearchInput/SearchInput.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import AppBadge from '@/components/atoms/Badge/Badge.vue';
import AppButton from '@/components/atoms/Button/Button.vue';
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue';
import AuthService from '@/services/auth.service';
import EmployeeService from '@/services/employee.service';
import AccountService from '@/services/account.service';

const router = useRouter();
const employeeStore = useEmployeeStore();

const searchQuery = ref('');
const userSearchQuery = ref('');
const showModal = ref(false);
const selectedUser = ref(null);
const allAccountsList = ref([]); 
const totalRows = ref(0);
const totalPages = ref(1);
const editingAccount = ref(null);
const isUpdatingLimits = ref(false);
const limitError = ref('');
const limitForm = ref({ absoluteLimit: '', dailyLimit: '' });


const ITEMS_PER_PAGE = 8;
const currentPage = ref(1);

const fetchAccountsLedger = async () => {
  try {
    const res = await EmployeeService.getAllSystemAccounts({ 
      page: currentPage.value - 1, 
      size: ITEMS_PER_PAGE,
      search: searchQuery.value || undefined
    });
    allAccountsList.value = res.data.content ?? res.data;
    totalRows.value = res.data.totalElements ?? allAccountsList.value.length;
    totalPages.value = res.data.totalPages ?? 1;
  } catch (err) {
    console.error("Ledger acquisition pipeline block:", err);
  }
};

const filteredAccounts = computed(() => allAccountsList.value);

const filteredAccounts = computed(() => {
  const term = searchQuery.value.toLowerCase().trim();
  if (!term) return allAccountsList.value;
  return allAccountsList.value.filter(acc => 
    acc.customerName?.toLowerCase().includes(term) || acc.iban?.toLowerCase().includes(term)
  );
});


const paginatedAccounts = computed(() => {
  return filteredAccounts.value;
});


const rowRangeStart = computed(() => (totalRows.value === 0 ? 0 : (currentPage.value - 1) * ITEMS_PER_PAGE + 1));
const rowRangeEnd = computed(() => Math.min(currentPage.value * ITEMS_PER_PAGE, totalRows.value));

const filteredActiveUsers = computed(() => {
  const term = userSearchQuery.value.toLowerCase().trim();
  const users = employeeStore.active.items;
  if (!term) return users;
  return users.filter(u =>
    u.firstName?.toLowerCase().includes(term) || u.lastName?.toLowerCase().includes(term)
  );
});

const openCreationModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
  userSearchQuery.value = '';
};

const handleAccountGeneration = async (payload) => {
  try {
    await employeeStore.createCustomerAccount(selectedUser.value.id, payload);
    await fetchAccountsLedger(); 
    
    closeModal();
  } catch (err) {
    console.error("Frontend generation step error context:", err);
    const errorDetails = err.response?.data?.message || err.message || "Unknown error";
    alert(`Generation feedback notice: ${errorDetails}`);
  }
};

const openLimitEditor = (account) => {
  editingAccount.value = account;
  limitForm.value = {
    absoluteLimit: String(account.absoluteLimit),
    dailyLimit: String(account.dailyLimit)
  };
  limitError.value = '';
};

const closeLimitEditor = () => {
  editingAccount.value = null;
  limitError.value = '';
};

const submitLimitUpdate = async () => {
  if (limitForm.value.absoluteLimit === '' || Number(limitForm.value.dailyLimit) <= 0) {
    limitError.value = 'Daily limit must be above zero and absolute limit must be valid.';
    return;
  }

  isUpdatingLimits.value = true;
  try {
    await AccountService.updateLimits(editingAccount.value.iban, {
      absoluteLimit: Number(limitForm.value.absoluteLimit),
      dailyLimit: Number(limitForm.value.dailyLimit)
    });
    await fetchAccountsLedger();
    closeLimitEditor();
  } catch (err) {
    limitError.value = err.response?.data?.message || 'Limit update failed.';
  } finally {
    isUpdatingLimits.value = false;
  }
};

const closeAccount = async (account) => {
  if (!confirm(`Close account ${account.iban}? This cannot be undone.`)) return;
  try {
    await AccountService.closeAccount(account.iban);
    await fetchAccountsLedger();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to close account.');
  }
};

const formatMoney = (value) => `EUR ${Number(value).toFixed(2)}`;

const handleLogout = async () => {
  await AuthService.logout();
  router.push('/login');
};


watch(searchQuery, () => {
  currentPage.value = 1;
  fetchAccountsLedger();
});

watch(currentPage, fetchAccountsLedger);

onMounted(() => {
  employeeStore.fetchActive({ page: 0, size: 100 });
  fetchAccountsLedger();
});
</script>

<style scoped>
.page-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: var(--space-xl); 
}
.header-titles { 
  display: flex; 
  flex-direction: column; 
  gap: var(--space-xs); 
}
.table-card-wrapper { 
  background: var(--color-white); 
  border-radius: var(--border-radius); 
  box-shadow: 0 4px 20px rgba(0,0,0,0.02); 
  overflow: hidden; 
}
.ledger-table { 
  width: 100%; 
  border-collapse: collapse; 
}
.ledger-table th, .ledger-table td { 
  padding: var(--space-md) var(--space-lg); 
  text-align: left; 
  border-bottom: 1px solid var(--color-gray-100); 
}
.ledger-table th { 
  background: var(--color-gray-100); 
}
.customer-cell { 
  display: flex; 
  flex-direction: column; 
}
.monospace-text { 
  font-family: monospace; 
  letter-spacing: 0.05em; 
  color: var(--color-primary-dark); 
}
.text-right { 
  text-align: right !important; 
}
.negative-funds { 
  color: var(--color-error); 
}


.empty-state-cell { 
  padding: var(--space-xl) 0; 
  text-align: center; 
}
.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
}
.empty-icon {
  color: var(--color-secondary);
  opacity: 0.6;
  margin-bottom: var(--space-sm);
}
.empty-title {
  color: var(--color-primary-dark);
  margin-bottom: var(--space-xs);
}


.animated-table-section {
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


.modal-overlay { 
  position: fixed; 
  top: 0; left: 0; 
  width: 100vw; 
  height: 100vh; 
  background: rgba(0,0,0,0.4); 
  z-index: 1000; display: flex; 
  align-items: center; 
  justify-content: center; 
}
.modal-card { 
  background: var(--color-white); 
  border-radius: var(--border-radius); 
  width: 100%; max-width: 500px; 
  box-shadow: 0 12px 40px rgba(0,0,0,0.15); 
  overflow: hidden; 
}
.selection-view { 
  padding: var(--space-lg); 
  display: flex; 
  flex-direction: column; 
  gap: var(--space-md); 
}
.user-select-list { 
  max-height: 250px; 
  overflow-y: auto; 
  border: 1px solid var(--color-gray-200); 
  border-radius: var(--border-radius); 
}
.user-select-row { 
  padding: var(--space-sm) var(--space-md); 
  border-bottom: 1px solid var(--color-gray-100); 
  cursor: pointer; transition: 
  background 0.2s; 
}
.user-select-row:hover { 
  background: var(--color-gray-100); 
}

.limit-form {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.limit-input {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius);
  font-family: var(--font-main);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
}

.error-text {
  color: var(--color-error);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
