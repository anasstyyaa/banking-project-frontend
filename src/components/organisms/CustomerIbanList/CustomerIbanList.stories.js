import CustomerIbanList from './CustomerIbanList.vue';

export default {
  title: 'Organisms/CustomerIbanList',
  component: CustomerIbanList,
  argTypes: {
    onCopy: { action: 'copied' },
  },
};

const Template = (args) => ({
  components: { CustomerIbanList },
  setup() { return { args }; },
  template: '<CustomerIbanList v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  accounts: [
    { iban: 'NL01INHO000000001', type: 'CHECKING', customerName: 'Testy McTestFace' },
    { iban: 'NL01INHO000000002', type: 'SAVINGS', customerName: 'Testy McTestFace' },
    { iban: 'NL01INHO000000003', type: 'CHECKING', customerName: 'Jane Customer' },
  ],
  copiedIban: '',
};

export const Copied = Template.bind({});
Copied.args = {
  accounts: [
    { iban: 'NL01INHO000000001', type: 'CHECKING', customerName: 'Testy McTestFace' },
  ],
  copiedIban: 'NL01INHO000000001',
};

export const Empty = Template.bind({});
Empty.args = {
  accounts: [],
  copiedIban: '',
};