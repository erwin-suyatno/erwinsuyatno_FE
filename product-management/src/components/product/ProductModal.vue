<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <Transition name="scale">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Delete Product</h3>
            <button class="modal-close" @click="$emit('close')" :title="'Close modal'">
            <AppIcon name="close" size="medium" />
          </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <AppButton variant="outline" @click="$emit('close')">
              Cancel
            </AppButton>
            <AppButton variant="danger" @click="$emit('confirm')">
              <AppIcon name="delete" size="small" />
              <span>Delete</span>
            </AppButton>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-gray-500);
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.modal-close:hover {
  background: var(--color-gray-100);
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  color: var(--color-gray-700);
  margin: 0;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--color-gray-200);
}
</style>
