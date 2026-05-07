import TransferForm from './TransferForm.vue';

export default {
  title: 'Organisms/TransferForm',
  component: TransferForm,
};

export const Default = {
  args: {
    accounts: [
      {
        iban: 'NL01INHO000000001',
        type: 'CHECKING',
      },
      {
        iban: 'NL01INHO000000002',
        type: 'SAVINGS',
      },
    ],
  },
};
