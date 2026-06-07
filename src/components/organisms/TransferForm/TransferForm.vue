<template>
  <form class="money-form" @submit.prevent="submitTransfer">
    <AppText tag="h2" size="lg" weight="bold">New transfer</AppText>

    <label class="field">
      <AppText size="sm" weight="bold">From account</AppText>
      <select v-model="form.fromIban" class="select">
        <option value="">Select source account</option>
        <option v-for="account in accounts" :key="account.iban" :value="account.iban">
          {{ account.type }} - {{ account.iban }}
        </option>
      </select>
    </label>

    
  <AppText size="sm" weight="bold">To account</AppText>

  <select v-model="form.toIban" class="select">
    <option value="">Own account</option>
    <option v-for="account in destinationAccounts" :key="account.iban" :value="account.iban">
      {{ account.type }} - {{ account.iban }}
    </option>
  </select>

    <input
      v-model="form.externalToIban"
      class="select"
      placeholder="NL01INHO000000003"
      :disabled="!!form.toIban"
    />
    

    <FormField label="Amount" type="number" v-model="form.amount" placeholder="0.00" />

    <AppText v-if="error" size="sm" class="message error">{{ error }}</AppText>
    <AppText v-if="success" size="sm" class="message success">{{ success }}</AppText>

    <AppButton type="submit" :loading="loading">Send transfer</AppButton>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import AppButton from '@/components/atoms/Button/Button.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import FormField from '@/components/molecules/FormField/FormField.vue';

const props = defineProps({
  accounts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  success: { type: String, default: '' }
});

const emit = defineEmits(['submit']);

const form = reactive({
  fromIban: '',
  toIban: '',
  externalToIban: '',
  amount: ''
});

const destinationAccounts = computed(() => {
  return props.accounts.filter((account) => account.iban !== form.fromIban);
});

watch(
  () => form.fromIban,
  () => {
    if (form.fromIban === form.toIban) {
      form.toIban = '';
    }
  }
);

watch(
  () => form.toIban,
  () => {
    if (form.toIban) {
      form.externalToIban = '';
    }
  }
);

const submitTransfer = () => {
  emit('submit', {
    type: 'TRANSFER',
    fromIban: form.fromIban,
    toIban: form.toIban || form.externalToIban,
    amount: Number(form.amount)
  });
};
</script>

<style scoped>
.money-form {
  background: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 560px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.destination-box {
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: var(--space-md);
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

.select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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