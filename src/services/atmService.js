import apiClient from './apiClient'

export async function getAtmAccounts() {
  const response = await apiClient.get('/api/v1/atm/accounts')
  return response.data
}

export async function deposit(accountId, amount) {
  const response = await apiClient.post('/api/v1/atm/deposit', { accountId, amount })
  return response.data
}

export async function withdraw(accountId, amount) {
  const response = await apiClient.post('/api/v1/atm/withdraw', { accountId, amount })
  return response.data
}
