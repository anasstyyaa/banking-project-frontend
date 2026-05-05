<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getApiErrorMessage } from '@/composables/useApiError'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('testuser@gmail.com')
const password = ref('User123!')
const loading = ref(false)
const error = ref('')

async function submitLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login({ email: email.value, password: password.value })
    await router.push('/atm')
  } catch (err) {
    error.value = getApiErrorMessage(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page narrow-page">
    <section class="panel">
      <p class="label">Mock ATM</p>
      <h1>Sign in</h1>
      <form class="form-stack" @submit.prevent="submitLogin">
        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" autocomplete="username" required />
        </label>
        <label class="field">
          <span>Password</span>
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </section>
  </main>
</template>
