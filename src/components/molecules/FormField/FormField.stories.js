import FormField from './FormField.vue';

export default {
  title: 'Molecules/FormField',
  component: FormField,
};

export const LoginInput = {
  args: {
    label: 'Email Address',
    placeholder: 'e.g. john@doe.com',
  },
};

export const InvalidInput = {
  args: {
    label: 'Amount',
    modelValue: '-50',
    error: 'Amount cannot be negative',
  },
};