import apiClient from './apiClient'

export async function login(credentials) {
  const response = await apiClient.post('/api/v1/auth/login', credentials)
  return response.data
}
