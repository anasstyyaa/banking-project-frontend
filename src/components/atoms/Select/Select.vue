<template>
  <div class="select-container">
    <select
      :value="modelValue"
      :class="['app-select', { 'has-error': error }]"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="" disabled selected hidden>
        {{ placeholder }}
      </option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  options: {
    type: Array,
    required: true 
  },
  placeholder: { type: String, default: '' },
  error: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.select-container {
  width: 100%;
}

.app-select {
  width: 100%;
  padding: var(--space-md);
  background: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  font-family: var(--font-main);
  font-size: 1rem;
  color: var(--color-primary-dark);
  appearance: none; 
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right var(--space-md) center;
  background-size: 16px;
  transition: all 0.2s ease;
  outline: none;
}

.app-select:focus {
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(105, 105, 179, 0.15);
}

.app-select:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
  opacity: 0.7;
}

.has-error {
  border-color: var(--color-error);
}
</style>