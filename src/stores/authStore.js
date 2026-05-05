import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { login as loginRequest } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(sessionStorage.getItem('authToken') || '')
  const email = ref(sessionStorage.getItem('authEmail') || '')
  const role = ref(sessionStorage.getItem('authRole') || '')
  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(credentials) {
    const session = await loginRequest(credentials)
    setSession(session)
  }

  function setSession(session) {
    token.value = session.token
    email.value = session.email
    role.value = session.role
    saveSession()
  }

  function saveSession() {
    sessionStorage.setItem('authToken', token.value)
    sessionStorage.setItem('authEmail', email.value)
    sessionStorage.setItem('authRole', role.value)
  }

  function logout() {
    token.value = ''
    email.value = ''
    role.value = ''
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('authEmail')
    sessionStorage.removeItem('authRole')
  }

  return { token, email, role, isAuthenticated, login, logout }
})
