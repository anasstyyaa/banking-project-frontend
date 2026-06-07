<template>
  <div class="search-input-wrapper">
    <div class="search-icon">
      <AppIcon name="Search" :size="18" />
    </div>
    <AppInput
      :modelValue="modelValue"
      :placeholder="placeholder"
      class="search-field"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import AppInput from '@/components/atoms/Input/Input.vue';
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue';

defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Search transactions...' }
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.search-input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--space-md);
  color: var(--color-gray-500);
  pointer-events: none;
  z-index: 1;
}


:deep(.app-input) {
  padding-left: 44px;
  background: var(--color-gray-100);
  border-color: transparent;
}

:deep(.app-input:focus) {
  background: var(--color-white);
  border-color: var(--color-secondary);
}
</style>