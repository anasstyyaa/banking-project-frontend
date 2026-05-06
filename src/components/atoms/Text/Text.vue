<template>
  <component :is="tag" :class="['app-text', size, weight]">
    <slot />
  </component>
</template>

<script setup>
defineProps({
  tag: { type: String, default: 'p' },
  size: { type: String, default: 'base' }, // xs, sm, base, lg, xl
  weight: { type: String, default: 'normal' }
})
</script>

<style scoped>
.app-text { margin: 0; color: var(--color-black); line-height: 1.5; }
.xl { font-size: 1.5rem; font-weight: 700; }
.sm { font-size: 0.875rem; color: var(--color-gray-500); }
.bold { font-weight: 700; }
</style>