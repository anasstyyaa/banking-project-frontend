import CurrencyLabel from './CurrencyLabel.vue';

export default {
  title: 'Atoms/CurrencyLabel',
  component: CurrencyLabel,
};

export const Positive = {
  args: {
    value: 1250.50,
  },
};

export const Negative = {
  args: {
    value: -45.00,
  },
};

export const LargeBalance = {
  args: {
    value: 1000000,
  },
};