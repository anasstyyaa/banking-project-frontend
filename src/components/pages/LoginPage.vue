<template>
  <AuthLayout>
    <template #form>
      <AuthForm 
        title="Welcome Back" 
        subtitle="Securely log in to your bank account"
        buttonText="Sign In"
        :loading="isLoading"
        @submit="handleLogin"
      >
        <template #fields>
          <FormField 
            label="Email Address" 
            v-model="loginData.email"
            placeholder="example@mail.com"
            :error="errors.email"
          />
          <FormField 
            label="Password" 
            type="password" 
            v-model="loginData.password"
            placeholder="••••••••"
            :error="errors.password"
          />
        </template>
        
        <template #footer>
          <AppText size="sm">New user?</AppText>
          <router-link to="/register" class="link">Create an account</router-link>
        </template>
      </AuthForm>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/templates/AuthLayout/AuthLayout.vue';
import AuthForm from '@/components/organisms/AuthForm/AuthForm.vue';
import FormField from '@/components/molecules/FormField/FormField.vue';
import AppText from '@/components/atoms/Text/Text.vue';

import api from '@/api/axios'; 

const router = useRouter();
const isLoading = ref(false);

const loginData = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  errors.email = '';
  errors.password = '';
  
  isLoading.value = true;
  try {
    const response = await api.post('/auth/login', loginData);

    if (response.data.token) {
      
      const userData = {
        token: response.data.token,
        email: response.data.email,
        role: response.data.role
      };
      
      localStorage.setItem('user', JSON.stringify(userData)); 

      if (userData.role === 'ROLE_EMPLOYEE') {
        router.push('/employee/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  } catch (err) {
    errors.email = err.response?.data?.message || "Invalid credentials.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.link {
  color: var(--color-secondary);
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>