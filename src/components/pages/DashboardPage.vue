<template>
  <BankingLayout>
    <div class="page">
      <header class="page-header">
        <AppText tag="h1" size="xl" weight="bold">Dashboard</AppText>
        <AppText size="sm" muted>Account balances and recent money movement</AppText>
      </header>

      <AppText v-if="error" size="sm" class="error">{{ error }}</AppText>
      <AccountSummary :accounts="accounts" />
      <TransactionList :transactions="transactions.slice(0, 5)" :account-ibans="accountIbans" />
    </div>
  </BankingLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AccountService from '@/services/account.service';
import TransactionService from '@/services/transaction.service';
import BankingLayout from '@/components/templates/BankingLayout/BankingLayout.vue';
import AccountSummary from '@/components/organisms/AccountSummary/AccountSummary.vue';
import TransactionList from '@/components/organisms/TransactionList/TransactionList.vue';
import AppText from '@/components/atoms/Text/Text.vue';

const accounts = ref([]);
const transactions = ref([]);
const error = ref('');
const accountIbans = computed(() => accounts.value.map((account) => account.iban));

const loadDashboard = async () => {
  try {
    const [accountResponse, transactionResponse] = await Promise.all([
      AccountService.getAccounts(),
      TransactionService.getTransactions()
    ]);
    accounts.value = accountResponse.data;
    transactions.value = transactionResponse.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Dashboard could not be loaded.';
  }
};

onMounted(loadDashboard);
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
