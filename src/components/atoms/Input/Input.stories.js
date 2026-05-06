import AppInput from './Input.vue';

export default {
  title: 'Atoms/AppInput',
  component: AppInput,
};

export const Text = { args: { placeholder: 'Enter IBAN...' } };
export const Password = { args: { type: 'password', placeholder: '••••••••' } };
export const ErrorState = { args: { error: true, modelValue: 'Invalid Amount' } };