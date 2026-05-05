<script setup>
import { ref } from 'vue'

defineProps({
  loading: { type: Boolean, required: true },
  disabled: { type: Boolean, required: true },
})

const emit = defineEmits(['deposit', 'withdraw'])
const amount = ref('')

function submit(type) {
  emit(type, Number(amount.value))
  amount.value = ''
}
</script>

<template>
  <form class="panel action-form" @submit.prevent>
    <label class="field">
      <span>Amount</span>
      <input v-model="amount" type="number" min="0.01" step="0.01" placeholder="0.00" />
    </label>

    <div class="button-row">
      <button type="button" :disabled="disabled || loading" @click="submit('deposit')">
        Deposit
      </button>
      <button type="button" :disabled="disabled || loading" @click="submit('withdraw')">
        Withdraw
      </button>
    </div>
  </form>
</template>
