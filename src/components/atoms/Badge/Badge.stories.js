import AppBadge from './Badge.vue';

export default {
  title: 'Atoms/AppBadge',
  component: AppBadge,
};

export const Completed = {
  args: {
    type: 'success',
    default: 'Completed',
  },
};

export const Pending = {
  args: {
    type: 'warning',
    default: 'Pending',
  },
};

export const Rejected = {
  args: {
    type: 'error',
    default: 'Rejected',
  },
};