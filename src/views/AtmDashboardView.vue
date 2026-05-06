<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AtmAccountSelect from '@/components/atm/AtmAccountSelect.vue'
import AtmActionForm from '@/components/atm/AtmActionForm.vue'
import AtmBalancePanel from '@/components/atm/AtmBalancePanel.vue'
import AtmResultPanel from '@/components/atm/AtmResultPanel.vue'
import { useAtm } from '@/composables/useAtm'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const atm = useAtm()

onMounted(atm.loadAccounts)

async function logout() {
  authStore.logout()
  await router.push('/atm/login')
}
</script>

<template>
  <main class="page">
    <header class="page-header">
      <div>
        <p class="label">Mock ATM</p>
        <h1>Deposit and withdraw</h1>
      </div>
      <button type="button" class="secondary" @click="logout">Logout</button>
    </header>

    <section class="grid">
      <div class="panel">
        <AtmAccountSelect v-model="atm.selectedAccountId.value" :accounts="atm.accounts.value" />
      </div>
      <AtmBalancePanel :account="atm.selectedAccount.value" />
      <AtmActionForm
        :loading="atm.loading.value"
        :disabled="!atm.selectedAccount.value"
        @deposit="atm.depositMoney"
        @withdraw="atm.withdrawMoney"
      />
      <AtmResultPanel :error="atm.error.value" :result="atm.result.value" />
    </section>
  </main>
</template>
