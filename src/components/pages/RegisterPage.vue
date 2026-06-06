<template>
  <AuthLayout>
    <template #form>
      <AuthForm 
        title="Open a Bank Account" 
        subtitle="Please fill in your legal details to join InHolland Bank."
        buttonText="Create Account"
        :loading="isLoading"
        @submit="handleRegister"
      >
        <template #fields>
          <div class="form-row">
            <FormField label="First Name" v-model="regData.firstName" placeholder="John" :error="errors.firstName"/>
            <FormField label="Last Name" v-model="regData.lastName" placeholder="Doe" :error="errors.lastName"/>
          </div>

          <FormField 
            label="Email Address" 
            v-model="regData.email" 
            :error="errors.email" 
          />

          <FormField 
            label="Phone Number" 
            v-model="regData.phoneNumber" 
            placeholder="+31 6 12345678" 
            :error="errors.phoneNumber" 
          />

          <FormField label="BSN (Burgerservicenummer)" v-model="regData.bsn" placeholder="123456789" :error="errors.bsn"/>
          <FormField 
            label="Password" 
            type="password" 
            v-model="regData.password" 
            :error="errors.password" 
          />
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
import { useRouter } from 'vue-router';
import api from '@/api/axios'; 
import AuthLayout from '@/components/templates/AuthLayout/AuthLayout.vue';
import AuthForm from '@/components/organisms/AuthForm/AuthForm.vue';
import FormField from '@/components/molecules/FormField/FormField.vue';
import AppText from '@/components/atoms/Text/Text.vue';

const router = useRouter();
const isLoading = ref(false);

const errors = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  bsn: '',
  phoneNumber: ''
});

const regData = reactive({
  email: '',
  password: '',
  bsn: '',
  firstName: '',
  lastName: '',
  phoneNumber: ''
});


const validate = () => {
  let isValid = true;
  
  if (!regData.email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
    isValid = false;
  }
  
  if (regData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
    isValid = false;
  }

  const phoneRegex = /^(^\+|^00)?[0-9\s.-]{9,15}$/;
  
  if (!regData.phoneNumber) {
    errors.phoneNumber = 'Phone number is required.';
    isValid = false;
  } else if (!phoneRegex.test(regData.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number (e.g., 0612345678).';
    isValid = false;
  }

  return isValid;
};
const handleRegister = async () => {
  Object.keys(errors).forEach(key => errors[key] = '');

  if (!validate()) return;
  isLoading.value = true;

  const payload = { 
    ...regData, 
    phoneNumber: regData.phoneNumber.replace(/[\s.-]/g, '') 
  };

  try {
    const response = await api.post('/auth/register', payload);

    const pendingUserData = {
      email: payload.email,
      role: response.data.role || 'ROLE_CUSTOMER'
    };
    localStorage.setItem('user', JSON.stringify(pendingUserData));
    router.push('/pending-approval');

  } catch (err) {
    console.error("Registration submission failed:", err);

    if (err.response?.status === 409) {
      errors.email = "This email is already registered. Please use another or login.";
    } 
    else if (err.response?.data?.message) {
      const globalMessage = err.response.data.message;
      const validationRules = globalMessage.split('; ');

      validationRules.forEach(rule => {
        const colonIndex = rule.indexOf(':');
        if (colonIndex !== -1) {
          const fieldName = rule.substring(0, colonIndex).trim();
          const errorMessage = rule.substring(colonIndex + 1).trim();

          if (Object.hasOwn(errors, fieldName)) {
            errors[fieldName] = errorMessage;
          }
        }
      });

      if (!Object.values(errors).some(msg => msg !== '')) {
        errors.email = globalMessage;
      }
    } 
    else {
      errors.email = "An unexpected error occurred during registration.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.link {
  color: var(--color-secondary);
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
}


@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>