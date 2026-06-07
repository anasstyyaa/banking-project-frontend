<template>
  <span :class="['currency', colorClass]">
    {{ formattedValue }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  value: { type: Number, required: true },
  currency: { type: String, default: 'EUR' }
});

const formattedValue = computed(() => {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: props.currency }).format(props.value);
});

const colorClass = computed(() => (props.value >= 0 ? 'positive' : 'negative'));
</script>

<style scoped>
.currency { font-weight: 700; font-family: var(--font-main); }
.positive { color: var(--color-success); }
.negative { color: var(--color-error); }
</style>