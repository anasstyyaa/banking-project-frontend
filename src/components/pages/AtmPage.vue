<template>
  <BankingLayout>
    <div class="page">
      <header class="page-header">
        <AppText tag="h1" size="xl" weight="bold">ATM</AppText>
        <AppText size="sm" muted>Deposit or withdraw from your own account</AppText>
      </header>

      <AtmPanel
        :accounts="accounts"
        :loading="loading"
        :error="error"
        :success="success"
        @submit="submitAtmTransaction"
      />
    </div>
  </BankingLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AccountService from '@/services/account.service';
import TransactionService from '@/services/transaction.service';
import AtmPanel from '@/components/organisms/AtmPanel/AtmPanel.vue';
import BankingLayout from '@/components/templates/BankingLayout/BankingLayout.vue';
import AppText from '@/components/atoms/Text/Text.vue';

const accounts = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

const loadAccounts = async () => {
  try {
    const response = await AccountService.getAccounts();
    accounts.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Accounts could not be loaded.';
  }
};

const submitAtmTransaction = async (payload) => {
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    await TransactionService.createTransaction(payload);
    success.value = payload.type === 'DEPOSIT' ? 'Deposit completed.' : 'Withdrawal completed.';
    await loadAccounts();
  } catch (err) {
    error.value = err.response?.data?.message || 'ATM transaction could not be completed.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadAccounts);
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
</style>
