import RegistrationTable from './RegistrationTable.vue';

export default {
  title: 'Organisms/RegistrationTable',
  component: RegistrationTable,
  argTypes: {
    onApprove: { action: 'approved' },
    onDeny: { action: 'denied' },
  },
};

const Template = (args) => ({
  components: { RegistrationTable },
  setup() { return { args }; },
  template: '<RegistrationTable v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  users: [
    { id: 1, firstName: 'Spongebob', lastName: 'Squarepants', email: 'sponge@bikini.bottom', bsn: '123456789' },
    { id: 2, firstName: 'Patrick', lastName: 'Star', email: 'rock@bikini.bottom', bsn: '987654321' },
    { id: 3, firstName: 'Squidward', lastName: 'Tentacles', email: 'clarinet@bikini.bottom', bsn: '555666777' },
  ],
};

export const Empty = Template.bind({});
Empty.args = {
  users: [],
};