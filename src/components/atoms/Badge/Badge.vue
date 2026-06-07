<template>
  <span :class="['app-badge', type]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  type: { 
    type: String, 
    default: 'success' 
  }
})
</script>

<style scoped>
.app-badge {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: inline-block;
  font-family: var(--font-main);
  line-height: 1;
}

.success { background: rgba(46, 125, 50, 0.1); color: var(--color-success); }
.error { background: rgba(211, 47, 47, 0.1); color: var(--color-error); }
.warning { background: rgba(237, 108, 2, 0.1); color: var(--color-warning); }
.info { background: var(--color-primary); color: var(--color-primary-dark); }
</style>