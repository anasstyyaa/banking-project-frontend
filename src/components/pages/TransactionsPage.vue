<template>
  <BankingLayout>
    <div class="page">
      <header class="page-header">
        <AppText tag="h1" size="xl" weight="bold">Transactions</AppText>
        <AppText size="sm" muted>Search and filter account activity</AppText>
      </header>

      <TransactionFilters @apply="applyFilters" @reset="resetFilters" />
      <AppText v-if="error" size="sm" class="error">{{ error }}</AppText>
      <TransactionList :transactions="transactions" :account-ibans="accountIbans" />

      <div v-if="totalElements > 0" class="pagination-footer">
        <AppText size="sm" muted>
          Showing page {{ page + 1 }} of {{ totalPages }}
        </AppText>
        <div class="pagination-controls">
          <button class="nav-btn" :disabled="page === 0" @click="changePage(page - 1)">Previous</button>
          <button class="nav-btn" :disabled="page + 1 >= totalPages" @click="changePage(page + 1)">Next</button>
        </div>
      </div>
    </div>
  </BankingLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AccountService from '@/services/account.service';
import TransactionService from '@/services/transaction.service';
import BankingLayout from '@/components/templates/BankingLayout/BankingLayout.vue';
import TransactionFilters from '@/components/organisms/TransactionFilters/TransactionFilters.vue';
import TransactionList from '@/components/organisms/TransactionList/TransactionList.vue';
import AppText from '@/components/atoms/Text/Text.vue';

const transactions = ref([]);
const accounts = ref([]);
const error = ref('');
const activeFilters = ref({});
const page = ref(0);
const pageSize = 20;
const totalPages = ref(1);
const totalElements = ref(0);
const accountIbans = computed(() => accounts.value.map((account) => account.iban));

const loadTransactions = async (filters = {}) => {
  try {
    error.value = '';
    const response = await TransactionService.getTransactions({ ...filters, page: page.value, size: pageSize });
    transactions.value = response.data.content ?? response.data;
    totalPages.value = response.data.totalPages ?? 1;
    totalElements.value = response.data.totalElements ?? transactions.value.length;
  } catch (err) {
    error.value = err.response?.data?.message || 'Transactions could not be loaded.';
  }
};

const applyFilters = async (filters = {}) => {
  activeFilters.value = filters;
  page.value = 0;
  await loadTransactions(activeFilters.value);
};

const resetFilters = async () => {
  activeFilters.value = {};
  page.value = 0;
  await loadTransactions();
};

const changePage = async (nextPage) => {
  page.value = nextPage;
  await loadTransactions(activeFilters.value);
};

const loadAccounts = async () => {
  try {
    const response = await AccountService.getAccounts({ page: 0, size: 100 });
    accounts.value = response.data.content ?? response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Accounts could not be loaded.';
  }
};

onMounted(() => {
  loadAccounts();
  loadTransactions();
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.error {
  color: var(--color-error);
  background: rgba(211, 47, 47, 0.08);
  padding: var(--space-sm);
  border-radius: var(--border-radius);
}

.pagination-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
}

.pagination-controls {
  display: flex;
  gap: var(--space-sm);
}

.nav-btn {
  background: var(--color-gray-100);
  color: var(--color-primary-dark);
  border: 1px solid var(--color-gray-200);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
