<template>
  <button :class="['button', variant, size]" :disabled="disabled || loading" @click="$emit('click')">
    <span v-if="loading" class="spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}


withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
});
</script>

<style scoped>
.button {
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

.primary { 
  background: var(--color-primary); 
  color: var(--color-primary-dark); 
}
.primary:hover { 
  background: var(--color-secondary); 
  color: var(--color-white); 
}
.danger { background: var(--color-error); color: var(--color-white); }
.secondary { 
  background: transparent; 
  color: var(--color-primary-dark); 
  border: 2px solid var(--color-primary); 
}
.secondary:hover { 
  background: var(--color-primary); 
  color: var(--color-white); 
}
.ghost {
  background: transparent;
  color: var(--color-primary-dark);
}
.ghost:hover {
  background: var(--color-primary);
}

.md { padding: var(--space-sm) var(--space-lg); font-size: 1rem; }
.sm { padding: var(--space-xs) var(--space-md); font-size: 0.875rem; }

.button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
