<template>
  <section class="account-summary">
    <div class="section-heading">
      <AppText tag="h2" size="lg" weight="bold">Accounts</AppText>
      <AppText size="sm" muted>{{ accounts.length }} visible accounts</AppText>
    </div>

    <div class="accounts-grid">
      <AccountBalance
        v-for="account in accounts"
        :key="account.iban"
        :account-name="account.type"
        :account-type="account.isActive ? 'Active' : 'Inactive'"
        :balance="Number(account.balance)"
        :account-number="account.iban"
      />
    </div>
  </section>
</template>

<script setup>
import AccountBalance from '@/components/molecules/AccountBalance/AccountBalance.vue';
import AppText from '@/components/atoms/Text/Text.vue';

defineProps({
  accounts: { type: Array, default: () => [] }
});
</script>

<style scoped>
.account-summary {
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

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-md);
}
</style>
