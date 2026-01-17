<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <div class="header-actions">
        <AppButton variant="outline" @click="goToProducts">
          <AppIcon name="package" size="small" />
          <span>View All Products</span>
        </AppButton>
        <AppButton @click="goToCreate">
          <AppIcon name="plus" size="small" />
          <span>Create Product</span>
        </AppButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="productStore.isLoading && productStore.products.length === 0" class="loading-container">
      <div class="stats-grid">
        <SkeletonCard v-for="i in 4" :key="`stat-${i}`" />
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="dashboard-content">
      <!-- Statistics Cards -->
      <div class="stats-grid">
        <StatCard
          title="Total Products"
          :value="stats.totalProducts"
          icon="package"
          :trend="null"
          color="blue"
        />
        <StatCard
          title="Total Categories"
          :value="stats.totalCategories"
          icon="filter"
          :trend="null"
          color="orange"
        />
        <StatCard
          title="Low Stock Items"
          :value="stats.lowStockCount"
          icon="delete"
          :trend="null"
          color="red"
          :alert="stats.lowStockCount > 0"
        />
        <StatCard
          title="Total Inventory Value"
          :value="formatCurrency(stats.totalInventoryValue)"
          icon="package"
          :trend="null"
          color="green"
        />
      </div>

      <!-- Category Distribution - Full Width -->
      <div class="category-section">
        <div class="dashboard-card category-card">
          <div class="card-header-modern">
            <div class="header-content">
              <div class="header-icon-wrapper">
                <AppIcon name="filter" size="medium" />
              </div>
              <div>
                <h2 class="card-title-modern">Category Distribution</h2>
                <p class="card-subtitle">Products by category</p>
              </div>
            </div>
          </div>
          <div class="card-body-modern">
            <div v-if="categoryStats.length === 0" class="empty-state">
              <p>No categories available</p>
            </div>
            <div v-else class="category-list-modern">
              <div
                v-for="(category, index) in categoryStats"
                :key="category.name"
                class="category-item-modern"
                :style="{ '--delay': index * 0.05 + 's' }"
              >
                <div class="category-header-modern">
                  <div class="category-left">
                    <div 
                      class="category-dot" 
                      :style="{ backgroundColor: category.color }"
                    ></div>
                    <span class="category-name-modern">{{ category.name }}</span>
                  </div>
                  <div class="category-right">
                    <span class="category-count-modern">{{ category.count }}</span>
                    <span class="category-value-modern">{{ formatCurrency(category.totalValue) }}</span>
                  </div>
                </div>
                <div class="category-bar-modern">
                  <div
                    class="category-bar-fill-modern"
                    :style="{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Section - Full Width with 3 Cards in 1 Row -->
      <div class="sidebar-section">
        <!-- Low Stock Alerts -->
        <div class="dashboard-card alert-card-modern" :class="{ 'hidden-card': lowStockProducts.length === 0 }">
          <div class="card-header-modern">
              <div class="header-content">
                <div class="header-icon-wrapper alert-icon">
                  <AppIcon name="delete" size="medium" />
                </div>
                <div>
                  <h2 class="card-title-modern">Low Stock Alerts</h2>
                  <p class="card-subtitle">
                    {{ lowStockProducts.length > 0 ? `${lowStockProducts.length} items need attention` : 'All items in stock' }}
                  </p>
                </div>
              </div>
              <span v-if="lowStockProducts.length > 0" class="badge-modern">{{ lowStockProducts.length }}</span>
          </div>
          <div class="card-body-modern">
            <div v-if="lowStockProducts.length === 0" class="empty-state">
              <p>No low stock items</p>
            </div>
            <template v-else>
              <div class="alert-list-modern">
                <div
                  v-for="product in lowStockProducts.slice(0, 4)"
                  :key="product.id"
                  class="alert-item-modern"
                  @click="goToEdit(product.id)"
                >
                  <div class="alert-indicator"></div>
                  <div class="alert-content">
                    <span class="alert-product-name-modern">{{ product.name }}</span>
                    <span class="alert-stock-modern">{{ product.stock }} units left</span>
                  </div>
                  <AppIcon name="arrow-left" size="small" class="alert-arrow-modern" />
                </div>
              </div>
              <div v-if="lowStockProducts.length > 4" class="alert-footer-modern">
                <AppButton variant="outline" size="small" @click="goToProducts">
                  View All ({{ lowStockProducts.length }})
                </AppButton>
              </div>
            </template>
          </div>
        </div>

        <!-- Recent Products -->
        <div class="dashboard-card recent-card">
          <div class="card-header-modern">
            <div class="header-content">
              <div class="header-icon-wrapper">
                <AppIcon name="package" size="medium" />
              </div>
              <div>
                <h2 class="card-title-modern">Recent Products</h2>
                <p class="card-subtitle">Latest additions</p>
              </div>
            </div>
          </div>
          <div class="card-body-modern">
            <div v-if="recentProducts.length === 0" class="empty-state">
              <p>No recent products</p>
            </div>
            <div v-else class="recent-list-modern">
              <div
                v-for="product in recentProducts"
                :key="product.id"
                class="recent-item-modern"
                @click="goToEdit(product.id)"
              >
                <div class="recent-content">
                  <div class="recent-main">
                    <span class="recent-name-modern">{{ product.name }}</span>
                    <span class="recent-category-modern">{{ product.category }}</span>
                  </div>
                  <div class="recent-footer">
                    <span class="recent-price-modern">{{ formatCurrency(product.price) }}</span>
                    <span 
                      class="recent-stock-modern" 
                      :class="{ 'low-stock-modern': product.stock < (product.minStock || 10) }"
                    >
                      {{ product.stock }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="dashboard-card actions-card">
          <div class="card-header-modern">
            <div class="header-content">
              <div class="header-icon-wrapper">
                <AppIcon name="menu" size="medium" />
              </div>
              <div>
                <h2 class="card-title-modern">Quick Actions</h2>
                <p class="card-subtitle">Common tasks</p>
              </div>
            </div>
          </div>
          <div class="card-body-modern">
            <div class="actions-grid-modern">
              <button class="action-button-modern primary" @click="goToCreate">
                <div class="action-icon-wrapper">
                  <AppIcon name="plus" size="large" />
                </div>
                <span>Create Product</span>
              </button>
              <button class="action-button-modern" @click="goToProducts">
                <div class="action-icon-wrapper">
                  <AppIcon name="package" size="large" />
                </div>
                <span>View All</span>
              </button>
                <button 
                  class="action-button-modern alert" 
                  @click="goToProducts"
                >
                <div class="action-icon-wrapper">
                  <AppIcon name="delete" size="large" />
                </div>
                  <span>Low Stock</span>
                  <span v-if="lowStockProducts.length > 0" class="action-badge-modern">{{ lowStockProducts.length }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product.store'
import { formatCurrency } from '@/utils/formatters'
import StatCard from '@/components/dashboard/StatCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'

const router = useRouter()
const productStore = useProductStore()

// Category colors for visualization
const categoryColors = {
  Electronics: 'var(--color-primary-red)',
  Accessories: 'var(--color-orange)',
  Software: 'var(--color-primary-navy)',
  Hardware: '#10b981',
  Other: 'var(--color-gray-500)'
}

// Computed statistics
const stats = computed(() => {
  const products = productStore.products
  const categories = [...new Set(products.map(p => p.category))]
  const lowStock = products.filter(p => {
    const minStock = p.minStock || 10
    return p.stock < minStock
  })
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    lowStockCount: lowStock.length,
    totalInventoryValue: totalValue
  }
})

// Category statistics
const categoryStats = computed(() => {
  const products = productStore.products
  const categoryMap = {}

  products.forEach(product => {
    if (!categoryMap[product.category]) {
      categoryMap[product.category] = {
        name: product.category,
        count: 0,
        totalValue: 0,
        products: []
      }
    }
    categoryMap[product.category].count++
    categoryMap[product.category].totalValue += product.price * product.stock
    categoryMap[product.category].products.push(product)
  })

  const totalProducts = products.length
  const stats = Object.values(categoryMap).map(cat => ({
    ...cat,
    percentage: totalProducts > 0 ? (cat.count / totalProducts) * 100 : 0,
    color: categoryColors[cat.name] || categoryColors.Other
  }))

  return stats.sort((a, b) => b.count - a.count)
})

// Low stock products
const lowStockProducts = computed(() => {
  return productStore.lowStockProducts.sort((a, b) => a.stock - b.stock)
})

// Recent products (last 5) - already sorted by newest first in store
const recentProducts = computed(() => {
  return [...productStore.products].slice(0, 5)
})

// Navigation methods
const goToProducts = () => {
  router.push('/products')
}

const goToCreate = () => {
  router.push('/products/create')
}

const goToEdit = (id) => {
  router.push(`/products/${id}/edit`)
}

// Initialize data
onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
})
</script>

