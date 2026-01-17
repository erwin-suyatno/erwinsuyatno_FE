<template>
  <div class="product-view-page">
    <div class="page-header">
      <AppButton variant="outline" @click="goBack" :title="'Go back to product list'">
        <AppIcon name="arrow-left" size="small" />
        <span>Back</span>
      </AppButton>
      <div class="header-actions">
        <AppButton variant="outline" @click="goToEdit" :title="'Edit this product'">
          <AppIcon name="edit" size="small" />
          <span>Edit</span>
        </AppButton>
        <AppButton variant="danger" @click="handleDelete" :title="'Delete this product'">
          <AppIcon name="delete" size="small" />
          <span>Delete</span>
        </AppButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="productStore.isLoading && !product" class="loading-container">
      <SkeletonCard />
    </div>

    <!-- Error State -->
    <div v-else-if="productStore.isLoading === false && !product" class="error-container">
      <AppIcon name="package" size="large" />
      <h2>Product Not Found</h2>
      <p>The product you're looking for doesn't exist or has been deleted.</p>
      <AppButton @click="goBack">Go Back to Products</AppButton>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="product-details-container">
      <!-- Product Header Card -->
      <div class="product-header-card" :class="getStockStatusClass">
        <div class="header-content">
          <div class="product-title-section">
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="product-meta">
              <span class="category-badge">{{ product.category }}</span>
              <span 
                v-if="product.stock === 0" 
                class="status-badge out-of-stock-badge"
              >
                <AppIcon name="delete" size="small" />
                <span>Out of Stock</span>
              </span>
              <span 
                v-else-if="product.stock < (product.minStock || 10)" 
                class="status-badge low-stock-badge"
              >
                <AppIcon name="delete" size="small" />
                <span>Low Stock</span>
              </span>
              <span 
                v-else 
                class="status-badge in-stock-badge"
              >
                <AppIcon name="package" size="small" />
                <span>In Stock</span>
              </span>
            </div>
          </div>
          <div class="product-price-section">
            <span class="price-label">Price</span>
            <span class="price-value">{{ formatCurrency(product.price) }}</span>
          </div>
        </div>
        <p v-if="product.description" class="product-description">{{ product.description }}</p>
      </div>

      <!-- Product Information Grid -->
      <div class="info-grid">
        <!-- Stock Information Card -->
        <div class="info-card stock-card" :class="getStockStatusClass">
          <div class="card-icon">
            <AppIcon name="package" size="large" />
          </div>
          <div class="card-content">
            <h3 class="card-title">Stock Information</h3>
            <div class="stock-details">
              <div class="stock-item">
                <span class="stock-label">Current Stock</span>
                <span 
                  class="stock-value" 
                  :class="{
                    'out-of-stock': product.stock === 0,
                    'low-stock': product.stock > 0 && product.stock < (product.minStock || 10),
                    'normal-stock': product.stock >= (product.minStock || 10)
                  }"
                >
                  {{ product.stock }} units
                </span>
              </div>
              <div class="stock-item">
                <span class="stock-label">Minimum Stock</span>
                <span class="stock-value">{{ product.minStock ?? 10 }} units</span>
              </div>
              <div class="stock-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :class="getStockStatusClass"
                    :style="{ width: `${getStockPercentage}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ getStockPercentage }}% of minimum stock</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Details Card -->
        <div class="info-card details-card">
          <div class="card-icon">
            <AppIcon name="package" size="large" />
          </div>
          <div class="card-content">
            <h3 class="card-title">Product Details</h3>
            <div class="details-list">
              <div class="detail-row">
                <span class="detail-label">Category</span>
                <span class="detail-value">{{ product.category }}</span>
              </div>
              <div v-if="product.sku" class="detail-row">
                <span class="detail-label">SKU</span>
                <span class="detail-value sku-value">{{ product.sku }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Price</span>
                <span class="detail-value price-value">{{ formatCurrency(product.price) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Timestamp Card -->
        <div class="info-card timestamp-card">
          <div class="card-icon">
            <AppIcon name="package" size="large" />
          </div>
          <div class="card-content">
            <h3 class="card-title">Timestamps</h3>
            <div class="details-list">
              <div class="detail-row">
                <span class="detail-label">Created At</span>
                <span class="detail-value">{{ formatDateTime(product.createdAt) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Last Updated</span>
                <span class="detail-value">{{ formatDateTime(product.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ProductModal
      :show="uiStore.showDeleteModal"
      @close="uiStore.hideDeleteModal()"
      @confirm="confirmDelete"
    />

    <!-- Notification -->
    <Transition name="slide">
      <div v-if="uiStore.notification.show" class="notification" :class="`notification-${uiStore.notification.type}`">
        <span class="notification-message">{{ uiStore.notification.message }}</span>
        <button class="notification-close" @click="uiStore.hideNotification()">×</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product.store'
import { useUIStore } from '@/stores/ui.store'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import { defineAsyncComponent } from 'vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'

const ProductModal = defineAsyncComponent({
  loader: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(import('@/components/product/ProductModal.vue'))
      }, Math.random() * 200 + 100)
    })
  },
  delay: 0,
  timeout: 3000
})

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const uiStore = useUIStore()

const product = ref(null)

// Load product data
onMounted(async () => {
  const loadedProduct = await productStore.getProduct(route.params.id)
  product.value = loadedProduct
  
  // Update route meta with product name for breadcrumb
  if (loadedProduct) {
    route.meta.productName = loadedProduct.name
  }
})

// Computed properties
const getStockStatusClass = computed(() => {
  if (!product.value) return ''
  if (product.value.stock === 0) return 'out-of-stock-status'
  if (product.value.stock < (product.value.minStock || 10)) return 'low-stock-status'
  return 'in-stock-status'
})

const getStockPercentage = computed(() => {
  if (!product.value) return 0
  const minStock = product.value.minStock || 10
  if (minStock === 0) return 100
  const percentage = (product.value.stock / minStock) * 100
  return Math.min(percentage, 100)
})

// Navigation methods
const goBack = () => {
  router.push('/products')
}

const goToEdit = () => {
  router.push(`/products/${route.params.id}/edit`)
}

const handleDelete = () => {
  uiStore.openDeleteModal(route.params.id)
}

const confirmDelete = () => {
  try {
    if (uiStore.deleteTargetId) {
      productStore.deleteProduct(uiStore.deleteTargetId)
      uiStore.hideDeleteModal()
      uiStore.showSuccess('Product deleted successfully!')
      setTimeout(() => {
        router.push('/products')
      }, 500)
    }
  } catch (error) {
    uiStore.showError('Failed to delete product')
  }
}
</script>

<style scoped>
.product-view-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions .app-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  text-align: center;
}

.error-container :deep(svg) {
  width: 64px;
  height: 64px;
  color: var(--color-gray-400);
  margin-bottom: 8px;
}

.error-container h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 8px 0;
}

.error-container p {
  color: var(--color-gray-600);
  font-size: 16px;
  margin: 0 0 16px 0;
}

/* Product Header Card */
.product-header-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
  border: 2px solid var(--color-gray-200);
  transition: all 0.3s ease;
}

