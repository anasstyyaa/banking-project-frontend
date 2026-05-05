<script setup>
defineProps({
  account: { type: Object, default: null },
})
</script>

<template>
  <section class="panel">
    <p class="label">Available balance</p>
    <h2>{{ account ? `EUR ${account.balance}` : 'No account selected' }}</h2>
    <dl v-if="account" class="details">
      <div>
        <dt>IBAN</dt>
        <dd>{{ account.iban }}</dd>
      </div>
      <div>
        <dt>Daily limit</dt>
        <dd>EUR {{ account.dailyLimit }}</dd>
      </div>
      <div>
        <dt>Absolute limit</dt>
        <dd>EUR {{ account.absoluteLimit }}</dd>
      </div>
    </dl>
  </section>
</template>
