import AuthLayout from './AuthLayout.vue';
import AuthForm from '../../organisms/AuthForm/AuthForm.vue';
import FormField from '../../molecules/FormField/FormField.vue';

export default {
  title: 'Templates/AuthLayout',
  component: AuthLayout,
};

export const LoginPage = {
  render: () => ({
    components: { AuthLayout, AuthForm, FormField },
    template: `
      <AuthLayout>
        <template #form>
          <AuthForm 
            title="Sign In" 
            subtitle="Enter your credentials to access your dashboard"
            buttonText="Log In"
          >
            <template #fields>
              <FormField label="Email" placeholder="name@company.com" />
              <FormField label="Password" type="password" placeholder="••••••••" />
            </template>
            <template #footer>
              <span style="font-size: 14px">New to our bank?</span>
              <a href="#" style="color: var(--color-secondary); font-weight: bold; font-size: 14px">Create account</a>
            </template>
          </AuthForm>
        </template>
      </AuthLayout>
    `,
  }),
};

export const RegisterPage = {
  render: () => ({
    components: { AuthLayout, AuthForm, FormField },
    template: `
      <AuthLayout>
        <template #form>
          <AuthForm 
            title="Create Account" 
            subtitle="Start your journey with us today"
            buttonText="Register"
          >
            <template #fields>
              <FormField label="Full Name" placeholder="John Doe" />
              <FormField label="Email" placeholder="name@company.com" />
              <FormField label="Password" type="password" placeholder="••••••••" />
              <FormField label="Confirm Password" type="password" placeholder="••••••••" />
            </template>
            <template #footer>
              <span style="font-size: 14px">Already have an account?</span>
              <a href="#" style="color: var(--color-secondary); font-weight: bold; font-size: 14px">Sign in</a>
            </template>
          </AuthForm>
        </template>
      </AuthLayout>
    `,
  }),
};