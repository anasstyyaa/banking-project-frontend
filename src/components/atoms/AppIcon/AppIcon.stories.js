import AppIcon from './AppIcon.vue';

export default {
  title: 'Atoms/AppIcon',
  component: AppIcon,
  argTypes: {
    name: { 
      control: 'select', 
      options: ['Wallet', 'ArrowUpRight', 'ArrowDownLeft', 'CreditCard', 'User', 'LogOut', 'Settings'] 
    },
    size: { control: { type: 'range', min: 16, max: 64, step: 4 } },
  },
};

export const Default = {
  args: {
    name: 'Wallet',
    size: 24,
  },
};

export const TransactionIn = {
  args: {
    name: 'ArrowDownLeft',
    size: 24,
  },
  render: (args) => ({
    components: { AppIcon },
    setup() { return { args }; },
    template: '<div style="color: var(--color-success)"><AppIcon v-bind="args" /></div>',
  }),
};