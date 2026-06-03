<template>
  <BankingLayout>
    <div class="page">
      <header class="page-header">
        <AppText tag="h1" size="xl" weight="bold">Find Account</AppText>
        <AppText size="sm" muted>Search for a customer by name and copy their IBAN</AppText>
      </header>

      <div class="search-box">
        <SearchInput v-model="query" placeholder="Search by first or last name..." />
      </div>

      <div v-if="loading" class="state-msg">
        <AppText size="sm" muted>Searching...</AppText>
      </div>

      <div v-else-if="error" class="error">
        <AppText size="sm">{{ error }}</AppText>
      </div>

      <CustomerIbanList
        v-else-if="searched"
        :accounts="results"
        :copiedIban="copiedIban"
        @copy="copyIban"
      />
    </div>
  </BankingLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import AccountService from '@/services/account.service';
import BankingLayout from '@/components/templates/BankingLayout/BankingLayout.vue';
import SearchInput from '@/components/molecules/SearchInput/SearchInput.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import CustomerIbanList from '@/components/organisms/CustomerIbanList/CustomerIbanList.vue';

const query = ref('');
const results = ref([]);
const loading = ref(false);
const error = ref('');
const searched = ref(false);
const copiedIban = ref('');

let debounceTimer = null;

watch(query, (val) => {
  clearTimeout(debounceTimer);
  if (val.trim().length < 2) {
    results.value = [];
    searched.value = false;
    return;
  }
  debounceTimer = setTimeout(() => search(val.trim()), 400);
});

const search = async (name) => {
  loading.value = true;
  error.value = '';
  searched.value = true;
  try {
    const response = await AccountService.searchByName(name);
    results.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Search failed.';
  } finally {
    loading.value = false;
  }
};

const copyIban = (iban) => {
  navigator.clipboard.writeText(iban);
  copiedIban.value = iban;
  setTimeout(() => (copiedIban.value = ''), 2000);
};
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
.search-box {
  max-width: 520px;
}
.state-msg {
  padding: var(--space-lg) 0;
}
.error {
  color: var(--color-error);
  background: rgba(211, 47, 47, 0.08);
  padding: var(--space-sm);
  border-radius: var(--border-radius);
}
</style>