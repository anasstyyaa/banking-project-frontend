<template>
  <div class="form-field">
    <AppText tag="label" size="sm" weight="bold" class="label">
      {{ label }}
    </AppText>
    
    <AppInput 
      :modelValue="modelValue"
      :type="type"
      :placeholder="placeholder"
      :error="!!error"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
    
    <transition name="fade">
      <AppText v-if="error" size="xs" class="error-msg">
        {{ error }}
      </AppText>
    </transition>
  </div>
</template>

<script setup>
import AppText from '@/components/atoms/Text/Text.vue';
import AppInput from '@/components/atoms/Input/Input.vue';

defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String 
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
  width: 100%;
}

.label {
  color: var(--color-primary-dark);
  margin-left: 2px;
}

.error-msg {
  color: var(--color-error);
  margin-top: 2px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>