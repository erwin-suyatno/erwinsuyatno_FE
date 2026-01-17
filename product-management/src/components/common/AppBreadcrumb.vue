<template>
  <nav v-if="breadcrumbs.length > 0 && route.name !== 'NotFound'" class="app-breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <router-link
          v-if="crumb.to"
          :to="crumb.to"
          class="breadcrumb-link"
        >
          <span>{{ crumb.label }}</span>
        </router-link>
        <span v-else class="breadcrumb-current">
          <AppIcon v-if="index === 0 && (crumb.label === 'Dashboard' || crumb.label === 'Products')" name="home" size="small" class="breadcrumb-icon" />
          <span>{{ crumb.label }}</span>
        </span>
        <AppIcon
          v-if="index < breadcrumbs.length - 1"
          name="arrow-right"
          size="small"
          class="breadcrumb-separator"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'

const route = useRoute()

const breadcrumbs = computed(() => {
  const crumbs = []
  
  // Get current route name
  const currentRouteName = route.name
  
  // Handle different routes
  if (currentRouteName === 'Dashboard') {
    // Dashboard is a main page, only show Dashboard
    crumbs.push({
      label: 'Dashboard',
      to: null
    })
    return crumbs
  }
  
  if (currentRouteName === 'ProductList') {
    // Products is a main page, only show Products
    crumbs.push({
      label: 'Products',
      to: null
    })
    return crumbs
  }
  
  if (currentRouteName === 'ProductCreate') {
    // Create Product is a sub-page of Products
    crumbs.push({
      label: 'Products',
      to: '/products'
    })
    crumbs.push({
      label: 'Create Product',
      to: null
    })
    return crumbs
  }
  
  if (currentRouteName === 'ProductView') {
    // Product View is a sub-page of Products
    crumbs.push({
      label: 'Products',
      to: '/products'
    })
    
    // Get product name from route meta or use default
    const productName = route.meta?.productName || 'Product Details'
    
    crumbs.push({
      label: productName,
      to: null
    })
    
    return crumbs
  }
  
  if (currentRouteName === 'ProductEdit') {
    // Product Edit is a sub-page of Products
    crumbs.push({
      label: 'Products',
      to: '/products'
    })
    
    // Get product name from route meta or use default
    const productName = route.meta?.productName || 'Product'
    
    crumbs.push({
      label: productName,
      to: null
    })
    
    crumbs.push({
      label: 'Edit',
      to: null
    })
    
    return crumbs
  }
  
  // Fallback: use route meta
  const meta = route.meta || {}
  if (meta.breadcrumbLabel || meta.title) {
    crumbs.push({
      label: meta.breadcrumbLabel || meta.title,
      to: null
    })
  }
  
  return crumbs
})
</script>

<style scoped>
.app-breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-gray-600);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-primary-red);
  background: var(--color-gray-100);
}

.breadcrumb-current {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-gray-900);
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
}

.breadcrumb-icon {
  color: var(--color-gray-500);
}

.breadcrumb-link:hover .breadcrumb-icon {
  color: var(--color-primary-red);
}

.breadcrumb-separator {
  color: var(--color-gray-400);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .breadcrumb-list {
    font-size: 12px;
    gap: 6px;
  }
  
  .breadcrumb-link,
  .breadcrumb-current {
    padding: 2px 6px;
    font-size: 12px;
  }
  
  .breadcrumb-separator {
    width: 14px;
    height: 14px;
  }
}
</style>
