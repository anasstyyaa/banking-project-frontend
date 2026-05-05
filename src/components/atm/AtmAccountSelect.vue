<script setup>
defineProps({
  accounts: { type: Array, required: true },
  modelValue: { type: [String, Number], required: true },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="field">
    <span>Account</span>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="account in accounts" :key="account.id" :value="account.id">
        {{ account.type }} - {{ account.iban }}
      </option>
    </select>
  </label>
</template>
