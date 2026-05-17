<template>
  <div class="banking-layout">
    <aside class="sidebar">
      <div class="brand">
        <AppText tag="h1" size="lg" weight="bold">Inholland Bank</AppText>
        <AppText size="xs" muted>{{ userEmail }}</AppText>
      </div>

      <nav class="nav">
        <NavItem icon="LayoutDashboard" :active="isActive('/dashboard')" @navigate="goTo('/dashboard')">Dashboard</NavItem>
        <NavItem icon="ReceiptText" :active="isActive('/transactions')" @navigate="goTo('/transactions')">Transactions</NavItem>
        <NavItem icon="Send" :active="isActive('/transfer')" @navigate="goTo('/transfer')">Transfer</NavItem>
        <NavItem icon="Landmark" :active="isActive('/atm')" @navigate="goTo('/atm')">ATM</NavItem>
      </nav>

      <AppButton variant="ghost" class="logout-button" @click="logout">
        <AppIcon name="LogOut" :size="18" />
        Logout
      </AppButton>
    </aside>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '@/components/atoms/Button/Button.vue';
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import NavItem from '@/components/molecules/NavItem/NavItem.vue';

const route = useRoute();
const router = useRouter();
const userEmail = computed(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.email || 'Authenticated user';
});

const isActive = (path) => route.path === path;

const goTo = (path) => router.push(path);

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<style scoped>
.banking-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: var(--color-gray-100);
}

.sidebar {
  background: var(--color-white);
  border-right: 1px solid var(--color-primary);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.logout-button {
  margin-top: auto;
  display: flex;
  gap: var(--space-sm);
}

.content {
  padding: var(--space-xl);
  max-width: 1180px;
  width: 100%;
}

@media (max-width: 820px) {
  .banking-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--color-primary);
  }

  .content {
    padding: var(--space-lg);
  }
}
</style>
