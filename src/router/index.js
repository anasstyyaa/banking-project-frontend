import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/components/pages/LoginPage.vue";
import RegisterPage from "@/components/pages/RegisterPage.vue";
import EmployeeDashboardPage from "@/components/pages/EmployeeDashboardPage.vue";
import DashboardPage from "@/components/pages/DashboardPage.vue";
import CustomerProfilePage from "@/components/pages/CustomerProfilePage.vue";
import TransactionsPage from "@/components/pages/TransactionsPage.vue";
import TransferPage from "@/components/pages/TransferPage.vue";
import AtmPage from "@/components/pages/AtmPage.vue";
import PendingApprovalPage from "@/components/pages/PendingApprovalPage.vue";
import EmployeeAccountsPage from "@/components/pages/EmployeeAccountsPage.vue";
import SearchPage from "@/components/pages/SearchPage.vue";
import EmployeeTransactionsPage from "@/components/pages/EmployeeTransactionsPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/login" },
    {
      path: "/login",
      component: LoginPage,
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      component: RegisterPage,
      meta: { guestOnly: true },
    },
    {
      path: "/employee/registrations",
      component: EmployeeDashboardPage,
      meta: { requiresAuth: true, role: "ROLE_EMPLOYEE" },
    },
    {
      path: "/employee/dashboard",
      redirect: "/employee/registrations",
    },
    {
      path: "/employee/accounts",
      component: EmployeeAccountsPage,
      meta: { requiresAuth: true, role: "ROLE_EMPLOYEE" },
    },
    {
      path: "/employee/transactions",
      component: EmployeeTransactionsPage,
      meta: { requiresAuth: true, role: "ROLE_EMPLOYEE" },
    },
    {
      path: "/dashboard",
      component: DashboardPage,
      meta: { requiresAuth: true, role: "ROLE_CUSTOMER" },
    },
    {
      path: "/profile",
      component: CustomerProfilePage,
      meta: { requiresAuth: true, role: "ROLE_CUSTOMER" },
    },
    {
      path: "/transactions",
      component: TransactionsPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/transfer",
      component: TransferPage,
      meta: { requiresAuth: true, role: "ROLE_CUSTOMER" },
    },
    {
      path: "/atm",
      component: AtmPage,
      meta: { requiresAuth: true, role: "ROLE_CUSTOMER" },
    },
    {
      path: "/search",
      component: SearchPage,
      meta: { requiresAuth: true, role: "ROLE_CUSTOMER" },
    },
    {
      path: "/pending-approval",
      component: PendingApprovalPage,
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  if (to.meta.requiresAuth && !loggedInUser) {
    return next("/login");
  }

  if (to.meta.guestOnly && loggedInUser) {
    return next(
      loggedInUser.role === "ROLE_EMPLOYEE"
        ? "/employee/registrations"
        : "/dashboard",
    );
  }

  if (to.meta.role && loggedInUser.role !== to.meta.role) {
    return next(
      loggedInUser.role === "ROLE_EMPLOYEE"
        ? "/employee/registrations"
        : "/dashboard",
    );
  }

  next();
});

export default router;
