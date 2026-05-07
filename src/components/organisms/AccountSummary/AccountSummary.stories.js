import AccountSummary from './AccountSummary.vue';

export default {
  title: 'Organisms/AccountSummary',
  component: AccountSummary,
};

export const Default = {
  args: {
    accounts: [
      {
        iban: 'NL01INHO000000001',
        type: 'CHECKING',
        balance: 1250,
        isActive: true,
      },
      {
        iban: 'NL01INHO000000002',
        type: 'SAVINGS',
        balance: 2500,
        isActive: true,
      },
    ],
  },
};
