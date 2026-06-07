<template>
  <AuthLayout>
    <template #form>
      <div class="pending-card-inner auth-form-padding">
        
        <div class="icon-wrapper">
          <AppIcon name="Clock" size="48" class="clock-icon" />
        </div>

        <div class="badge-spacing">
          <AppBadge type="warning">Awaiting Verification</AppBadge>
        </div>

        <AppText tag="h1" size="xl" weight="bold" class="text-center brand-title-spacing">
          Account Under Review
        </AppText>
        
        <div class="message-body">
          <AppText tag="p" size="base" :muted="true">
            Thank you for registering with Inholland Banking. To maintain strict security compliance, a banking employee must verify your BSN and details manually.
          </AppText>
          <AppText tag="p" size="sm" :muted="true" class="sub-message">
            This process typically takes between 1 to 2 business days. You will receive full access to your IBAN data as soon as your profile is activated.
          </AppText>
        </div>

        <div class="action-layout">
          <!-- <AppButton 
            variant="primary" 
            size="md" 
            :loading="isChecking" 
            @click="checkStatusUpdate"
          >
            Check Application Status
          </AppButton> -->
          
          <AppButton 
            variant="ghost" 
            size="sm" 
            @click="handleSignOut"
          >
            Return to Sign In
          </AppButton>
        </div>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/components/templates/AuthLayout/AuthLayout.vue'; 
import AppText from '@/components/atoms/Text/Text.vue';
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue'; 
import AppButton from '@/components/atoms/Button/Button.vue';
import AppBadge from '@/components/atoms/Badge/Badge.vue';
import api from '@/api/axios';

const router = useRouter();
// const isChecking = ref(false);

// const checkStatusUpdate = async () => {
//   isChecking.value = true;
//   const cachedUser = localStorage.getItem('user');
//   if (!cachedUser) {
//     router.push('/login');
//     return;
//   }
  
//   const { email } = JSON.parse(cachedUser);

//   try {
//     const response = await api.get(`/auth/status?email=${encodeURIComponent(email)}`);
//     if (response.data.approved === true) {
//       localStorage.removeItem('user');
//       router.push('/login');
//     }
//   } catch (err) {
//     localStorage.removeItem('user');
//     router.push('/login');
//   } finally {
//     setTimeout(() => {
//       isChecking.value = false;
//     }, 800);
//   }
// };

const handleSignOut = () => {
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<style scoped>
.auth-form-padding {
  padding: var(--space-xl) var(--space-lg); 
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pending-card-inner {
  text-align: center;
  background: var(--color-white);
  border-radius: var(--border-radius, 8px); 
}

.brand-title-spacing {
  margin-top: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background: rgba(237, 108, 2, 0.1); 
  color: var(--color-warning, #ed6c02);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-md) auto;
}

.clock-icon {
  animation: pulse 2s infinite ease-in-out;
}

.badge-spacing {
  margin-bottom: var(--space-md);
}

.text-center {
  text-align: center;
}

.message-body {
  margin: var(--space-md) 0 var(--space-xl) 0; 
  flex-direction: column;
  gap: var(--space-sm, 0.75rem);
}

.sub-message {
  border-top: 1px solid var(--color-gray-100);
  padding-top: var(--space-md);
}

.action-layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm, 0.75rem); 
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}


@media (max-width: 480px) {
  .auth-form-padding {
    padding: var(--space-lg) var(--space-md);
  }
}
</style>