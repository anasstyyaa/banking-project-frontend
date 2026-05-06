<template>
  <span :class="['app-badge', type]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'info' } // success, error, warning, info
})
</script>

<style scoped>
.app-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}
.success { background: #e8f5e9; color: var(--color-success); }
.error { background: #ffebee; color: var(--color-error); }
.warning { background: #fff3e0; color: var(--color-warning); }
</style>