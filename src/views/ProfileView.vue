<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getApiErrorMessage } from '@/composables/useApiError'
import { getAtmAccounts } from '@/services/atmService'
import { getProfile, updatePhoneNumber } from '@/services/userService'

const router = useRouter()
const profile = ref(null)
const phoneNumber = ref('')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const message = ref('')
const accounts = ref([])

onMounted(loadProfile)

async function loadProfile() {
  loading.value = true
  error.value = ''
  try {
    profile.value = await getProfile()
    accounts.value = profile.value.accounts || await getAtmAccounts()
    phoneNumber.value = profile.value.phoneNumber || ''
  } catch (err) {
    error.value = getApiErrorMessage(err)
  } finally {
    loading.value = false
  }
}

async function savePhoneNumber() {
  saving.value = true
  error.value = ''
  message.value = ''
  try {
    profile.value = await updatePhoneNumber(phoneNumber.value)
    accounts.value = profile.value.accounts || accounts.value
    phoneNumber.value = profile.value.phoneNumber || ''
    message.value = 'Phone number updated'
  } catch (err) {
    error.value = getApiErrorMessage(err)
  } finally {
    saving.value = false
  }
}

function formatMoney(amount) {
  return Number(amount ?? 0).toFixed(2)
}

function totalBalance() {
  if (profile.value?.totalBalance !== undefined && profile.value?.totalBalance !== null) {
    return profile.value.totalBalance
  }

  return accounts.value.reduce((total, account) => total + Number(account.balance || 0), 0)
}
</script>

<template>
  <main class="page narrow-page">
    <header class="page-header">
      <div>
        <p class="label">Profile</p>
        <h1>My details</h1>
      </div>
      <button type="button" class="secondary" @click="router.push('/atm')">Back</button>
    </header>

    <section class="panel">
      <p v-if="loading" class="label">Loading...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="profile">
        <dl class="details">
          <div>
            <dt>Name</dt>
            <dd>{{ profile.firstName }} {{ profile.lastName }}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{{ profile.email }}</dd>
          </div>
          <div>
            <dt>BSN</dt>
            <dd>{{ profile.bsn }}</dd>
          </div>
          <div>
            <dt>Total balance</dt>
            <dd>EUR {{ formatMoney(totalBalance()) }}</dd>
          </div>
        </dl>

        <form class="form-stack" @submit.prevent="savePhoneNumber">
          <label class="field">
            <span>Phone number</span>
            <input v-model="phoneNumber" type="tel" required />
          </label>
          <button type="submit" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save phone number' }}
          </button>
          <p v-if="message" class="label">{{ message }}</p>
        </form>

        <dl class="details">
          <div v-for="account in accounts" :key="account.id">
            <dt>{{ account.type }} - {{ account.iban }}</dt>
            <dd>EUR {{ formatMoney(account.balance) }}</dd>
          </div>
        </dl>
      </div>
    </section>
  </main>
</template>
