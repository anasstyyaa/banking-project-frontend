<template>
  <div class="input-container">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="['app-input', { 'has-error': error }]"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-container {
  width: 100%;
}

.app-input {
  width: 100%;
  padding: var(--space-md);
  background: var(--color-white);
  border: 1px solid var(--color-primary); 
  border-radius: var(--border-radius);
  font-family: var(--font-main);
  font-size: 1rem;
  color: var(--color-primary-dark);
  transition: all 0.2s ease;
  outline: none;
}

.app-input:focus {
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(105, 105, 179, 0.15);
}

.app-input:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
  opacity: 0.7;
}

.has-error {
  border-color: var(--color-error);
}

.has-error:focus {
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.15);
}
</style>