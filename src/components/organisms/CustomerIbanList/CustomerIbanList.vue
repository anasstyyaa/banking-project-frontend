<template>
  <section class="customer-iban-list">
    <div class="section-heading">
      <AppText tag="h2" size="lg" weight="bold">Results</AppText>
      <AppText size="sm" muted>{{ accounts.length }} record{{ accounts.length !== 1 ? 's' : '' }}</AppText>
    </div>

    <div v-if="accounts.length" class="items">
      <div v-for="account in accounts" :key="account.iban" class="result-card">
        <div class="result-info">
          <AppText weight="bold">{{ account.customerName }}</AppText>
          <AppText size="sm" muted>{{ account.type }} · {{ account.iban }}</AppText>
        </div>
        <AppButton variant="secondary" size="sm" @click="$emit('copy', account.iban)">
          {{ copiedIban === account.iban ? '✓ Copied' : 'Copy IBAN' }}
        </AppButton>
      </div>
    </div>

    <div v-else class="empty-state">
      <AppText weight="bold">No accounts found</AppText>
      <AppText size="sm" muted>Try searching by first or last name.</AppText>
    </div>
  </section>
</template>

<script setup>
import AppText from '@/components/atoms/Text/Text.vue';
import AppButton from '@/components/atoms/Button/Button.vue';

defineProps({
  accounts: { type: Array, default: () => [] },
  copiedIban: { type: String, default: '' }
});

defineEmits(['copy']);
</script>

<style scoped>
.customer-iban-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-md);
}

.items {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.result-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: var(--space-md) var(--space-lg);
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.empty-state {
  padding: var(--space-xl);
  background: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
</style>