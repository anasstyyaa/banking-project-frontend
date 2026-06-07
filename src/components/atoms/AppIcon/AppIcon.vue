<template>
  <component 
    :is="iconComponent" 
    :size="size" 
    :stroke-width="2" 
    class="app-icon"
  />
</template>

<script setup>
import { computed } from 'vue';
import * as icons from 'lucide-vue-next';

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 }
});

const iconComponent = computed(() => icons[props.name]);
</script>

<style scoped>
.app-icon {
  color: currentColor; 
  display: inline-block;
  vertical-align: middle;
}
</style>