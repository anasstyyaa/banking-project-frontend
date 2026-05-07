import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '@/components/pages/LoginPage.vue'
import RegisterPage from '@/components/pages/RegisterPage.vue'
import DashboardPage from '@/components/pages/DashboardPage.vue'
import TransactionsPage from '@/components/pages/TransactionsPage.vue'
import TransferPage from '@/components/pages/TransferPage.vue'
import AtmPage from '@/components/pages/AtmPage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } },
    { path: '/transactions', component: TransactionsPage, meta: { requiresAuth: true } },
    { path: '/transfer', component: TransferPage, meta: { requiresAuth: true } },
    { path: '/atm', component: AtmPage, meta: { requiresAuth: true } }
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
  if ((to.path === '/login' || to.path === '/register') && token) {
    return '/dashboard'
  }
})

export default router
