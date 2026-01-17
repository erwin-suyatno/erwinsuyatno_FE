<template>
  <AppTable
    :columns="columns"
    :data="products"
    :sort-by="sortBy"
    :sort-order="sortOrder"
    row-key="id"
    @sort="$emit('sort', $event)"
  >
    <!-- Custom cell for Name column -->
    <template #cell-name="{ row }">
      <div class="product-name-cell">
        <div class="name-header">
          <strong>{{ row.name }}</strong>
          <div class="stock-indicators">
            <span 
              v-if="row.stock === 0" 
              class="stock-badge out-of-stock-badge"
              :title="'Out of Stock'"
            >
              <AppIcon name="delete" size="small" />
              <span>Out of Stock</span>
            </span>
            <span 
              v-else-if="row.stock < (row.minStock || 10)" 
              class="stock-badge low-stock-badge"
              :title="`Low Stock: ${row.stock} < ${row.minStock || 10}`"
            >
              <AppIcon name="delete" size="small" />
              <span>Low Stock</span>
            </span>
          </div>
        </div>
        <span class="product-description-text">{{ row.description }}</span>
      </div>
    </template>

    <!-- Custom cell for Category column -->
    <template #cell-category="{ value }">
      <span class="category-badge">{{ value }}</span>
    </template>

    <!-- Custom cell for Price column -->
    <template #cell-price="{ value }">
      <span class="price-cell">{{ formatCurrency(value) }}</span>
    </template>

    <!-- Custom cell for Stock column -->
    <template #cell-stock="{ row }">
      <div class="stock-cell-wrapper">
        <span 
          :class="{ 
            'out-of-stock': row.stock === 0,
            'low-stock': row.stock > 0 && row.stock < (row.minStock || 10),
            'normal-stock': row.stock >= (row.minStock || 10)
          }" 
          class="stock-cell"
        >
          {{ row.stock }}
        </span>
        <span 
          v-if="row.stock === 0" 
          class="stock-status-icon out-of-stock-icon"
          :title="'Out of Stock'"
        >
          ⚠️
        </span>
        <span 
          v-else-if="row.stock < (row.minStock || 10)" 
          class="stock-status-icon low-stock-icon"
          :title="`Low Stock: ${row.stock} < ${row.minStock || 10}`"
        >
          ⚠️
        </span>
      </div>
    </template>

    <!-- Custom cell for Min Stock column -->
    <template #cell-minStock="{ row }">
      <span class="min-stock-cell">
        {{ row.minStock ?? 10 }}
      </span>
    </template>

    <!-- Custom cell for SKU column -->
    <template #cell-sku="{ value }">
      <span class="sku-cell">{{ value || '-' }}</span>
    </template>

    <!-- Custom cell for Actions column -->
    <template #cell-actions="{ row }">
      <div class="action-buttons">
        <AppButton variant="outline" size="small" @click="$emit('view', row.id)" :title="'View Product Details'">
          <AppIcon name="eye" size="small" />
          <span class="button-text">View</span>
        </AppButton>
        <AppButton variant="orange" size="small" @click="$emit('edit', row.id)" :title="'Edit Product'">
          <AppIcon name="edit" size="small" />
          <span class="button-text">Edit</span>
        </AppButton>
        <AppButton variant="danger" size="small" @click="$emit('delete', row.id)" :title="'Delete Product'">
          <AppIcon name="delete" size="small" />
          <span class="button-text">Delete</span>
        </AppButton>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/formatters'
import AppTable from '@/components/common/AppTable.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  sortBy: {
    type: String,
    default: null
  },
  sortOrder: {
    type: String,
    default: null
  }
})

defineEmits(['view', 'edit', 'delete', 'sort'])

// Define table columns configuration
const columns = computed(() => [
  {
    key: 'name',
    label: 'Name',
    sortable: true
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true
  },
  {
    key: 'price',
    label: 'Price',
    sortable: true
  },
  {
    key: 'stock',
    label: 'Stock',
    sortable: true
  },
  {
    key: 'minStock',
    label: 'Min Stock',
    sortable: true
  },
  {
    key: 'sku',
    label: 'SKU',
    sortable: true
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false
  }
])
</script>

<style scoped>
.product-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.product-name-cell strong {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-gray-900);
  flex: 1;
  min-width: 0;
}

.stock-indicators {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.2;
}

.stock-badge :deep(svg) {
  width: 12px;
  height: 12px;
}

.out-of-stock-badge {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-error);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.low-stock-badge {
  background: rgba(249, 115, 22, 0.15);
  color: var(--color-orange);
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.product-description-text {
  font-size: 12px;
  color: var(--color-gray-600);
  line-height: 1.4;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.category-badge {
  background: var(--color-orange-light);
  color: var(--color-orange);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.price-cell {
  font-weight: 600;
  color: var(--color-primary-red);
}

.stock-cell-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stock-cell {
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.stock-cell.normal-stock {
  color: var(--color-gray-700);
  background: var(--color-gray-100);
}

.stock-cell.low-stock {
  color: var(--color-orange);
  background: rgba(249, 115, 22, 0.1);
  font-weight: 600;
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.stock-cell.out-of-stock {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
  font-weight: 700;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.stock-status-icon {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.out-of-stock-icon {
  animation: pulse 2s infinite;
}

.low-stock-icon {
  animation: pulse 2s infinite;
  animation-delay: 0.5s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.min-stock-cell {
  font-weight: 500;
  color: var(--color-gray-600);
  background: var(--color-gray-100);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 13px;
}

.sku-cell {
  color: var(--color-gray-600);
  font-family: monospace;
  font-size: 13px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons .app-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.button-text {
  font-size: inherit;
}

@media (max-width: 1024px) {
  .button-text {
    display: none;
  }
  
  .action-buttons .app-button {
    padding: 6px;
    min-width: 36px;
  }
}

@media (max-width: 1024px) {
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