<style scoped>
.dashboard-page {
  padding: 20px 28px;
  max-width: 1600px;
  margin: 0 auto;
  background: var(--color-gray-50);
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions .app-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 500;
}

.loading-container {
  margin-top: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Category Section - Full Width */
.category-section {
  width: 100%;
}

/* Sidebar Section - Full Width with 3 Cards in 1 Row */
.sidebar-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.hidden-card {
  opacity: 0.6;
}

/* Modern Card Design */
.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--color-gray-200);
}

.dashboard-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.category-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
}

.alert-card-modern {
  border-top: 3px solid var(--color-error);
  background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
}

.recent-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
}

.actions-card {
  background: linear-gradient(135deg, #ffffff 0%, #fefce8 100%);
}

/* Modern Card Header */
.card-header-modern {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent);
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.header-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary-red), var(--color-orange));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
}

.header-icon-wrapper :deep(svg) {
  width: 20px;
  height: 20px;
  color: white;
}

.alert-icon {
  background: linear-gradient(135deg, var(--color-error), #f87171);
}

.card-title-modern {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 4px 0;
  letter-spacing: -0.3px;
}

.card-subtitle {
  font-size: 12px;
  color: var(--color-gray-500);
  margin: 0;
  font-weight: 400;
}

.badge-modern {
  background: linear-gradient(135deg, var(--color-error), #f87171);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}

.card-body-modern {
  padding: 24px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-gray-400);
  font-size: 14px;
}

/* Modern Category Distribution */
.category-list-modern {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-item-modern {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--color-gray-50);
  border-radius: 10px;
  border: 1px solid var(--color-gray-200);
  transition: all 0.3s ease;
  animation: slideIn 0.4s ease var(--delay, 0s) both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.category-item-modern:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

.category-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.category-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.category-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.category-name-modern {
  font-weight: 700;
  color: var(--color-gray-900);
  font-size: 14px;
  letter-spacing: -0.2px;
}

.category-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-count-modern {
  font-size: 13px;
  color: var(--color-gray-700);
  font-weight: 600;
  background: white;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--color-gray-300);
}

.category-value-modern {
  font-size: 13px;
  color: var(--color-gray-600);
  font-weight: 600;
}

.category-bar-modern {
  height: 8px;
  background: var(--color-gray-200);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.category-bar-fill-modern {
  height: 100%;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-bar-fill-modern::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Modern Low Stock Alerts */
.alert-list-modern {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alert-item-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(220, 38, 38, 0.2);
  position: relative;
  overflow: hidden;
}

.alert-item-modern::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--color-error);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.alert-item-modern:hover {
  background: rgba(220, 38, 38, 0.05);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
  border-color: var(--color-error);
}

.alert-item-modern:hover::before {
  transform: scaleY(1);
}

.alert-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-error);
  flex-shrink: 0;
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.alert-product-name-modern {
  font-weight: 700;
  color: var(--color-gray-900);
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alert-stock-modern {
  font-size: 12px;
  color: var(--color-error);
  font-weight: 700;
}

.alert-arrow-modern {
  color: var(--color-gray-400);
  transform: rotate(180deg);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.alert-item-modern:hover .alert-arrow-modern {
  color: var(--color-error);
  transform: rotate(180deg) translateX(4px);
}

.alert-footer-modern {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: center;
}

/* Modern Recent Products */
.recent-list-modern {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-item-modern {
  padding: 16px;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-gray-200);
}

.recent-item-modern:hover {
  background: var(--color-gray-50);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary-red);
}

.recent-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-name-modern {
  font-weight: 700;
  color: var(--color-gray-900);
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

.recent-category-modern {
  font-size: 12px;
  color: var(--color-gray-500);
  font-weight: 500;
}

.recent-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid var(--color-gray-200);
}

.recent-price-modern {
  font-size: 14px;
  color: var(--color-primary-red);
  font-weight: 700;
}

.recent-stock-modern {
  font-size: 12px;
  color: var(--color-gray-700);
  font-weight: 700;
  padding: 4px 10px;
  background: var(--color-gray-100);
  border-radius: 6px;
  white-space: nowrap;
}

.recent-stock-modern.low-stock-modern {
  color: var(--color-error);
  background: rgba(220, 38, 38, 0.1);
  font-weight: 700;
}

/* Modern Quick Actions */
.actions-grid-modern {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.action-button-modern {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: white;
  border: 2px solid var(--color-gray-200);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  text-align: left;
  width: 100%;
}

.action-button-modern:hover {
  background: var(--color-gray-50);
  border-color: var(--color-primary-red);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

.action-button-modern.primary {
  background: linear-gradient(135deg, var(--color-primary-red), var(--color-orange));
  border-color: var(--color-primary-red);
  color: white;
}

.action-button-modern.primary:hover {
  background: linear-gradient(135deg, var(--color-primary-red-hover), var(--color-orange-hover));
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
}

.action-button-modern.alert {
  border-color: var(--color-error);
}

.action-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.action-button-modern.primary .action-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

.action-button-modern:hover .action-icon-wrapper {
  background: var(--color-primary-red-light);
  transform: scale(1.1);
}

.action-button-modern.primary:hover .action-icon-wrapper {
  background: rgba(255, 255, 255, 0.3);
}

.action-button-modern :deep(svg) {
  width: 22px;
  height: 22px;
  color: var(--color-gray-700);
  transition: all 0.3s ease;
}

.action-button-modern.primary :deep(svg) {
  color: white;
}

.action-button-modern:hover :deep(svg) {
  color: var(--color-primary-red);
}

.action-button-modern.primary:hover :deep(svg) {
  color: white;
}

.action-button-modern span:not(.action-badge-modern) {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-900);
  flex: 1;
  letter-spacing: -0.2px;
}

.action-button-modern.primary span:not(.action-badge-modern) {
  color: white;
}

.action-badge-modern {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--color-error);
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .sidebar-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px 20px;
    background: white;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }
  
  .header-actions .app-button {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .dashboard-content {
    gap: 20px;
  }
  
  .sidebar-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .card-header-modern {
    padding: 16px 20px;
  }
  
  .card-body-modern {
    padding: 20px;
  }
  
  .header-icon-wrapper {
    width: 36px;
    height: 36px;
  }
  
  .card-title-modern {
    font-size: 15px;
  }
}
</style>
