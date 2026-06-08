<template>
  <form class="money-form" @submit.prevent="submitTransfer">
    <AppText tag="h2" size="lg" weight="bold">New transfer</AppText>

    <div class="field">
      <AppText size="sm" weight="bold">Transfer type</AppText>
      <div class="mode-toggle" role="group" aria-label="Transfer type">
        <button
          type="button"
          class="mode-button"
          :class="{ active: transferMode === 'OWN' }"
          @click="selectTransferMode('OWN')"
        >
          Own accounts
        </button>
        <button
          type="button"
          class="mode-button"
          :class="{ active: transferMode === 'EXTERNAL' }"
          @click="selectTransferMode('EXTERNAL')"
        >
          Another customer
        </button>
      </div>
    </div>

    <label class="field">
      <AppText size="sm" weight="bold">{{ sourceAccountLabel }}</AppText>
      <select v-model="form.fromIban" class="select">
        <option value="">Select source account</option>
        <option v-for="account in sourceAccounts" :key="account.iban" :value="account.iban">
          {{ account.type }} - {{ account.iban }}
        </option>
      </select>
    </label>

    <label v-if="transferMode === 'OWN'" class="field">
      <AppText size="sm" weight="bold">To own account</AppText>
      <select v-model="form.toIban" class="select">
        <option value="">Select destination account</option>
        <option v-for="account in destinationAccounts" :key="account.iban" :value="account.iban">
          {{ account.type }} - {{ account.iban }}
        </option>
      </select>
    </label>

    <label v-else class="field">
      <AppText size="sm" weight="bold">Customer checking IBAN</AppText>
      <input
        v-model.trim="form.externalToIban"
        class="select"
        placeholder="NL01INHO000000003"
      />
    </label>

    <FormField label="Amount" type="number" v-model="form.amount" placeholder="0.00" />

    <AppText v-if="displayError" size="sm" class="message error">{{ displayError }}</AppText>
    <AppText v-if="success" size="sm" class="message success">{{ success }}</AppText>

    <AppButton type="submit" :loading="loading">Send transfer</AppButton>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
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
const transferMode = ref('OWN');
const localError = ref('');

const form = reactive({
  fromIban: '',
  toIban: '',
  externalToIban: '',
  amount: ''
});

const ibanPattern = /^NL\d{2}INHO\d{10}$/;

const isCheckingAccount = (account) => {
  return String(account.type).toUpperCase() === 'CHECKING';
};

const sourceAccounts = computed(() => {
  if (transferMode.value === 'EXTERNAL') {
    return props.accounts.filter(isCheckingAccount);
  }

  return props.accounts;
});

const destinationAccounts = computed(() => {
  return props.accounts.filter((account) => account.iban !== form.fromIban);
});

const sourceAccountLabel = computed(() => {
  return transferMode.value === 'EXTERNAL' ? 'From checking account' : 'From account';
});

const displayError = computed(() => localError.value || props.error);

// Keep mode changes explicit so old destination values cannot leak into the next transfer.
const selectTransferMode = (mode) => {
  transferMode.value = mode;
  localError.value = '';
  form.fromIban = '';
  form.toIban = '';
  form.externalToIban = '';
};

watch(
  () => form.fromIban,
  () => {
    localError.value = '';

    if (form.fromIban === form.toIban) {
      form.toIban = '';
    }
  }
);

watch(
  () => form.toIban,
  () => {
    localError.value = '';
  }
);

watch(
  () => form.externalToIban,
  () => {
    localError.value = '';
  }
);

watch(
  () => form.amount,
  () => {
    localError.value = '';
  }
);

// Validate only form guidance here; transaction business rules still belong to the backend policy.
const validateTransferForm = () => {
  const amount = Number(form.amount);
  const externalIban = form.externalToIban.toUpperCase();

  if (!form.fromIban) {
    localError.value = 'Select the account to transfer from.';
    return false;
  }

  if (!amount || amount <= 0) {
    localError.value = 'Enter an amount greater than zero.';
    return false;
  }

  if (transferMode.value === 'OWN' && !form.toIban) {
    localError.value = 'Select the own account to transfer to.';
    return false;
  }

  if (transferMode.value === 'EXTERNAL') {
    if (!form.externalToIban) {
      localError.value = 'Enter the customer checking IBAN.';
      return false;
    }

    if (!ibanPattern.test(externalIban)) {
      localError.value = 'Enter a valid INHO IBAN.';
      return false;
    }

    if (externalIban === form.fromIban) {
      localError.value = 'Choose a different destination account.';
      return false;
    }
  }

  localError.value = '';
  return true;
};

const submitTransfer = () => {
  if (!validateTransferForm()) {
    return;
  }

  const toIban = transferMode.value === 'OWN' ? form.toIban : form.externalToIban.toUpperCase();

  emit('submit', {
    type: 'TRANSFER',
    fromIban: form.fromIban,
    toIban,
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

.mode-toggle {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.mode-button {
  border: 0;
  border-right: 1px solid var(--color-primary);
  background: var(--color-white);
  color: var(--color-primary-dark);
  cursor: pointer;
  font-family: var(--font-main);
  font-size: 0.95rem;
  font-weight: 700;
  min-height: 44px;
  padding: var(--space-sm) var(--space-md);
}

.mode-button:last-child {
  border-right: 0;
}

.mode-button.active {
  background: var(--color-primary);
  color: var(--color-white);
}

.mode-button:focus-visible {
  outline: 3px solid rgba(25, 118, 210, 0.28);
  outline-offset: -3px;
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
