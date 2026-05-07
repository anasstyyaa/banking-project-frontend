import NavItem from './NavItem.vue';

export default {
  title: 'Molecules/NavItem',
  component: NavItem,
};

export const Inactive = {
  args: {
    icon: 'LayoutDashboard',
    default: 'Dashboard',
    active: false,
  },
};

export const Active = {
  args: {
    icon: 'ArrowRightLeft',
    default: 'Transfers',
    active: true,
  },
};