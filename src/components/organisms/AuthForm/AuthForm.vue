<template>
  <form @submit.prevent="$emit('submit')" class="auth-form">
    <AppText tag="h2" size="lg" weight="bold" class="form-title">
      {{ title }}
    </AppText>
    
    <AppText size="sm" muted class="form-subtitle">
      {{ subtitle }}
    </AppText>

    <div class="fields-container">
      <slot name="fields" />
    </div>

    <AppButton 
      type="submit" 
      variant="primary" 
      size="md" 
      class="submit-btn"
      :loading="loading"
    >
      {{ buttonText }}
    </AppButton>

    <div class="footer-links">
      <slot name="footer" />
    </div>
  </form>
</template>

<script setup>
import AppText from '@/components/atoms/Text/Text.vue';
import AppButton from '@/components/atoms/Button/Button.vue';

defineProps({
  title: String,
  subtitle: String,
  buttonText: String,
  loading: Boolean
});
defineEmits(['submit']);
</script>

<style scoped>
.auth-form {
  width: 100%;
  max-width: 400px;
  padding: var(--space-xl);
  background: var(--color-white);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.form-title { margin-bottom: var(--space-xs); }
.form-subtitle { margin-bottom: var(--space-xl); }

.fields-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.submit-btn { width: 100%; }

.footer-links {
  margin-top: var(--space-lg);
  text-align: center;
  display: flex;
  justify-content: center;
  gap: var(--space-xs);
}
</style>