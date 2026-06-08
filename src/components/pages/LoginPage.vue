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
import { ref, reactive, onMounted } from 'vue'; 
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

onMounted(async () => {
  try {
    await api.get('/auth/csrf'); 
    console.log("CSRF cookie initialized successfully");
  } catch (error) {
    console.error("Failed to initialize security session:", error);
  }
});

const handleLogin = async () => {
  errors.email = '';
  errors.password = '';
  
  if (!loginData.email || !loginData.password) {
    if (!loginData.email) errors.email = 'Email address is required.';
    if (!loginData.password) errors.password = 'Password is required.';
    return;
  }
  
  isLoading.value = true;
  
  try {
    const response = await api.post('/auth/login', loginData);

    if (response.data.token) {
      const userData = {
        token: response.data.token,
        email: response.data.email,
        role: response.data.role,
        isApproved: response.data.isApproved
      };
      
      localStorage.setItem('user', JSON.stringify(userData)); 

      try {
        await api.get('/auth/csrf');
      } catch (csrfErr) {
        console.warn("Failed to refresh CSRF token after login:", csrfErr);
      }

      if (userData.role === 'ROLE_EMPLOYEE') {
        router.push('/employee/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  } catch (err) {
    console.error("Full Login Error Context:", err.response); 
    console.log("RAW error data:", JSON.stringify(err.response?.data));
    
    const statusCode = err.response?.status;
    const backendMessage = err.response?.data?.message || err.response?.data?.reason || '';

    
    if (statusCode === 403) {
      errors.email = "Security Block: Check backend CORS or CSRF token setups.";
    } else if (statusCode === 401) {
      errors.email = "Invalid email address or password configuration.";
    } else {
      errors.email = "An unexpected banking system error occurred. Please try again later.";
    }
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