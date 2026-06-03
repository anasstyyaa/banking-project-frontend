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
import { ref } from 'vue';
import AppText from '@/components/atoms/Text/Text.vue';
import AppSelect from '@/components/atoms/Select/Select.vue';
import AppButton from '@/components/atoms/Button/Button.vue';

const props = defineProps({
  customerName: { type: String, required: true },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const selectedType = ref('');
const validationError = ref('');

const accountOptions = [
  { value: 'CHECKING', label: 'Payment / Checking Account' },
  { value: 'SAVINGS', label: 'Savings Account' }
];

const handleSubmit = () => {
  if (!selectedType.value) {
    validationError.value = 'You must select an account type before submission.';
    return;
  }
  
  validationError.value = '';
  emit('submit', selectedType.value);
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