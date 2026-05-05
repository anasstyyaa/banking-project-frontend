<script setup>
import { ref, onMounted } from 'vue'

const API = 'https://bank-api-3b70.onrender.com'  
const status = ref('Checking connection…')

onMounted(async () => {
  try {
    const res = await fetch(API + '/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test', password: 'test' }),
      signal: AbortSignal.timeout(5000),
    })
    status.value = `✅ Backend reachable (HTTP ${res.status})`
  } catch {
    status.value = '❌ Could not reach backend'
  }
})
</script>

<template>
  <h1>InHolland Bank</h1>
  <p>{{ status }}</p>
</template>

<style scoped></style>