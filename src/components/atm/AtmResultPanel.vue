<script setup>
defineProps({
  error: { type: String, default: '' },
  result: { type: Object, default: null },
})
</script>

<template>
  <section v-if="error || result" class="panel">
    <p v-if="error" class="error">{{ error }}</p>
    <div v-else>
      <p class="label">Last transaction</p>
      <p>{{ result.type }} of EUR {{ result.amount }}</p>
      <p>New balance: EUR {{ result.balance }}</p>
    </div>
  </section>
</template>
