<template>
  <div class="app-empty">
    <div class="empty-icon">📦</div>
    <p class="empty-message">{{ message }}</p>
    <AppButton v-if="actionLabel" @click="$emit('action')" variant="primary">
      {{ actionLabel }}
    </AppButton>
  </div>
</template>

<script setup>
import AppButton from './AppButton.vue'

defineProps({
  message: {
    type: String,
    default: 'No data available'
  },
  actionLabel: {
    type: String,
    default: ''
  }
})

defineEmits(['action'])
</script>

<style scoped>
.app-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.5;
}

.empty-message {
  color: var(--color-gray-600);
  font-size: 16px;
  margin: 0;
}
</style>
