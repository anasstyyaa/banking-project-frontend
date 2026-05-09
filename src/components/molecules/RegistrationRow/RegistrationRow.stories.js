import RegistrationRow from './RegistrationRow.vue';

export default {
  title: 'Molecules/RegistrationRow',
  component: RegistrationRow,
  argTypes: {
    onApprove: { action: 'approve' },
    onDeny: { action: 'deny' },
  },
};

export const Default = {
  render: (args) => ({
    components: { RegistrationRow },
    setup() { return { args }; },
    template: `
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          <RegistrationRow v-bind="args" />
        </tbody>
      </table>
    `,
  }),
  args: {
    user: {
      id: 101,
      firstName: 'Willem-Alexander',
      lastName: 'van Oranje',
      email: 'king@denhaag.nl',
      bsn: '999888777',
    },
  },
};