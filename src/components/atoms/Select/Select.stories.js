import AppSelect from './Select.vue';

export default {
  title: 'Atoms/AppSelect',
  component: AppSelect,
  argTypes: {
    placeholder: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    modelValue: { control: 'text' },
  },
};

const mockOptions = [
  { value: 'CHECKING', label: 'Payment / Checking Account' },
  { value: 'SAVINGS', label: 'Savings Account' }
];

export const DefaultView = {
  args: {
    modelValue: '',
    placeholder: 'Select checking or savings product...',
    options: mockOptions,
    error: false,
    disabled: false
  },
  render: (args) => ({
    components: { AppSelect },
    setup() { return { args }; },
    template: '<div style="max-width: 400px;"><AppSelect v-bind="args" /></div>',
  }),
};

export const PreselectedOption = {
  args: {
    ...DefaultView.args,
    modelValue: 'SAVINGS',
  },
  render: DefaultView.render
};

export const ErrorState = {
  args: {
    ...DefaultView.args,
    error: true,
  },
  render: DefaultView.render
};

export const DisabledState = {
  args: {
    ...DefaultView.args,
    disabled: true,
  },
  render: DefaultView.render
};