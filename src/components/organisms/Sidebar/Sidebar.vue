<template>
  <aside class="app-sidebar">
    <div class="sidebar-logo">
      <AppIcon name="Banknote" :size="32" />
      <AppText size="lg" weight="bold">InHolland Bank</AppText>
    </div>

    <nav class="sidebar-nav">
      <NavItem 
        icon="LayoutDashboard" 
        :active="currentRoute === 'dashboard'" 
        @navigate="$emit('route-change', 'dashboard')"
      >
        Dashboard
      </NavItem>
      
      <NavItem 
        icon="Users" 
        :active="currentRoute === 'registrations'" 
        @navigate="$emit('route-change', 'registrations')"
      >
        User Requests
      </NavItem>

      <NavItem 
        icon="CreditCard" 
        :active="currentRoute === 'accounts'" 
        @navigate="$emit('route-change', 'accounts')"
      >
        Accounts
      </NavItem>
    </nav>

    <div class="sidebar-footer">
      <NavItem icon="LogOut" @navigate="$emit('logout')">Logout</NavItem>
    </div>
  </aside>
</template>

<script setup>
import NavItem from '@/components/molecules/NavItem/NavItem.vue';
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
</style>