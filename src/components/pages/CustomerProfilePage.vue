<template>
  <BankingLayout>
    <div class="page">
      <header class="page-header">
        <div>
          <AppText tag="h1" size="xl" weight="bold">Customer profile</AppText>
          <AppText size="sm" muted>Personal information and account totals</AppText>
        </div>
        <AppText v-if="message" size="sm" class="success">{{ message }}</AppText>
      </header>

      <AppText v-if="error" size="sm" class="error">{{ error }}</AppText>

      <section v-if="profile" class="profile-grid">
        <article class="panel">
          <AppText tag="h2" size="lg" weight="bold">Customer information</AppText>

          <dl class="details">
            <div>
              <dt>First name</dt>
              <dd>{{ profile.firstName }}</dd>
            </div>
            <div>
              <dt>Last name</dt>
              <dd>{{ profile.lastName }}</dd>
            </div>
            <div>
              <dt>Main IBAN</dt>
              <dd>{{ profile.iban }}</dd>
            </div>
          </dl>

          <form class="form" @submit.prevent="saveProfile">
            <FormField
              label="Email"
              type="email"
              v-model="form.email"
              placeholder="customer@email.com"
              :error="formErrors.email"
            />
            <FormField
              label="Phone number"
              v-model="form.phoneNumber"
              placeholder="+31612345678"
              :error="formErrors.phoneNumber"
            />
            <AppButton :loading="saving">Save changes</AppButton>
          </form>
        </article>

        <article class="panel totals-panel">
          <AppText tag="h2" size="lg" weight="bold">Combined total</AppText>
          <AppText size="xl" weight="bold">EUR {{ formatMoney(profile.totalBalance) }}</AppText>
          <AppText size="sm" muted>{{ profile.accounts.length }} accounts included</AppText>
        </article>
      </section>

      <section v-if="profile" class="panel">
        <div class="section-heading">
          <AppText tag="h2" size="lg" weight="bold">Account details</AppText>
          <AppText size="sm" muted>IBAN numbers and individual totals</AppText>
        </div>

        <div class="accounts">
          <div v-for="account in profile.accounts" :key="account.id" class="account-row">
            <div>
              <AppText weight="bold">{{ account.type }}</AppText>
              <AppText size="sm" muted>{{ account.iban }}</AppText>
            </div>
            <AppText weight="bold">EUR {{ formatMoney(account.balance) }}</AppText>
          </div>
        </div>
      </section>
    </div>
  </BankingLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import BankingLayout from '@/components/templates/BankingLayout/BankingLayout.vue';
import AppButton from '@/components/atoms/Button/Button.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import FormField from '@/components/molecules/FormField/FormField.vue';
import UserService from '@/services/user.service';

const profile = ref(null);
const error = ref('');
const message = ref('');
const saving = ref(false);

const form = reactive({
  email: '',
  phoneNumber: ''
});

const formErrors = reactive({
  email: '',
  phoneNumber: ''
});

onMounted(loadProfile);

// Loads the authenticated customer's own profile and maps editable fields into the form.
async function loadProfile() {
  error.value = '';
  try {
    const response = await UserService.getProfile();
    setProfile(response.data);
  } catch (err) {
    error.value = getErrorMessage(err, 'Customer profile could not be loaded.');
  }
}

// Sends only the fields customers may change: email and phone number.
async function saveProfile() {
  if (!isValid()) return;

  saving.value = true;
  error.value = '';
  message.value = '';

  try {
    const response = await UserService.updateProfile({
      email: form.email,
      phoneNumber: form.phoneNumber
    });
    setProfile(response.data);
    syncStoredEmail(response.data.email);
    message.value = 'Profile updated successfully.';
  } catch (err) {
    error.value = getErrorMessage(err, 'Profile could not be updated.');
  } finally {
    saving.value = false;
  }
}

// Keeps the API response and editable form state in sync.
function setProfile(data) {
  profile.value = data;
  form.email = data.email || '';
  form.phoneNumber = data.phoneNumber || '';
}

function isValid() {
  formErrors.email = '';
  formErrors.phoneNumber = '';

  if (!form.email) formErrors.email = 'Email is required.';
  if (!form.phoneNumber) formErrors.phoneNumber = 'Phone number is required.';

  return !formErrors.email && !formErrors.phoneNumber;
}

function syncStoredEmail(email) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  localStorage.setItem('user', JSON.stringify({ ...user, email }));
}

function formatMoney(amount) {
  return Number(amount || 0).toFixed(2);
}

function getErrorMessage(err, fallback) {
  return err.response?.data?.message || err.response?.data?.reason || fallback;
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.page-header,
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-md);
}

.profile-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.7fr);
  gap: var(--space-lg);
}

.panel {
  background: var(--color-white);
  border: 1px solid var(--color-gray-100);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
}

.details,
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.details div,
.account-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

dt {
  color: var(--color-gray-500);
  font-weight: 700;
}

dd {
  margin: 0;
  color: var(--color-primary-dark);
}

.totals-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.accounts {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

.account-row {
  border: 1px solid var(--color-gray-100);
  border-radius: var(--border-radius);
  padding: var(--space-md);
}

.error {
  color: var(--color-error);
  background: rgba(211, 47, 47, 0.08);
  padding: var(--space-sm);
  border-radius: var(--border-radius);
}

.success {
  color: var(--color-secondary);
  font-weight: 700;
}

@media (max-width: 820px) {
  .profile-grid,
  .page-header,
  .section-heading {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