.product-header-card.out-of-stock-status {
  border-left: 6px solid var(--color-error);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.02) 0%, white 100%);
}

.product-header-card.low-stock-status {
  border-left: 6px solid var(--color-orange);
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.02) 0%, white 100%);
}

.product-header-card.in-stock-status {
  border-left: 6px solid var(--color-success);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, white 100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.product-title-section {
  flex: 1;
  min-width: 0;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 12px 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.category-badge {
  background: var(--color-orange-light);
  color: var(--color-orange);
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge :deep(svg) {
  width: 14px;
  height: 14px;
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

.in-stock-badge {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.product-price-section {
  text-align: right;
  flex-shrink: 0;
}

.price-label {
  display: block;
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 8px;
  font-weight: 500;
}

.price-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary-red);
  line-height: 1;
}

.product-description {
  font-size: 16px;
  color: var(--color-gray-700);
  line-height: 1.6;
  margin: 0;
  padding-top: 20px;
  border-top: 1px solid var(--color-gray-200);
}

/* Information Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-gray-200);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stock-card.out-of-stock-status {
  border-left: 4px solid var(--color-error);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.02) 0%, white 100%);
}

.stock-card.low-stock-status {
  border-left: 4px solid var(--color-orange);
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.02) 0%, white 100%);
}

.stock-card.in-stock-status {
  border-left: 4px solid var(--color-success);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, white 100%);
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.card-icon :deep(svg) {
  width: 28px;
  height: 28px;
  color: var(--color-gray-700);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 20px 0;
}

.card-content {
  display: flex;
  flex-direction: column;
}

/* Stock Details */
.stock-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-gray-200);
}

.stock-item:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.stock-label {
  font-size: 14px;
  color: var(--color-gray-600);
  font-weight: 500;
}

.stock-value {
  font-size: 18px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  background: var(--color-gray-100);
  color: var(--color-gray-900);
}

.stock-value.out-of-stock {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.stock-value.low-stock {
  background: rgba(249, 115, 22, 0.1);
  color: var(--color-orange);
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.stock-value.normal-stock {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.stock-progress {
  margin-top: 8px;
}

.progress-bar {
  height: 8px;
  background: var(--color-gray-200);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.progress-fill.out-of-stock-status {
  background: var(--color-error);
}

.progress-fill.low-stock-status {
  background: var(--color-orange);
}

.progress-fill.in-stock-status {
  background: var(--color-success);
}

.progress-text {
  font-size: 12px;
  color: var(--color-gray-600);
  font-weight: 500;
}

/* Details List */
.details-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-gray-200);
}

.detail-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-label {
  font-size: 14px;
  color: var(--color-gray-600);
  font-weight: 500;
}

.detail-value {
  font-size: 15px;
  color: var(--color-gray-900);
  font-weight: 600;
  text-align: right;
}

.detail-value.sku-value {
  font-family: monospace;
  background: var(--color-gray-100);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
}

.detail-value.price-value {
  color: var(--color-primary-red);
  font-weight: 700;
}

.notification {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2000;
  min-width: 300px;
  max-width: 400px;
}

.notification-success {
  background: var(--color-success);
  color: white;
}

.notification-error {
  background: var(--color-error);
  color: white;
}

.notification-warning {
  background: var(--color-warning);
  color: white;
}

.notification-info {
  background: var(--color-info);
  color: white;
}

.notification-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-view-page {
    padding: 0 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .header-actions .app-button {
    width: 100%;
    justify-content: center;
  }
  
  .product-header-card {
    padding: 24px 20px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .header-content {
    flex-direction: column;
  }
  
  .product-price-section {
    text-align: left;
    width: 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .notification {
    right: 10px;
    left: 10px;
    min-width: auto;
  }
}
</style>
