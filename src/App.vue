<template>
  <router-view />
</template>

<script setup>
</script>

<style>

@import "@/assets/styles/variables.css";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-main);
  background-color: var(--color-gray-100);
  color: var(--color-primary-dark);
}
</style>