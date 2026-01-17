<template>
  <div 
    class="product-card hover-lift"
    :class="{
      'out-of-stock-card': product.stock === 0,
      'low-stock-card': product.stock > 0 && product.stock < (product.minStock || 10)
    }"
  >
    <div class="product-header">
      <div class="header-top">
        <h3 class="product-name">{{ product.name }}</h3>
        <div class="stock-badges">
          <span 
            v-if="product.stock === 0" 
            class="stock-badge out-of-stock-badge"
          >
            <AppIcon name="delete" size="small" />
            <span>Out of Stock</span>
          </span>
          <span 
            v-else-if="product.stock < (product.minStock || 10)" 
            class="stock-badge low-stock-badge"
          >
            <AppIcon name="delete" size="small" />
            <span>Low Stock</span>
          </span>
        </div>
      </div>
      <span class="product-category">{{ product.category }}</span>
    </div>
    
    <p class="product-description">{{ product.description }}</p>
    
    <div class="product-details">
      <div class="detail-item">
        <span class="label">Price:</span>
        <span class="value price">{{ formatCurrency(product.price) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Stock:</span>
        <div class="stock-value-wrapper">
          <span 
            class="value" 
            :class="{ 
              'out-of-stock': product.stock === 0,
              'low-stock': product.stock > 0 && product.stock < (product.minStock || 10)
            }"
          >
            {{ product.stock }}
          </span>
          <span 
            v-if="product.stock === 0" 
            class="stock-icon out-of-stock-icon"
            title="Out of Stock"
          >
            ⚠️
          </span>
          <span 
            v-else-if="product.stock < (product.minStock || 10)" 
            class="stock-icon low-stock-icon"
            :title="`Low Stock: ${product.stock} < ${product.minStock || 10}`"
          >
            ⚠️
          </span>
        </div>
      </div>
      <div class="detail-item" v-if="product.sku">
        <span class="label">SKU:</span>
        <span class="value">{{ product.sku }}</span>
      </div>
    </div>
    
    <div class="product-actions">
      <AppButton variant="outline" @click="$emit('view', product.id)" :title="'View Product Details'">
        <AppIcon name="eye" size="small" />
        <span>View</span>
      </AppButton>
      <AppButton variant="outline" @click="$emit('edit', product.id)" :title="'Edit Product'">
        <AppIcon name="edit" size="small" />
        <span>Edit</span>
      </AppButton>
      <AppButton variant="danger" @click="$emit('delete', product.id)" :title="'Delete Product'">
        <AppIcon name="delete" size="small" />
        <span>Delete</span>
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'

defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.product-card.out-of-stock-card {
  border-left: 4px solid var(--color-error);
  background: rgba(239, 68, 68, 0.02);
}

.product-card.low-stock-card {
  border-left: 4px solid var(--color-orange);
  background: rgba(249, 115, 22, 0.02);
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 8px;
  flex-wrap: wrap;
}

.stock-badges {
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

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
  flex: 1;
}

.product-category {
  background: var(--color-orange-light);
  color: var(--color-orange);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  margin-left: 12px;
}

.product-description {
  color: var(--color-gray-600);
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-gray-200);
}

.detail-item {
  display: flex;
  justify-content: space-between;
}

.label {
  color: var(--color-gray-600);
  font-size: 14px;
}

.value {
  color: var(--color-gray-900);
  font-weight: 500;
  font-size: 14px;
}

.value.price {
  color: var(--color-primary-red);
  font-weight: 600;
}

.stock-value-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.value.out-of-stock {
  color: var(--color-error);
  font-weight: 700;
  background: rgba(239, 68, 68, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.value.low-stock {
  color: var(--color-orange);
  font-weight: 600;
  background: rgba(249, 115, 22, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.stock-icon {
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

.product-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.product-actions .app-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .product-card {
    padding: 16px;
  }
  
  .product-actions {
    flex-direction: column;
  }
}
</style>
