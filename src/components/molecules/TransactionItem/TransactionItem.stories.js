import TransactionItem from './TransactionItem.vue';

export default {
  title: 'Molecules/TransactionItem',
  component: TransactionItem,
};

export const Expense = {
  args: {
    title: 'Starbucks Coffee',
    date: 'Today, 10:45 AM',
    amount: -5.50,
    category: 'Food',
  },
};

export const Income = {
  args: {
    title: 'Monthly Salary',
    date: 'Oct 25, 2023',
    amount: 3200.00,
    category: 'Salary',
  },
};

export const Shopping = {
  args: {
    title: 'Amazon.com',
    date: 'Yesterday',
    amount: -89.99,
    category: 'Shopping',
  },
};