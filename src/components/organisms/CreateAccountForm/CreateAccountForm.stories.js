import CreateAccountForm from './CreateAccountForm.vue';

export default {
  title: 'Molecules/CreateAccountForm',
  component: CreateAccountForm,
  argTypes: {
    customerName: { control: 'text' },
    loading: { control: 'boolean' },
    onSubmit: { action: 'submit' },
    onCancel: { action: 'cancel' }
  },
};

export const DefaultView = {
  args: {
    customerName: 'Hendrik van der Meer',
    loading: false
  }
};

export const ProcessingSubmission = {
  args: {
    customerName: 'Hendrik van der Meer',
    loading: true
  }
};