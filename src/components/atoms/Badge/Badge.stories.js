import AppBadge from './Badge.vue';

export default {
  title: 'Atoms/AppBadge',
  component: AppBadge,
};

export const Success = { args: { type: 'success', default: 'Completed' } };
export const Warning = { args: { type: 'warning', default: 'Pending' } };