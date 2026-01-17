<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="filter-drawer-overlay" @click.self="$emit('close')">
        <Transition name="slide-right">
          <div v-if="show" class="filter-drawer" @click.stop>
        <div class="drawer-header">
          <h2 class="drawer-title">Filters</h2>
          <button class="drawer-close" @click="$emit('close')" :title="'Close filters'">
            <AppIcon name="close" size="medium" />
          </button>
        </div>
        
        <div class="drawer-content">
          <!-- Category Filter -->
          <div class="filter-section">
            <label class="filter-label">Category</label>
            <div class="filter-options">
              <label
                v-for="category in categories"
                :key="category"
                class="filter-option"
              >
                <input
                  type="checkbox"
                  :value="category"
                  :checked="selectedCategories.includes(category)"
                  @change="handleCategoryChange(category, $event)"
                />
                <span>{{ category }}</span>
              </label>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="filter-section">
            <label class="filter-label">Price Range</label>
            <div class="price-range">
              <div class="price-input-group">
                <label>Min Price</label>
                <input
                  v-model.number="priceRange.min"
                  type="number"
                  class="price-input"
                  placeholder="0"
                  min="0"
                  @input="handlePriceChange"
                />
              </div>
              <div class="price-input-group">
                <label>Max Price</label>
                <input
                  v-model.number="priceRange.max"
                  type="number"
                  class="price-input"
                  placeholder="No limit"
                  min="0"
                  @input="handlePriceChange"
                />
              </div>
            </div>
          </div>

          <!-- Stock Filter -->
          <div class="filter-section">
            <label class="filter-label">Stock Status</label>
            <div class="filter-options">
              <label class="filter-option">
                <input
                  type="radio"
                  name="stock"
                  value="all"
                  :checked="stockFilter === 'all'"
                  @change="handleStockChange('all')"
                />
                <span>All</span>
              </label>
              <label class="filter-option">
                <input
                  type="radio"
                  name="stock"
                  value="in-stock"
                  :checked="stockFilter === 'in-stock'"
                  @change="handleStockChange('in-stock')"
                />
                <span>In Stock</span>
              </label>
              <label class="filter-option">
                <input
                  type="radio"
                  name="stock"
                  value="low-stock"
                  :checked="stockFilter === 'low-stock'"
                  @change="handleStockChange('low-stock')"
                />
                <span>Low Stock</span>
              </label>
              <label class="filter-option">
                <input
                  type="radio"
                  name="stock"
                  value="out-of-stock"
                  :checked="stockFilter === 'out-of-stock'"
                  @change="handleStockChange('out-of-stock')"
                />
                <span>Out of Stock</span>
              </label>
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <AppButton variant="outline" @click="clearFilters">
            Clear All
          </AppButton>
          <AppButton @click="applyFilters">
            Apply Filters
          </AppButton>
        </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'apply', 'clear'])

const categories = ['Electronics', 'Accessories', 'Software', 'Hardware', 'Other']

const selectedCategories = ref([])
const priceRange = reactive({
  min: null,
  max: null
})
const stockFilter = ref('all')

const handleCategoryChange = (category, event) => {
  if (event.target.checked) {
    if (!selectedCategories.value.includes(category)) {
      selectedCategories.value.push(category)
    }
  } else {
    selectedCategories.value = selectedCategories.value.filter(c => c !== category)
  }
}

const handlePriceChange = () => {
  // Auto-apply price filter
}

const handleStockChange = (value) => {
  stockFilter.value = value
}

const applyFilters = () => {
  emit('apply', {
    categories: selectedCategories.value,
    priceRange: {
      min: priceRange.min || null,
      max: priceRange.max || null
    },
    stock: stockFilter.value
  })
  emit('close')
}

const clearFilters = () => {
  selectedCategories.value = []
  priceRange.min = null
  priceRange.max = null
  stockFilter.value = 'all'
  emit('clear')
  emit('close')
}

// Watch for external changes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    // Reset when drawer closes
  }
})
</script>

<style scoped>
.filter-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.filter-drawer {
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.drawer-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
}

.drawer-close {
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

.drawer-close:hover {
  background: var(--color-gray-100);
}

.drawer-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.filter-section {
  margin-bottom: 32px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.filter-option:hover {
  background: var(--color-gray-50);
}

.filter-option input[type="checkbox"],
.filter-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-primary-red);
}

.filter-option span {
  font-size: 14px;
  color: var(--color-gray-700);
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price-input-group label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-gray-600);
}

.price-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.price-input:focus {
  outline: none;
  border-color: var(--color-primary-red);
}

.drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  gap: 12px;
  position: sticky;
  bottom: 0;
  background: white;
}

.drawer-footer .app-button {
  flex: 1;
}

@media (max-width: 768px) {
  .filter-drawer {
    max-width: 100%;
  }
}
</style>
