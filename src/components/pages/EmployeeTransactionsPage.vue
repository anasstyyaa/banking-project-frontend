<template>
  <DashboardLayout @logout="handleLogout">
    <template #header-actions>
      <SearchInput
        v-if="activeTab === 'customer'"
        v-model="customerSearchQuery"
        placeholder="Search customers by name..."
        style="max-width: 400px"
      />
    </template>

    <template #content>
      <div class="tabs-container">
        <button :class="['tab-btn', { active: activeTab === 'all' }]" @click="switchTab('all')">
          <AppText weight="bold">All Transactions</AppText>
        </button>
        <button :class="['tab-btn', { active: activeTab === 'customer' }]" @click="switchTab('customer')">
          <AppText weight="bold">Filter by Customer</AppText>
        </button>
      </div>

      <div class="content-header">
        <div>
          <AppText tag="h1" size="xl">
            {{ activeTab === 'all' ? 'All Transactions' : 'Customer Transactions' }}
          </AppText>
          <AppText size="sm" muted>
            {{ activeTab === 'all'
              ? 'System-wide transaction history including ATM, transfers, and employee-initiated operations.'
              : 'Search for a customer to view their full transaction history.' }}
          </AppText>
        </div>
      </div>

      <form class="employee-transfer-form" @submit.prevent="submitEmployeeTransfer">
        <div class="transfer-grid">
          <label class="field">
            <AppText size="sm" weight="bold">From checking account</AppText>
            <select v-model="transferForm.fromIban" class="select">
              <option value="">Select source account</option>
              <option v-for="account in checkingAccounts" :key="account.iban" :value="account.iban">
                {{ account.customerName }} - {{ account.iban }}
              </option>
            </select>
          </label>

          <label class="field">
            <AppText size="sm" weight="bold">To checking account</AppText>
            <select v-model="transferForm.toIban" class="select">
              <option value="">Select destination account</option>
              <option v-for="account in destinationAccounts" :key="account.iban" :value="account.iban">
                {{ account.customerName }} - {{ account.iban }}
              </option>
            </select>
          </label>

          <label class="field">
            <AppText size="sm" weight="bold">Amount</AppText>
            <input v-model="transferForm.amount" class="select" type="number" min="0.01" step="0.01" />
          </label>
        </div>

        <div class="transfer-actions">
          <AppText v-if="transferError" size="sm" class="message error">{{ transferError }}</AppText>
          <AppText v-if="transferSuccess" size="sm" class="message success">{{ transferSuccess }}</AppText>
          <AppButton type="submit" variant="primary" size="sm" :loading="isSubmittingTransfer">
            Transfer funds
          </AppButton>
        </div>
      </form>

      <!-- Filter by Customer: customer selector -->
      <div v-if="activeTab === 'customer'" class="customer-selector-section">
        <div v-if="filteredCustomers.length > 0 && !selectedCustomer" class="customer-list">
          <div
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="customer-row"
            @click="selectCustomer(customer)"
          >
            <AppText weight="bold">{{ customer.firstName }} {{ customer.lastName }}</AppText>
            <AppText size="xs" muted>{{ customer.email }}</AppText>
          </div>
        </div>

        <div v-if="selectedCustomer" class="selected-customer-tag">
          <AppText size="sm" weight="bold">{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</AppText>
          <button class="clear-btn" @click="clearCustomer">✕</button>
        </div>
      </div>

      <TransactionFilters @apply="applyFilters" @reset="resetFilters" />

      <!-- Transactions Table -->
      <div class="table-section" :key="activeTab + selectedCustomer?.id">
        <div class="table-card-wrapper">
          <table class="ledger-table">
            <thead>
              <tr>
                <th><AppText size="xs" weight="bold" muted>TYPE</AppText></th>
                <th><AppText size="xs" weight="bold" muted>FROM IBAN</AppText></th>
                <th><AppText size="xs" weight="bold" muted>TO IBAN</AppText></th>
                <th><AppText size="xs" weight="bold" muted>INITIATED BY</AppText></th>
                <th><AppText size="xs" weight="bold" muted>TIMESTAMP</AppText></th>
                <th class="text-right"><AppText size="xs" weight="bold" muted>AMOUNT</AppText></th>
              </tr>
            </thead>

            <tbody v-if="paginatedTransactions.length > 0">
              <tr v-for="tx in paginatedTransactions" :key="tx.id">
                <td>
                  <AppBadge :type="badgeType(tx.type)">{{ tx.type }}</AppBadge>
                </td>
                <td><AppText size="sm" class="monospace-text">{{ tx.fromIban ?? '—' }}</AppText></td>
                <td><AppText size="sm" class="monospace-text">{{ tx.toIban ?? '—' }}</AppText></td>
                <td><AppText size="sm" muted>{{ tx.initiatedByEmail }}</AppText></td>
                <td><AppText size="sm" muted>{{ formatDate(tx.timestamp) }}</AppText></td>
                <td class="text-right">
                  <AppText weight="bold">€ {{ Number(tx.amount).toFixed(2) }}</AppText>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td colspan="6" class="empty-state-cell">
                  <div class="empty-state-content">
                    <AppIcon name="Inbox" :size="44" class="empty-icon" />
                    <AppText size="base" weight="bold" class="empty-title">No Transactions Found</AppText>
                    <AppText size="sm" muted>
                      {{ activeTab === 'customer' && !selectedCustomer
                        ? 'Search and select a customer above to view their transactions.'
                        : 'No transactions match the current view.' }}
                    </AppText>
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
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '@/components/templates/EmployeeDashboardLayout/EmployeeDashboardLayout.vue';
import SearchInput from '@/components/molecules/SearchInput/SearchInput.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import AppBadge from '@/components/atoms/Badge/Badge.vue';
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue';
import AppButton from '@/components/atoms/Button/Button.vue';
import TransactionFilters from '@/components/organisms/TransactionFilters/TransactionFilters.vue';
import AuthService from '@/services/auth.service';
import TransactionService from '@/services/transaction.service';
import EmployeeService from '@/services/employee.service';

const router = useRouter();

const activeTab = ref('all');
const allTransactions = ref([]);
const customerTransactions = ref([]);
const allCustomers = ref([]);
const allAccounts = ref([]);
const allTotalRows = ref(0);
const customerTotalRows = ref(0);
const allTotalPages = ref(1);
const customerTotalPages = ref(1);
const selectedCustomer = ref(null);
const customerSearchQuery = ref('');
const activeFilters = ref({});
const isSubmittingTransfer = ref(false);
const transferError = ref('');
const transferSuccess = ref('');
const transferForm = ref({ fromIban: '', toIban: '', amount: '' });

const ITEMS_PER_PAGE = 10;
const allPage = ref(1);
const customerPage = ref(1);

const currentPage = computed({
  get: () => activeTab.value === 'all' ? allPage.value : customerPage.value,
  set: (val) => {
    if (activeTab.value === 'all') allPage.value = val;
    else customerPage.value = val;
  }
});

const activeTransactions = computed(() =>
  activeTab.value === 'all' ? allTransactions.value : customerTransactions.value
);

const paginatedTransactions = computed(() => activeTransactions.value);

const totalRows = computed(() => activeTab.value === 'all' ? allTotalRows.value : customerTotalRows.value);
const totalPages = computed(() => activeTab.value === 'all' ? allTotalPages.value : customerTotalPages.value);
const rowRangeStart = computed(() => totalRows.value === 0 ? 0 : (currentPage.value - 1) * ITEMS_PER_PAGE + 1);
const rowRangeEnd = computed(() => Math.min(currentPage.value * ITEMS_PER_PAGE, totalRows.value));

const filteredCustomers = computed(() => {
  if (selectedCustomer.value) return [];
  const term = customerSearchQuery.value.toLowerCase().trim();
  if (!term) return [];
  return allCustomers.value.filter(c =>
    c.firstName?.toLowerCase().includes(term) || c.lastName?.toLowerCase().includes(term)
  );
});

const checkingAccounts = computed(() =>
  allAccounts.value.filter((account) => account.type === 'CHECKING')
);

const destinationAccounts = computed(() =>
  checkingAccounts.value.filter((account) => account.iban !== transferForm.value.fromIban)
);

const fetchAllTransactions = async () => {
  try {
    const res = await TransactionService.getTransactions({
      ...activeFilters.value,
      page: allPage.value - 1,
      size: ITEMS_PER_PAGE
    });
    allTransactions.value = res.data.content ?? res.data;
    allTotalRows.value = res.data.totalElements ?? allTransactions.value.length;
    allTotalPages.value = res.data.totalPages ?? 1;
  } catch (err) {
    console.error('Failed to load transactions:', err);
  }
};

const fetchCustomerTransactions = async (userId) => {
  try {
    const res = await TransactionService.getTransactions({
      ...activeFilters.value,
      userId,
      page: customerPage.value - 1,
      size: ITEMS_PER_PAGE
    });
    customerTransactions.value = res.data.content ?? res.data;
    customerTotalRows.value = res.data.totalElements ?? customerTransactions.value.length;
    customerTotalPages.value = res.data.totalPages ?? 1;
  } catch (err) {
    console.error('Failed to load customer transactions:', err);
  }
};

const fetchAccounts = async () => {
  try {
    const res = await EmployeeService.getAllSystemAccounts({ page: 0, size: 100 });
    allAccounts.value = res.data.content ?? res.data;
  } catch (err) {
    console.error('Failed to load accounts:', err);
  }
};

const submitEmployeeTransfer = async () => {
  transferError.value = '';
  transferSuccess.value = '';

  if (!transferForm.value.fromIban || !transferForm.value.toIban || Number(transferForm.value.amount) <= 0) {
    transferError.value = 'Select two checking accounts and enter an amount above zero.';
    return;
  }

  isSubmittingTransfer.value = true;
  try {
    await TransactionService.createTransaction({
      type: 'TRANSFER',
      fromIban: transferForm.value.fromIban,
      toIban: transferForm.value.toIban,
      amount: Number(transferForm.value.amount)
    });
    transferSuccess.value = 'Transfer saved.';
    transferForm.value = { fromIban: '', toIban: '', amount: '' };
    allPage.value = 1;
    customerPage.value = 1;
    const refreshTransactions = activeTab.value === 'customer' && selectedCustomer.value
      ? fetchCustomerTransactions(selectedCustomer.value.id)
      : fetchAllTransactions();
    await Promise.all([refreshTransactions, fetchAccounts()]);
  } catch (err) {
    transferError.value = err.response?.data?.message || 'Transfer failed.';
  } finally {
    isSubmittingTransfer.value = false;
  }
};

const selectCustomer = async (customer) => {
  selectedCustomer.value = customer;
  customerSearchQuery.value = '';
  customerPage.value = 1;
  await fetchCustomerTransactions(customer.id);
};

const clearCustomer = () => {
  selectedCustomer.value = null;
  customerTransactions.value = [];
  customerTotalRows.value = 0;
  customerTotalPages.value = 1;
  customerPage.value = 1;
};

const switchTab = (tab) => {
  activeTab.value = tab;
  if (tab === 'all') {
    fetchAllTransactions();
  } else if (selectedCustomer.value) {
    fetchCustomerTransactions(selectedCustomer.value.id);
  }
};

const applyFilters = async (filters = {}) => {
  activeFilters.value = filters;
  allPage.value = 1;
  customerPage.value = 1;

  if (activeTab.value === 'customer' && selectedCustomer.value) {
    await fetchCustomerTransactions(selectedCustomer.value.id);
    return;
  }

  if (activeTab.value === 'customer') {
    customerTransactions.value = [];
    customerTotalRows.value = 0;
    customerTotalPages.value = 1;
    return;
  }

  await fetchAllTransactions();
};

const resetFilters = async () => {
  activeFilters.value = {};
  allPage.value = 1;
  customerPage.value = 1;

  if (activeTab.value === 'customer' && selectedCustomer.value) {
    await fetchCustomerTransactions(selectedCustomer.value.id);
    return;
  }

  if (activeTab.value === 'customer') {
    customerTransactions.value = [];
    customerTotalRows.value = 0;
    customerTotalPages.value = 1;
    return;
  }

  await fetchAllTransactions();
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('nl-NL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const badgeType = (type) => {
  if (type === 'TRANSFER') return 'info';
  if (type === 'DEPOSIT') return 'success';
  return 'warning';
};

const handleLogout = async () => {
  try { await AuthService.logout(); }
  catch (err) { console.warn('Session clear fallback.'); }
  finally { router.push('/login'); }
};

watch(customerSearchQuery, () => {
  customerPage.value = 1;
});

watch(allPage, () => {
  if (activeTab.value === 'all') fetchAllTransactions();
});

watch(customerPage, () => {
  if (activeTab.value === 'customer' && selectedCustomer.value) {
    fetchCustomerTransactions(selectedCustomer.value.id);
  }
});

onMounted(async () => {
  await Promise.all([fetchAllTransactions(), fetchAccounts()]);
  try {
    const res = await EmployeeService.getRegistrations('APPROVED', { page: 0, size: 100 });
    allCustomers.value = res.data.content;
  } catch (err) {
    console.error('Failed to load customers:', err);
  }
});
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

.tab-btn:hover { color: var(--color-primary-dark); }

.tab-btn.active {
  color: var(--color-primary-dark);
  border-bottom-color: var(--color-secondary);
}

.content-header {
  margin-bottom: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.employee-transfer-form {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.transfer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.select {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius);
  background: var(--color-white);
  font-family: var(--font-main);
}

.transfer-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-md);
}

.message {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius);
}

