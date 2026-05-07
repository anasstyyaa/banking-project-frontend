import TransactionList from './TransactionList.vue';

export default {
  title: 'Organisms/TransactionList',
  component: TransactionList,
};

export const Default = {
  args: {
    accountIbans: ['NL01INHO000000001'],
    transactions: [
      {
        id: 1,
        type: 'TRANSFER',
        fromIban: 'NL01INHO000000001',
        toIban: 'NL01INHO000000003',
        amount: 75,
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        type: 'DEPOSIT',
        fromIban: null,
        toIban: 'NL01INHO000000001',
        amount: 250,
        timestamp: new Date().toISOString(),
      },
    ],
  },
};
