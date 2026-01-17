<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <AppIcon name="search" size="small" class="search-icon" />
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Search products by name, description, or SKU..."
        @input="handleSearch"
      />
      <button
        v-if="searchQuery"
        class="clear-button"
        @click="clearSearch"
        :title="'Clear search'"
      >
        <AppIcon name="close" size="small" />
      </button>
    </div>
    <AppButton variant="outline" @click="$emit('toggleFilter')" :title="'Open filters'">
      <AppIcon name="filter" size="small" />
      <span class="button-text">Filters</span>
    </AppButton>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'

const emit = defineEmits(['search', 'toggleFilter'])

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

// Expose method to clear from parent
defineExpose({
  clear: clearSearch
})
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--color-gray-400);
  z-index: 1;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary-red);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.clear-button {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-button:hover {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}

.button-text {
  margin-left: 4px;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }
  
  .search-input-wrapper {
    width: 100%;
  }
  
  .button-text {
    display: none;
  }
}
</style>
