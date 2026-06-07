<template>
  <section class="transaction-list">
    <div class="section-heading">
      <AppText tag="h2" size="lg" weight="bold">Transactions</AppText>
      <AppText size="sm" muted>{{ transactions.length }} records</AppText>
    </div>

    <div v-if="transactions.length" class="items">
      <TransactionItem
        v-for="transaction in transactions"
        :key="transaction.id"
        :title="titleFor(transaction)"
        :date="formatDate(transaction.timestamp)"
        :amount="amountFor(transaction)"
        :category="transaction.type"
      />
    </div>

    <div v-else class="empty-state">
      <AppText weight="bold">No transactions found</AppText>
      <AppText size="sm" muted>Transactions will appear here when they match the current view.</AppText>
    </div>
  </section>
</template>

<script setup>
import TransactionItem from '@/components/molecules/TransactionItem/TransactionItem.vue';
import AppText from '@/components/atoms/Text/Text.vue';

const props = defineProps({
  transactions: { type: Array, default: () => [] },
  accountIbans: { type: Array, default: () => [] }
});

const titleFor = (transaction) => {
  if (transaction.type === 'DEPOSIT') return `Deposit to ${transaction.toIban}`;
  if (transaction.type === 'WITHDRAWAL') return `Withdrawal from ${transaction.fromIban}`;
  return `${transaction.fromIban} to ${transaction.toIban}`;
};

const formatDate = (value) => {
  return new Intl.DateTimeFormat('nl-NL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

const amountFor = (transaction) => {
  const amount = Number(transaction.amount);
  if (transaction.type === 'TRANSFER' && props.accountIbans.includes(transaction.fromIban)) {
    return -Math.abs(amount);
  }
  return amount;
};
</script>

<style scoped>
.transaction-list {
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
