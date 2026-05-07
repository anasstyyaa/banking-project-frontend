<template>
  <BankingLayout>
    <div class="page">
      <header class="page-header">
        <AppText tag="h1" size="xl" weight="bold">Transactions</AppText>
        <AppText size="sm" muted>Search and filter account activity</AppText>
      </header>

      <TransactionFilters @apply="loadTransactions" @reset="loadTransactions({})" />
      <AppText v-if="error" size="sm" class="error">{{ error }}</AppText>
      <TransactionList :transactions="transactions" :account-ibans="accountIbans" />
    </div>
  </BankingLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { fetchAccounts } from '@/api/accounts';
import { fetchTransactions } from '@/api/transactions';
import BankingLayout from '@/components/templates/BankingLayout/BankingLayout.vue';
import TransactionFilters from '@/components/organisms/TransactionFilters/TransactionFilters.vue';
import TransactionList from '@/components/organisms/TransactionList/TransactionList.vue';
import AppText from '@/components/atoms/Text/Text.vue';

const transactions = ref([]);
const accounts = ref([]);
const error = ref('');
const accountIbans = computed(() => accounts.value.map((account) => account.iban));

const loadTransactions = async (filters = {}) => {
  try {
    error.value = '';
    transactions.value = await fetchTransactions(filters);
  } catch (err) {
    error.value = err.response?.data?.message || 'Transactions could not be loaded.';
  }
};

const loadAccounts = async () => {
  try {
    accounts.value = await fetchAccounts();
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
</style>
