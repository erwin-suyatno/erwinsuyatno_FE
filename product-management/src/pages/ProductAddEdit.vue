<template>
  <div class="product-add-edit-page">
    <div class="page-header">
      <AppButton variant="outline" @click="goBack" :title="'Go back to product list'">
        <AppIcon name="arrow-left" size="small" />
        <span>Back</span>
      </AppButton>
      <h1 class="page-title">{{ isEditMode ? 'Edit Product' : 'Create Product' }}</h1>
    </div>

    <!-- Loading State (only for edit mode) -->
    <div v-if="isEditMode && productStore.isLoading && !product" class="loading-container">
      <SkeletonCard />
    </div>

    <!-- Error State (only for edit mode) -->
    <div v-else-if="isEditMode && productStore.isLoading === false && !product" class="error-container">
      <p>Product not found</p>
      <AppButton @click="goBack">Go Back</AppButton>
    </div>

    <!-- Form Content -->
    <div v-else class="page-content">
      <ProductForm 
        :product="product" 
        @submit="handleSubmit" 
        @cancel="goBack" 
      />
    </div>

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
import { defineAsyncComponent } from 'vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'

// Lazy load ProductForm for better performance
const ProductForm = defineAsyncComponent({
  loader: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(import('@/components/product/ProductForm.vue'))
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

// Determine if we're in edit mode (has id in route params)
const isEditMode = computed(() => {
  return !!route.params.id
})

// Load product data if in edit mode
onMounted(async () => {
  if (isEditMode.value) {
    const loadedProduct = await productStore.getProduct(route.params.id)
    product.value = loadedProduct
    
    // Update route meta with product name for breadcrumb
    if (loadedProduct) {
      route.meta.productName = loadedProduct.name
    }
  }
})

const goBack = () => {
  router.push('/products')
}

const handleSubmit = (formData) => {
  try {
    if (isEditMode.value) {
      // Update existing product
      productStore.updateProduct(route.params.id, formData)
      uiStore.showSuccess('Product updated successfully!')
    } else {
      // Create new product
      productStore.createProduct(formData)
      uiStore.showSuccess('Product created successfully!')
    }
    
    setTimeout(() => {
      router.push('/products')
    }, 500)
  } catch (error) {
    uiStore.showError(isEditMode.value ? 'Failed to update product' : 'Failed to create product')
  }
}
</script>

<style scoped>
.product-add-edit-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.error-container p {
  color: var(--color-error);
  font-size: 16px;
}

.page-content {
  background: var(--color-gray-50);
  padding: 0;
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

@media (max-width: 768px) {
  .product-add-edit-page {
    padding: 0 16px;
  }
  
  .notification {
    right: 10px;
    left: 10px;
    min-width: auto;
  }
}
</style>
