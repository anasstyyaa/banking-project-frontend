<template>
  <aside class="app-sidebar">
    <div class="sidebar-logo">
      <AppIcon name="Banknote" :size="32" />
      <AppText size="lg" weight="bold">InHolland Bank</AppText>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/employee/registrations" class="menu-item" active-class="active">
        <AppIcon name="UserCheck" :size="20" />
        <AppText size="sm" weight="bold">User Requests</AppText>
      </RouterLink>

      <RouterLink to="/employee/accounts" class="menu-item" active-class="active">
        <AppIcon name="CreditCard" :size="20" />
        <AppText size="sm" weight="bold">Accounts</AppText>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <button class="logout-btn" @click="$emit('logout')">
        <AppIcon name="LogOut" :size="20" />
        <AppText size="sm" weight="bold">Logout</AppText>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppText from '@/components/atoms/Text/Text.vue';
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue';

defineProps({
  currentRoute: { type: String, default: 'registrations' }
});
defineEmits(['route-change', 'logout']);
</script>

<style scoped>
.app-sidebar {
  width: 280px;
  height: 100vh;
  background: var(--color-white);
  border-right: 1px solid var(--color-gray-100);
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  position: fixed;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  margin-bottom: var(--space-xl);
  color: var(--color-secondary);
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.sidebar-footer {
  border-top: 1px solid var(--color-gray-100);
  padding-top: var(--space-md);
}

/* --- Base Link Styles --- */
.menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  color: var(--color-gray-500);
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

/* Force inner child custom atoms to obey wrapper colors */
.menu-item :deep(.app-icon),
.menu-item :deep(.app-text) {
  color: inherit;
}

.menu-item:hover {
  background: var(--color-gray-100);
  color: var(--color-primary-dark);
}

/* --- Active State Configuration --- */
.menu-item.active {
  background: var(--color-secondary); /* Purple background */
  color: var(--color-white);           /* Pure white text */
}

/* Active State Hover Configuration */
.menu-item.active:hover {
  background: var(--color-gray-500);  /* Turns gray on hover */
  color: var(--color-white);           /* Keeps text white */
}

/* --- Logout Action Button --- */
.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Initial State matching your design criteria */
  background: var(--color-gray-100);  /* Matches the section split border color */
  border: 1px solid var(--color-gray-100); /* Border hidden by matching backgrounds */
  color: var(--color-gray-500);
}

.logout-btn :deep(.app-icon),
.logout-btn :deep(.app-text) {
  color: inherit;
}

/* Logout Hover Configuration */
.logout-btn:hover {
  background: var(--color-secondary);      /* Turns purple on hover */
  border-color: var(--color-secondary);  /* Updates border to match purple */
  color: var(--color-white);              /* Shifts text to white */
}
</style>