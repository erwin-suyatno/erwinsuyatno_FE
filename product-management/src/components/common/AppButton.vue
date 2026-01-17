<template>
  <button
    :type="type"
    :class="['app-button', `variant-${variant}`, `size-${size}`, { loading: loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'danger', 'orange', 'warning'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.app-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.size-small {
  padding: 6px 12px;
  font-size: 12px;
}

.size-medium {
  padding: 10px 20px;
  font-size: 14px;
}

.size-large {
  padding: 12px 24px;
  font-size: 16px;
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.variant-primary {
  background: var(--color-primary-red);
  color: white;
}

.variant-primary:hover:not(:disabled) {
  background: var(--color-primary-red-hover);
}

.variant-secondary {
  background: var(--color-gray-600);
  color: white;
}

.variant-outline {
  background: transparent;
  border: 1px solid var(--color-gray-300);
  color: var(--color-gray-700);
}

.variant-outline:hover:not(:disabled) {
  background: var(--color-gray-50);
}

.variant-danger {
  background: var(--color-error);
  color: white;
}

.variant-danger:hover:not(:disabled) {
  background: #DC2626;
}

.variant-orange,
.variant-warning {
  background: var(--color-orange);
  color: white;
}

.variant-orange:hover:not(:disabled),
.variant-warning:hover:not(:disabled) {
  background: var(--color-orange-hover);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
