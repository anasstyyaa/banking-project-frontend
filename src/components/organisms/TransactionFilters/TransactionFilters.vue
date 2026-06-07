<template>
  <form class="filters" @submit.prevent="applyFilters">
    <SearchInput v-model="localFilters.iban" placeholder="Filter by IBAN" />

    <div class="filter-grid">
      <FormField label="Start date" type="date" v-model="localFilters.startDate" />
      <FormField label="End date" type="date" v-model="localFilters.endDate" />
      <FormField label="Less than" type="number" v-model="localFilters.amountLessThan" placeholder="0.00" />
      <FormField label="Greater than" type="number" v-model="localFilters.amountGreaterThan" placeholder="0.00" />
      <FormField label="Equal to" type="number" v-model="localFilters.amountEqualTo" placeholder="0.00" />
    </div>

    <div class="actions">
      <AppButton type="submit">Apply filters</AppButton>
      <AppButton type="button" variant="secondary" @click="resetFilters">Reset</AppButton>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';
import AppButton from '@/components/atoms/Button/Button.vue';
import FormField from '@/components/molecules/FormField/FormField.vue';
import SearchInput from '@/components/molecules/SearchInput/SearchInput.vue';

const emit = defineEmits(['apply', 'reset']);
const localFilters = reactive({
  iban: '',
  startDate: '',
  endDate: '',
  amountLessThan: '',
  amountGreaterThan: '',
  amountEqualTo: ''
});

const applyFilters = () => {
  emit('apply', { ...localFilters });
};

const resetFilters = () => {
  Object.keys(localFilters).forEach((key) => {
    localFilters[key] = '';
  });
  emit('reset');
};
</script>

<style scoped>
.filters {
  background: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-sm);
}

.actions {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}
</style>
