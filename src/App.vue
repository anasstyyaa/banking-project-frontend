<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios' // Use axios instead of fetch

const status = ref('Checking connection…')

onMounted(async () => {
  try {
    const res = await axios.post('/api/v1/auth/login', { 
      email: 'test', 
      password: 'test' 
    })
    
    status.value = `✅ Backend reachable (HTTP ${res.status})`
  } catch (err) {
    if (err.response) {
      status.value = `✅ Backend reachable (HTTP ${err.response.status})`
    } else {
      status.value = '❌ Could not reach backend'
      console.error(err)
    }
  }
})
</script>

<template>
  <div style="padding: 2rem; text-align: center;">
    <h1>InHolland Bank</h1>
    <hr />
    <h3>Backend Connection Test:</h3>
    <p :style="{ color: status.includes('✅') ? 'green' : 'red' }">
      {{ status }}
    </p>
  </div>
</template>

<style>
body {
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  padding: 50px;
}
.status-box {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>