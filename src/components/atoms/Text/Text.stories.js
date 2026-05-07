import AppText from './Text.vue';

export default {
  title: 'Atoms/AppText',
  component: AppText,
};

export const Heading = {
  args: {
    tag: 'h1',
    size: 'xl',
    weight: 'bold',
    default: 'Main Dashboard',
  },
};

export const Subtext = {
  args: {
    size: 'sm',
    default: 'Transaction ID: #12345678',
  },
};