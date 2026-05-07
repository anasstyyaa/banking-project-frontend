import AppInput from './Input.vue';

export default {
  title: 'Atoms/AppInput',
  component: AppInput,
};

export const Default = {
  args: {
    placeholder: 'Enter IBAN...',
    type: 'text',
  },
};

export const Password = {
  args: {
    placeholder: 'Enter PIN',
    type: 'password',
  },
};

export const Error = {
  args: {
    modelValue: 'Invalid Amount',
    error: true,
  },
};