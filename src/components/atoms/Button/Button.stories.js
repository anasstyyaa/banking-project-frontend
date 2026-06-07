import AppButton from './Button.vue';

export default {
  title: 'Atoms/AppButton',
  component: AppButton,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    onClick: { action: 'clicked' }
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    default: 'Transfer Funds',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    default: 'Cancel',
  },
};

export const Loading = {
  args: {
    variant: 'primary',
    loading: true,
  },
};