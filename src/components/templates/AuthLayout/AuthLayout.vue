<template>
  <div class="auth-layout">
    <div class="auth-sidebar">
      <div class="brand-content">
        <AppText tag="h1" size="xl" weight="bold" class="brand-title">
          Secure Banking <br /> Made Simple.
        </AppText>
        <AppText size="base" class="brand-subtitle">
          Join thousands of users managing their finances with our modern platform.
        </AppText>
      </div>
      <div class="sidebar-footer">
        <AppText size="xs" muted>© 2024 Banking Project v0.1</AppText>
      </div>
    </div>

    <main class="auth-main">
      <div class="form-container">
        <slot name="form" />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppText from '@/components/atoms/Text/Text.vue';
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: var(--color-white);
  font-family: var(--font-main);
}

.auth-sidebar {
  flex: 1;
  background: var(--color-primary-dark);
  color: var(--color-white);
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}


.auth-sidebar::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at bottom right, var(--color-secondary), transparent 70%);
  opacity: 0.2;
}

.brand-title { color: var(--color-white); margin-bottom: var(--space-md); }
.brand-subtitle { color: var(--color-primary); opacity: 0.8; }

.auth-main {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-100);
}

.form-container {
  width: 100%;
  max-width: 440px;
  padding: var(--space-lg);
}

.sidebar-footer {
  position: absolute;
  bottom: var(--space-lg);
  left: var(--space-xl);
}

@media (max-width: 768px) {
  .auth-sidebar { display: none; }
}
</style>