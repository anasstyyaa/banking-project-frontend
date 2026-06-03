<template>
  <div class="dashboard-layout">
    <AppSidebar @logout="$emit('logout')" />

    <div class="layout-main-frame">
      <nav class="layout-top-bar">
        <slot name="header-actions" />
      </nav>

      <main class="layout-content-viewport">
        <slot name="content" />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/organisms/Sidebar/Sidebar.vue';
defineEmits(['logout']);
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-gray-100);
}

.layout-main-frame {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 280px; 
  min-width: 0;
}

.layout-top-bar {
  height: 80px;
  padding: 0 var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.layout-content-viewport {
  padding: 0 var(--space-xl) var(--space-xl) var(--space-xl);
}
</style>