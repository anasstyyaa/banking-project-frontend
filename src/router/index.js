import { createRouter, createWebHashHistory } from 'vue-router'
import AtmDashboardView from '@/views/AtmDashboardView.vue'
import AtmLoginView from '@/views/AtmLoginView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/atm/login' },
    { path: '/atm/login', component: AtmLoginView },
    { path: '/atm', component: AtmDashboardView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/atm/login'
  }
})

export default router
