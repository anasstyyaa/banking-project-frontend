<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :class="['app-input', { error }]"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  error: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-input {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-gray-500);
  border-radius: var(--border-radius);
  font-family: var(--font-main);
  font-size: 1rem;
  outline: none;
}
.app-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(0, 70, 145, 0.1); }
.error { border-color: var(--color-error); }
</style>