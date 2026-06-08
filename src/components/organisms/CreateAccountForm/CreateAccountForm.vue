<template>
  <form @submit.prevent="handleSubmit" class="account-form">
    <div class="form-header">
      <AppText tag="h3" size="lg" weight="bold">
        Provision New Bank Account
      </AppText>
      <AppText size="sm" muted>
        Assigning an additional balance portfolio line item for <b>{{ customerName }}</b>.
      </AppText>
    </div>

    <div class="form-body">
      <div class="field-group">
        <AppText tag="label" size="sm" weight="bold" class="form-label">
          Account Product Type
        </AppText>
        
        <AppSelect
          v-model="selectedType"
          :options="accountOptions"
          placeholder="Select checking or savings product..."
          :error="!!validationError"
        />
        
        <transition name="fade">
          <AppText v-if="validationError" size="xs" class="error-text">
            {{ validationError }}
          </AppText>
        </transition>
      </div>

      <FormField
        label="Absolute limit"
        type="number"
        v-model="form.absoluteLimit"
        placeholder="-500.00"
      />

      <FormField
        label="Daily transaction limit"
        type="number"
        v-model="form.dailyLimit"
        placeholder="1000.00"
      />
    </div>

    <div class="form-actions">
      <AppButton 
        type="button" 
        variant="ghost" 
        size="sm" 
        :disabled="loading"
        @click="$emit('cancel')"
      >
        Cancel
      </AppButton>
      
      <AppButton 
        type="submit" 
        variant="primary" 
        size="sm" 
        :loading="loading"
      >
        Create Account
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import AppText from '@/components/atoms/Text/Text.vue';
import AppSelect from '@/components/atoms/Select/Select.vue';
import AppButton from '@/components/atoms/Button/Button.vue';
import FormField from '@/components/molecules/FormField/FormField.vue';

const props = defineProps({
  customerName: { type: String, required: true },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const selectedType = ref('');
const validationError = ref('');
const form = reactive({
  absoluteLimit: '-500.00',
  dailyLimit: '1000.00'
});

const accountOptions = [
  { value: 'CHECKING', label: 'Payment / Checking Account' },
  { value: 'SAVINGS', label: 'Savings Account' }
];

const handleSubmit = () => {
  if (!selectedType.value) {
    validationError.value = 'You must select an account type before submission.';
    return;
  }

  if (form.absoluteLimit === '' || form.dailyLimit === '' || Number(form.dailyLimit) <= 0) {
    validationError.value = 'Enter a daily limit above zero and a valid absolute limit.';
    return;
  }
  
  validationError.value = '';
  emit('submit', {
    accountType: selectedType.value,
    absoluteLimit: Number(form.absoluteLimit),
    dailyLimit: Number(form.dailyLimit)
  });
};
</script>

<style scoped>
.account-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding: var(--space-lg);
  background: var(--color-white);
}

.form-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-label {
  color: var(--color-primary-dark);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.error-text {
  color: var(--color-error);
  margin-top: 2px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
