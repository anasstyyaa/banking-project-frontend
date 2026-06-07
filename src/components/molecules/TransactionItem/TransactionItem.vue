<template>
  <div class="transaction-item">
    <div class="icon-container" :class="transactionType">
      <AppIcon :name="iconName" :size="20" />
    </div>
    
    <div class="details">
      <AppText weight="bold" size="base">{{ title }}</AppText>
      <AppText size="xs" muted>{{ date }}</AppText>
    </div>
    
    <div class="amount">
      <CurrencyLabel :value="amount" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import CurrencyLabel from '@/components/atoms/CurrencyLabel/CurrencyLabel.vue';

const props = defineProps({
  title: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Shopping' } 
})

const transactionType = computed(() => props.amount >= 0 ? 'income' : 'expense');

const iconName = computed(() => {
  if (props.amount >= 0) return 'ArrowDownLeft';
  const icons = {
    'Shopping': 'ShoppingBag',
    'Food': 'Utensils',
    'Salary': 'Banknote',
    'Transport': 'Car'
  };
  return icons[props.category] || 'CreditCard';
});
</script>

<style scoped>
.transaction-item {
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-white);
  border-radius: var(--border-radius);
  transition: background 0.2s;
  cursor: pointer;
}

.transaction-item:hover {
  background: var(--color-gray-100);
}

.icon-container {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-md);
}

.income { background: rgba(46, 125, 50, 0.1); color: var(--color-success); }
.expense { background: var(--color-gray-100); color: var(--color-primary-dark); }

.details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.amount {
  text-align: right;
}
</style>