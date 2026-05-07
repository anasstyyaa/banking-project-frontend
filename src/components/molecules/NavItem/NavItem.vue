<template>
  <button :class="['nav-item', { active }]" @click="$emit('navigate')">
    <AppIcon :name="icon" :size="20" class="nav-icon" />
    <AppText size="sm" weight="bold" class="nav-label">
      <slot />
    </AppText>
  </button>
</template>

<script setup>
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue';
import AppText from '@/components/atoms/Text/Text.vue';

defineProps({
  icon: { type: String, required: true },
  active: { type: Boolean, default: false }
});
defineEmits(['navigate']);
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: none;
  background: transparent;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-gray-500);
}

.nav-item:hover {
  background: var(--color-primary);
  color: var(--color-primary-dark);
}

.active {
  background: var(--color-secondary);
  color: var(--color-white);
}

.active .nav-icon {
  color: var(--color-white);
}

.nav-label {
  color: inherit; 
}
</style>