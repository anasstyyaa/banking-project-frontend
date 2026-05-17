import AtmPanel from './AtmPanel.vue';

export default {
  title: 'Organisms/AtmPanel',
  component: AtmPanel,
};

export const Default = {
  args: {
    accounts: [
      {
        iban: 'NL01INHO000000001',
        type: 'CHECKING',
      },
    ],
  },
};
