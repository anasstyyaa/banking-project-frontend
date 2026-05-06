<template>
  <button 
    :class="['app-button', variant, size]" 
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, 
  size: { type: String, default: 'md' },        
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-main);
  font-weight: 600;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}
.primary { background: var(--color-primary); color: white; }
.primary:hover { background: var(--color-primary-dark); }
.danger { background: var(--color-error); color: white; }
.secondary { background: var(--color-gray-100); color: var(--color-black); border: 1px solid var(--color-gray-500); }

.md { padding: 12px 24px; font-size: 1rem; }
.sm { padding: 8px 16px; font-size: 0.875rem; }

.app-button:disabled { opacity: 0.6; cursor: not-allowed; }
</style>