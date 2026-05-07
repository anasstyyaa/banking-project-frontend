import AccountBalance from './AccountBalance.vue';

export default {
  title: 'Molecules/AccountBalance',
  component: AccountBalance,
};

export const PrimaryAccount = {
  args: {
    accountName: 'Personal Account',
    accountType: 'Active',
    balance: 12450.65,
    accountNumber: 'NL12INGB0001234567',
  },
};

export const SavingsAccount = {
  args: {
    accountName: 'Emergency Fund',
    accountType: 'Savings',
    balance: 45000.00,
    accountNumber: 'NL99INGB0007654321',
  },
};

export const DebtAccount = {
  args: {
    accountName: 'Credit Card',
    accountType: 'Visa',
    balance: -1250.00,
    accountNumber: '4111222233334444',
  },
};