import { computed, ref } from 'vue'
import { deposit, getAtmAccounts, withdraw } from '@/services/atmService'
import { getApiErrorMessage } from './useApiError'

export function useAtm() {
  const accounts = ref([])
  const selectedAccountId = ref('')
  const loading = ref(false)
  const error = ref('')
  const result = ref(null)

  const selectedAccount = computed(() => {
    return accounts.value.find((account) => account.id === Number(selectedAccountId.value))
  })

  async function loadAccounts() {
    await runAction(async () => {
      accounts.value = await getAtmAccounts()
      selectedAccountId.value = accounts.value[0]?.id || ''
    })
  }

  async function depositMoney(amount) {
    await runTransaction(() => deposit(Number(selectedAccountId.value), amount))
  }

  async function withdrawMoney(amount) {
    await runTransaction(() => withdraw(Number(selectedAccountId.value), amount))
  }

  async function runTransaction(action) {
    await runAction(async () => {
      result.value = await action()
      await loadAccounts()
    })
  }

  async function runAction(action) {
    loading.value = true
    error.value = ''
    try {
      await action()
    } catch (err) {
      error.value = getApiErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  return {
    accounts,
    selectedAccountId,
    selectedAccount,
    loading,
    error,
    result,
    loadAccounts,
    depositMoney,
    withdrawMoney,
  }
}
