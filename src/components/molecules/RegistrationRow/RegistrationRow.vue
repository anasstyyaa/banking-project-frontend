<template>
  <tr class="registration-row">
    <td class="user-info">
      <div class="avatar-placeholder">
        <AppIcon name="User" :size="18" />
      </div>
      <div class="details">
        <AppText weight="bold" size="base">
          {{ user.firstName }} {{ user.lastName }}
        </AppText>
        <AppText size="xs" muted class="email-text">
          {{ user.email }}
        </AppText>
      </div>
    </td>
    
    <td>
      <AppText size="sm" weight="bold">{{ user.bsn }}</AppText>
    </td>

    <td>
      <AppBadge type="warning">Pending</AppBadge>
    </td>

    <td class="actions">
      <AppButton 
        variant="primary" 
        size="sm" 
        @click="$emit('approve', user.id)"
      >
        Approve
      </AppButton>
      <AppButton 
        variant="ghost" 
        size="sm" 
        class="deny-btn"
        @click="$emit('deny', user.id)"
      >
        Deny
      </AppButton>
    </td>
  </tr>
</template>

<script setup>
import AppText from '@/components/atoms/Text/Text.vue';
import AppBadge from '@/components/atoms/Badge/Badge.vue';
import AppButton from '@/components/atoms/Button/Button.vue';
import AppIcon from '@/components/atoms/AppIcon/AppIcon.vue';

defineProps({
  user: {
    type: Object,
    required: true
  }
});

defineEmits(['approve', 'deny']);
</script>

<style scoped>
.registration-row td {
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-gray-100);
  vertical-align: middle;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  background: var(--color-gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
}

.details {
  display: flex;
  flex-direction: column;
}

.email-text {
  word-break: break-all;
}

.actions {
  text-align: right;
  white-space: nowrap;
}

.deny-btn {
  color: var(--color-error);
  margin-left: var(--space-xs);
}

.deny-btn:hover {
  background: rgba(211, 47, 47, 0.05);
}
</style>