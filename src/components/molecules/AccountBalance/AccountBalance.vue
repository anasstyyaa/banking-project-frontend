<template>
  <div class="account-balance">
    <div class="header">
      <AppText size="sm" muted weight="bold" class="label">
        {{ accountName }}
      </AppText>
      <AppBadge v-if="accountType" type="info">{{ accountType }}</AppBadge>
    </div>

    <div class="balance-row">
      <CurrencyLabel :value="balance" class="main-balance" />
    </div>

    <div class="footer" v-if="accountNumber">
      <AppText size="xs" muted>
        {{ maskedNumber }}
      </AppText>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AppText from '@/components/atoms/Text/Text.vue';
import AppBadge from '@/components/atoms/Badge/Badge.vue';
import CurrencyLabel from '@/components/atoms/CurrencyLabel/CurrencyLabel.vue';

const props = defineProps({
  accountName: { type: String, default: 'Main Account' },
  accountType: { type: String, default: 'Checkings' },
  balance: { type: Number, required: true },
  accountNumber: { type: String, default: '' }
});

const maskedNumber = computed(() => {
  if (!props.accountNumber) return '';
  return `**** **** **** ${props.accountNumber.slice(-4)}`;
});
</script>

<style scoped>
.account-balance {
  padding: var(--space-lg);
  background: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-width: 280px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.balance-row {
  margin: var(--space-xs) 0;
}


:deep(.main-balance) {
  font-size: 2.5rem;
  letter-spacing: -0.03em;
}

.footer {
  border-top: 1px solid var(--color-gray-100);
  padding-top: var(--space-sm);
}
</style>