import apiClient from './apiClient'

export async function getProfile() {
  const response = await apiClient.get('/api/v1/users/profile')
  return response.data
}

export async function updatePhoneNumber(phoneNumber) {
  const response = await apiClient.put('/api/v1/users/profile/phone-number', { phoneNumber })
  return response.data
}
