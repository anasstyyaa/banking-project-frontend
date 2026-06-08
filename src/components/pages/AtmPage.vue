<template>
  <div class="atm-page">
    <section class="atm-shell">
      <header class="page-header">
        <div>
          <AppText tag="h1" size="xl" weight="bold">ATM</AppText>
          <AppText size="sm" muted>Log in with your customer credentials to deposit or withdraw money</AppText>
        </div>

        <AppButton v-if="atmSession" variant="ghost" size="sm" @click="exitAtm">
          Exit ATM
        </AppButton>
      </header>

      <form v-if="!atmSession" class="atm-login" @submit.prevent="loginToAtm">
        <AppText tag="h2" size="lg" weight="bold">ATM login</AppText>
        <FormField
          label="Email address"
          v-model="loginForm.email"
          placeholder="customer@mail.com"
          :error="loginErrors.email"
        />
        <FormField
          label="Password"
          type="password"
          v-model="loginForm.password"
          placeholder="Password"
          :error="loginErrors.password"
        />
        <AppText v-if="error" size="sm" class="message error">{{ error }}</AppText>
        <AppButton type="submit" :loading="loading">
          Log in to ATM
        </AppButton>
      </form>

      <AtmPanel
        v-else
        :accounts="accounts"
        :loading="loading"
        :error="error"
        :success="success"
        :customer-email="atmSession.email"
        @submit="submitAtmTransaction"
      />
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import AtmService from '@/services/atm.service';
import AtmPanel from '@/components/organisms/AtmPanel/AtmPanel.vue';
import AppButton from '@/components/atoms/Button/Button.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import FormField from '@/components/molecules/FormField/FormField.vue';

const accounts = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');
const atmSession = ref(AtmService.getSession());
const loginForm = reactive({ email: '', password: '' });
const loginErrors = reactive({ email: '', password: '' });

const loginToAtm = async () => {
  loginErrors.email = '';
  loginErrors.password = '';
  error.value = '';
  success.value = '';

  if (!loginForm.email) {
    loginErrors.email = 'Email address is required.';
  }
  if (!loginForm.password) {
    loginErrors.password = 'Password is required.';
  }
  if (loginErrors.email || loginErrors.password) return;

  loading.value = true;
  try {
    atmSession.value = await AtmService.login(loginForm);
    await loadAccounts();
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'ATM login failed.';
  } finally {
    loading.value = false;
  }
};

const loadAccounts = async () => {
  try {
    const response = await AtmService.getAccounts();
    accounts.value = response.data.content ?? response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Accounts could not be loaded.';
  }
};

const submitAtmTransaction = async (payload) => {
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    await AtmService.createTransaction(payload);
    success.value = payload.type === 'DEPOSIT' ? 'Deposit completed.' : 'Withdrawal completed.';
    await loadAccounts();
  } catch (err) {
    error.value = err.response?.data?.message || 'ATM transaction could not be completed.';
  } finally {
    loading.value = false;
  }
};

const exitAtm = () => {
  AtmService.logout();
  atmSession.value = null;
  accounts.value = [];
  success.value = '';
  error.value = '';
  loginForm.password = '';
};

onMounted(() => {
  if (atmSession.value) {
    loadAccounts();
  }
});
</script>

<style scoped>
.atm-page {
  min-height: 100vh;
  background: var(--color-gray-100);
  padding: var(--space-xl);
}

.atm-shell {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  max-width: 760px;
  margin: 0 auto;
}

.page-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: var(--space-xs);
}

.atm-login {
  background: var(--color-white);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 520px;
}

.message {
  padding: var(--space-sm);
  border-radius: var(--border-radius);
}

.error {
  color: var(--color-error);
  background: rgba(211, 47, 47, 0.08);
}

@media (max-width: 640px) {
  .atm-page {
    padding: var(--space-lg);
  }

  .page-header {
    grid-template-columns: 1fr;
  }
}
</style>
