import AuthForm from './AuthForm.vue';
import FormField from '../../molecules/FormField/FormField.vue';

export default {
  title: 'Organisms/AuthForm',
  component: AuthForm,
};

export const Login = {
  render: (args) => ({
    components: { AuthForm, FormField },
    setup() { return { args }; },
    template: `
      <AuthForm v-bind="args">
        <template #fields>
          <FormField label="Email" placeholder="Enter your email" />
          <FormField label="Password" type="password" placeholder="••••••••" />
        </template>
        <template #footer>
          <span style="font-size: 0.875rem">Don't have an account?</span>
          <a href="#" style="color: var(--color-secondary); font-size: 0.875rem; font-weight: bold;">Register</a>
        </template>
      </AuthForm>
    `,
  }),
  args: {
    title: 'Welcome Back',
    subtitle: 'Please enter your details to access your account.',
    buttonText: 'Sign In',
  },
};