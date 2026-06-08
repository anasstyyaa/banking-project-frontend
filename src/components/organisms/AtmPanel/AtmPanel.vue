<template>
  <form class="atm-panel" @submit.prevent="submitAtmTransaction">
    <div class="heading">
      <AppText tag="h2" size="lg" weight="bold">ATM</AppText>
      <AppText size="sm" muted>{{ customerEmail }}</AppText>
    </div>

    <div class="mode-toggle">
      <button type="button" :class="{ active: mode === 'DEPOSIT' }" @click="mode = 'DEPOSIT'">Deposit</button>
      <button type="button" :class="{ active: mode === 'WITHDRAWAL' }" @click="mode = 'WITHDRAWAL'">Withdraw</button>
    </div>

    <label class="field">
      <AppText size="sm" weight="bold">Checking account</AppText>
      <select v-model="form.iban" class="select">
        <option value="">Select checking account</option>
        <option v-for="account in accounts" :key="account.iban" :value="account.iban">
          {{ account.type }} - {{ account.iban }}
        </option>
      </select>
    </label>

    <FormField label="Amount" type="number" v-model="form.amount" placeholder="0.00" />

    <AppText v-if="error" size="sm" class="message error">{{ error }}</AppText>
    <AppText v-if="success" size="sm" class="message success">{{ success }}</AppText>

    <AppButton type="submit" :loading="loading">
      {{ mode === 'DEPOSIT' ? 'Deposit money' : 'Withdraw money' }}
    </AppButton>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import AppButton from '@/components/atoms/Button/Button.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import FormField from '@/components/molecules/FormField/FormField.vue';

defineProps({
  accounts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  success: { type: String, default: '' },
  customerEmail: { type: String, default: '' }
});

const emit = defineEmits(['submit']);
const mode = ref('DEPOSIT');
const form = reactive({ iban: '', amount: '' });

const submitAtmTransaction = () => {
  if (!form.iban || Number(form.amount) <= 0) return;

  emit('submit', {
    type: mode.value,
    fromIban: mode.value === 'WITHDRAWAL' ? form.iban : null,
    toIban: mode.value === 'DEPOSIT' ? form.iban : null,
    amount: Number(form.amount)
  });
};
</script>

<style scoped>
.atm-panel {
  background: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 560px;
}

.heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.mode-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.mode-toggle button {
  border: none;
  background: var(--color-white);
  color: var(--color-primary-dark);
  padding: var(--space-sm);
  cursor: pointer;
  font-weight: 700;
}

.mode-toggle .active {
  background: var(--color-secondary);
  color: var(--color-white);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.select {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  background: var(--color-white);
  color: var(--color-primary-dark);
  font-family: var(--font-main);
  font-size: 1rem;
}

.message {
  padding: var(--space-sm);
  border-radius: var(--border-radius);
}

.error {
  color: var(--color-error);
  background: rgba(211, 47, 47, 0.08);
}

.success {
  color: var(--color-success);
  background: rgba(46, 125, 50, 0.08);
}
</style>
