<template>
  <AuthLayout>
    <template #form>
      <AuthForm 
        title="Open Account" 
        subtitle="Join our bank in less than 2 minutes"
        buttonText="Register Now"
        :loading="isLoading"
        @submit="handleRegister"
      >
        <template #fields>
          <FormField label="Full Name" v-model="regData.name" placeholder="John Doe" />
          <FormField label="Email" v-model="regData.email" placeholder="john@example.com" />
          <FormField label="Password" type="password" v-model="regData.password" placeholder="••••••••" />
        </template>
        
        <template #footer>
          <AppText size="sm">Already have an account?</AppText>
          <router-link to="/login" class="link">Login here</router-link>
        </template>
      </AuthForm>
    </template>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from 'vue';
import AuthLayout from '@/components/templates/AuthLayout/AuthLayout.vue';
import AuthForm from '@/components/organisms/AuthForm/AuthForm.vue';
import FormField from '@/components/molecules/FormField/FormField.vue';
import AppText from '@/components/atoms/Text/Text.vue';

const isLoading = ref(false);
const regData = reactive({ name: '', email: '', password: '' });

const handleRegister = () => {
  isLoading.value = true;
  // Your Registration Logic
  setTimeout(() => isLoading.value = false, 2000);
};
</script>