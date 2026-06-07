<template>
  <component :is="tag" :class="['app-text', size, weight, { muted }]">
    <slot />
  </component>
</template>

<script setup>
defineProps({
  tag: { type: String, default: 'p' },
  size: { type: String, default: 'base' }, // xs, sm, base, lg, xl
  weight: { type: String, default: 'normal' }, // normal, bold
  muted: { type: Boolean, default: false }
})
</script>

<style scoped>
.app-text {
  margin: 0;
  font-family: var(--font-main);
  color: var(--color-primary-dark);
  line-height: 1.5;
}


.xl { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
.lg { font-size: 1.25rem; font-weight: 600; }
.base { font-size: 1rem; }
.sm { font-size: 0.875rem; }
.xs { font-size: 0.75rem; }

.bold { font-weight: 700; }
.muted { color: var(--color-gray-500); }
</style>