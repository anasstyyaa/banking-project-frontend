<template>
  <BankingLayout>
    <div class="page">
      <header class="page-header">
        <AppText tag="h1" size="xl" weight="bold">Transfer</AppText>
        <AppText size="sm" muted>Move money between bank accounts</AppText>
      </header>

      <TransferForm
        :accounts="accounts"
        :loading="loading"
        :error="error"
        :success="success"
        @submit="submitTransfer"
      />
    </div>
  </BankingLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { fetchAccounts } from '@/api/accounts';
import { createTransaction } from '@/api/transactions';
import BankingLayout from '@/components/templates/BankingLayout/BankingLayout.vue';
import TransferForm from '@/components/organisms/TransferForm/TransferForm.vue';
import AppText from '@/components/atoms/Text/Text.vue';

const accounts = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

const loadAccounts = async () => {
  try {
    accounts.value = await fetchAccounts();
  } catch (err) {
    error.value = err.response?.data?.message || 'Accounts could not be loaded.';
  }
};

const submitTransfer = async (payload) => {
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    await createTransaction(payload);
    success.value = 'Transfer completed.';
    await loadAccounts();
  } catch (err) {
    error.value = err.response?.data?.message || 'Transfer could not be completed.';
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
