<template>
  <div class="table-wrapper">
    <table class="app-table">
      <thead>
        <tr>
          <th><AppText size="xs" weight="bold" muted>USER DETAILS</AppText></th>
          <th><AppText size="xs" weight="bold" muted>BSN</AppText></th>
          <th><AppText size="xs" weight="bold" muted>STATUS</AppText></th>
          <th class="text-right"><AppText size="xs" weight="bold" muted>ACTIONS</AppText></th>
        </tr>
      </thead>
      <tbody v-if="users.length > 0">
        <RegistrationRow 
          v-for="user in users" 
          :key="user.id" 
          :user="user"
          @approve="$emit('approve', $event)"
          @deny="$emit('deny', $event)"
        />
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4" class="empty-cell">
            <AppIcon name="Inbox" :size="48" class="empty-icon" />
            <AppText size="sm" muted>No pending requests found</AppText>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import RegistrationRow from '@/components/molecules/RegistrationRow/RegistrationRow.vue';
import AppText from '@/components/atoms/Text/Text.vue';
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue';

defineProps({
  users: {
    type: Array,
    required: true,
    default: () => []
  }
});

defineEmits(['approve', 'deny']);
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  background: var(--color-white);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  padding: var(--space-md) var(--space-lg);
  background: var(--color-gray-100);
  border-bottom: 1px solid var(--color-gray-200);
}

.text-right {
  text-align: right;
}

.empty-cell {
  padding: var(--space-xl);
  text-align: center;
  color: var(--color-gray-400);
}

.empty-icon {
  margin-bottom: var(--space-sm);
  opacity: 0.5;
}


:deep(.registration-row:last-child td) {
  border-bottom: none;
}
</style>