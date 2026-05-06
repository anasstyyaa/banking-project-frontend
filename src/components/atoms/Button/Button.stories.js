import AppButton from './Button.vue';

export default {
  title: 'Atoms/AppButton',
  component: AppButton,
};

export const Primary = { args: { variant: 'primary', default: 'Send Money' } };
export const Danger = { args: { variant: 'danger', default: 'Delete Account' } };
export const Loading = { args: { loading: true } };