.error {
  color: var(--color-error);
  background: rgba(211, 47, 47, 0.08);
}

.success {
  color: var(--color-success);
  background: rgba(46, 125, 50, 0.08);
}

.customer-selector-section {
  margin-bottom: var(--space-lg);
}

.customer-list {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius);
  max-height: 200px;
  overflow-y: auto;
}

.customer-row {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--color-gray-100);
  cursor: pointer;
  transition: background 0.2s;
}

.customer-row:hover { background: var(--color-gray-100); }

.selected-customer-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-secondary);
  color: var(--color-white);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--border-radius);
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  line-height: 1;
}

.table-section { animation: slideUp 0.3s ease-out; }

.table-card-wrapper {
  background: var(--color-white);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  overflow: hidden;
}

.ledger-table { width: 100%; border-collapse: collapse; }

.ledger-table th, .ledger-table td {
  padding: var(--space-md) var(--space-lg);
  text-align: left;
  border-bottom: 1px solid var(--color-gray-100);
}

.ledger-table th { background: var(--color-gray-100); }

.monospace-text {
  font-family: monospace;
  letter-spacing: 0.05em;
  color: var(--color-primary-dark);
}

.text-right { text-align: right !important; }

.empty-state-cell { padding: var(--space-xl) 0; text-align: center; }

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xl);
}

.empty-icon { color: var(--color-secondary); opacity: 0.6; margin-bottom: var(--space-sm); }
.empty-title { color: var(--color-primary-dark); margin-bottom: var(--space-xs); }

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

.pagination-controls { display: flex; align-items: center; gap: var(--space-md); }

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

.nav-btn:hover:not(:disabled) { background: var(--color-primary); border-color: var(--color-primary); }
.nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-indicator { min-width: 100px; text-align: center; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .transfer-grid {
    grid-template-columns: 1fr;
  }

  .transfer-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
