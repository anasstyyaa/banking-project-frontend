<template>
  <div class="dashboard-template">
    <!-- Sidebar Slot/Organism -->
    <header class="sidebar-wrapper">
      <slot name="sidebar" />
    </header>

    <div class="main-container">
      <nav class="top-nav">
        <slot name="header-actions" />
      </nav>

      <main class="content-body">
        <slot name="content" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-template {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-gray-100);
}

.sidebar-wrapper {
  flex: 0 0 280px; 
  z-index: 100;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; 
}

.top-nav {
  height: 80px;
  padding: 0 var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: transparent;
}

.content-body {
  padding: 0 var(--space-xl) var(--space-xl) var(--space-xl);
  overflow-y: auto;
}
</style>