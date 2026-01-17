<template>
  <div class="product-list-page">
    <div class="page-header">
      <h1 class="page-title">Products</h1>
      <AppButton @click="goToCreate" :title="'Create new product'">
        <AppIcon name="plus" size="small" />
        <span>Create Product</span>
      </AppButton>
    </div>

    <!-- Search and Filter Bar -->
    <SearchBar
      v-if="!productStore.isLoading || productStore.products.length > 0"
      @search="handleSearch"
      @toggle-filter="toggleFilterDrawer"
    />

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="active-filters">
      <span class="filters-label">Active filters:</span>
      <div class="filter-tags">
        <span v-if="searchQuery" class="filter-tag">
          Search: "{{ searchQuery }}"
          <button @click="clearSearch">×</button>
        </span>
        <span v-if="activeFilters.categories.length > 0" class="filter-tag">
          Categories: {{ activeFilters.categories.join(', ') }}
          <button @click="clearCategoryFilter">×</button>
        </span>
        <span v-if="activeFilters.priceRange.min || activeFilters.priceRange.max" class="filter-tag">
          Price: {{ formatPriceRange(activeFilters.priceRange) }}
          <button @click="clearPriceFilter">×</button>
        </span>
        <span v-if="activeFilters.stock !== 'all'" class="filter-tag">
          Stock: {{ getStockLabel(activeFilters.stock) }}
          <button @click="clearStockFilter">×</button>
        </span>
        <button class="clear-all-filters" @click="clearAllFilters">
          Clear All
        </button>
      </div>
    </div>

    <!-- Loading State with Skeleton -->
    <div v-if="productStore.isLoading && productStore.products.length === 0" class="loading-container">
      <Transition name="fade" mode="out-in">
        <div>
          <!-- Desktop: Skeleton Table -->
          <div class="desktop-view">
            <SkeletonTable :rows="10" />
          </div>
          <!-- Mobile: Skeleton Cards (4 cards for best practice) -->
          <div class="mobile-view">
            <TransitionGroup name="skeleton-fade" tag="div" class="product-grid skeleton-grid">
              <SkeletonCard v-for="i in 4" :key="`skeleton-${i}`" />
            </TransitionGroup>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="empty-container">
      <AppEmpty
        :message="hasActiveFilters ? 'No products match your filters' : 'No products found'"
        :action-label="hasActiveFilters ? 'Clear filters' : 'Create your first product'"
        @action="hasActiveFilters ? clearAllFilters() : goToCreate()"
      />
    </div>

    <!-- Content with Lazy Loading -->
    <div v-else>
      <!-- Desktop: Table View -->
      <div class="desktop-view">
        <Suspense>
          <template #default>
            <ProductTable
              :products="paginatedProducts"
              :sort-by="sortBy"
              :sort-order="sortOrder"
              @view="handleView"
              @edit="handleEdit"
              @delete="handleDelete"
              @sort="handleSort"
            />
          </template>
          <template #fallback>
            <SkeletonTable :rows="10" />
          </template>
        </Suspense>
      </div>

      <!-- Mobile: Card View with Progressive Rendering -->
      <div class="mobile-view">
        <TransitionGroup name="card-fade" tag="div" class="product-grid">
              <ProductCard
                v-for="(product, index) in paginatedProducts"
                :key="product.id"
                :product="product"
                :style="{ '--index': index }"
                @view="handleView"
                @edit="handleEdit"
                @delete="handleDelete"
              />
        </TransitionGroup>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredProducts.length }} products
        </div>
        <div class="pagination-controls">
          <AppButton
            variant="outline"
            size="small"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            ← Previous
          </AppButton>
          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="['page-number', { active: page === currentPage }]"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          <AppButton
            variant="outline"
            size="small"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next →
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Filter Drawer -->
    <FilterDrawer
      :show="showFilterDrawer"
      @close="showFilterDrawer = false"
      @apply="handleApplyFilters"
      @clear="clearAllFilters"
    />

    <!-- Delete Modal -->
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product.store'
import { useUIStore } from '@/stores/ui.store'
import { defineAsyncComponent } from 'vue'
import { formatCurrency } from '@/utils/formatters'
import SearchBar from '@/components/product/SearchBar.vue'
import FilterDrawer from '@/components/product/FilterDrawer.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import SkeletonTable from '@/components/common/SkeletonTable.vue'
import ProductModal from '@/components/product/ProductModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppEmpty from '@/components/common/AppEmpty.vue'
import AppIcon from '@/components/common/AppIcon.vue'

// Lazy load components with delay simulation for progressive rendering
const ProductCard = defineAsyncComponent({
  loader: () => {
    return new Promise((resolve) => {
      // Simulate progressive loading with staggered delay
      setTimeout(() => {
        resolve(import('@/components/product/ProductCard.vue'))
      }, Math.random() * 150 + 50) // 50-200ms delay for progressive rendering
    })
  },
  delay: 0,
  timeout: 3000
})

const ProductTable = defineAsyncComponent({
  loader: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(import('@/components/product/ProductTable.vue'))
      }, Math.random() * 200 + 100)
    })
  },
  delay: 0,
  timeout: 3000
})

const router = useRouter()
const productStore = useProductStore()
const uiStore = useUIStore()

// Search and Filter State
const searchQuery = ref('')
const showFilterDrawer = ref(false)
const activeFilters = ref({
  categories: [],
  priceRange: {
    min: null,
    max: null
  },
  stock: 'all'
})

// Sort State (null = no sort, 'asc' = ascending, 'desc' = descending)
const sortBy = ref(null)
const sortOrder = ref(null)

const currentPage = ref(1)
const itemsPerPage = 5

// Filtered Products
const filteredProducts = computed(() => {
  // Start with products sorted by createdAt descending (newest first)
  let products = [...productStore.products].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.updatedAt || 0)
    const dateB = new Date(b.createdAt || b.updatedAt || 0)
    return dateB - dateA // Descending order (newest first)
  })

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    products = products.filter(product => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.sku && product.sku.toLowerCase().includes(query))
      )
    })
  }

  // Category filter
  if (activeFilters.value.categories.length > 0) {
    products = products.filter(product =>
      activeFilters.value.categories.includes(product.category)
    )
  }

  // Price range filter
  if (activeFilters.value.priceRange.min !== null) {
    products = products.filter(product =>
      product.price >= activeFilters.value.priceRange.min
    )
  }
  if (activeFilters.value.priceRange.max !== null) {
    products = products.filter(product =>
      product.price <= activeFilters.value.priceRange.max
    )
  }

  // Stock filter
  if (activeFilters.value.stock !== 'all') {
    products = products.filter(product => {
      switch (activeFilters.value.stock) {
        case 'in-stock':
          return product.stock > 0
        case 'low-stock':
          const minStock = product.minStock || 10
          return product.stock > 0 && product.stock < minStock
        case 'out-of-stock':
          return product.stock === 0
        default:
          return true
      }
    })
  }

  // Sort products (only if sortBy and sortOrder are set)
  // If no sort is applied, default to createdAt descending (newest first)
  if (sortBy.value && sortOrder.value) {
    products = [...products].sort((a, b) => {
      let aValue = a[sortBy.value]
      let bValue = b[sortBy.value]

      // Handle minStock default value
      if (sortBy.value === 'minStock') {
        aValue = aValue ?? 10
        bValue = bValue ?? 10
      }

      // Handle string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      // Handle null/undefined values (except for minStock which is already handled)
      if (sortBy.value !== 'minStock') {
        if (aValue == null) aValue = ''
        if (bValue == null) bValue = ''
      }

      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
  }
  // If no sort is applied, maintain createdAt descending order (already sorted above)

  return products
})

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    activeFilters.value.categories.length > 0 ||
    activeFilters.value.priceRange.min !== null ||
    activeFilters.value.priceRange.max !== null ||
    activeFilters.value.stock !== 'all'
  )
})

// Pagination
const totalProducts = computed(() => filteredProducts.value.length)
const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage
  return end > totalProducts.value ? totalProducts.value : end
})

const paginatedProducts = computed(() => {
  const start = startIndex.value
  const end = startIndex.value + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i)
      }
    } else if (currentPage.value >= totalPages.value - 2) {
      for (let i = totalPages.value - maxVisible + 1; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
        pages.push(i)
      }
    }
  }
  
  return pages
})

// Watch for filter changes and reset to page 1
watch([searchQuery, activeFilters, sortBy, sortOrder], () => {
  currentPage.value = 1
}, { deep: true })

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToCreate = () => {
  router.push('/products/create')
}

const handleView = (id) => {
  router.push(`/products/${id}`)
}

const handleEdit = (id) => {
  router.push(`/products/${id}/edit`)
}

const handleDelete = (id) => {
  uiStore.openDeleteModal(id)
}

const confirmDelete = () => {
  if (uiStore.deleteTargetId) {
    try {
      productStore.deleteProduct(uiStore.deleteTargetId)
      uiStore.hideDeleteModal()
      uiStore.showSuccess('Product deleted successfully!')
      
      if (paginatedProducts.value.length === 0 && currentPage.value > 1) {
        currentPage.value = currentPage.value - 1
      }
    } catch (error) {
      uiStore.showError('Failed to delete product')
    }
  }
}

// Search and Filter Handlers
const handleSearch = (query) => {
  searchQuery.value = query
}

const clearSearch = () => {
  searchQuery.value = ''
}

const toggleFilterDrawer = () => {
  showFilterDrawer.value = !showFilterDrawer.value
}

const handleApplyFilters = (filters) => {
  activeFilters.value = {
    categories: [...filters.categories],
    priceRange: {
      min: filters.priceRange.min,
      max: filters.priceRange.max
    },
    stock: filters.stock
  }
}

const clearAllFilters = () => {
  searchQuery.value = ''
  activeFilters.value = {
    categories: [],
    priceRange: {
      min: null,
      max: null
    },
    stock: 'all'
  }
  showFilterDrawer.value = false
}

const clearCategoryFilter = () => {
  activeFilters.value.categories = []
}

const clearPriceFilter = () => {
  activeFilters.value.priceRange = {
    min: null,
    max: null
  }
}

const clearStockFilter = () => {
  activeFilters.value.stock = 'all'
}

const formatPriceRange = (range) => {
  const min = range.min ? formatCurrency(range.min) : '0'
  const max = range.max ? formatCurrency(range.max) : '∞'
  return `${min} - ${max}`
}

const getStockLabel = (stock) => {
  const labels = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock'
  }
  return labels[stock] || stock
}

// Sort handler - supports 3 states: null (no sort) -> asc -> desc -> null
const handleSort = ({ column, order }) => {
  sortBy.value = column
  sortOrder.value = order
  // Pagination will auto-reset via watch
}
</script>

<style scoped>
.product-list-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
}

/* Active Filters */
.active-filters {
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filters-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-right: 12px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--color-primary-red-light);
  color: var(--color-primary-red);
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.filter-tag button {
  background: none;
  border: none;
  color: var(--color-primary-red);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.filter-tag button:hover {
  background: rgba(220, 38, 38, 0.2);
}

.clear-all-filters {
  padding: 6px 12px;
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-filters:hover {
  background: var(--color-gray-200);
  border-color: var(--color-gray-400);
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Desktop View */
.desktop-view {
  display: block;
}

/* Mobile View */
.mobile-view {
  display: none;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.skeleton-grid {
  /* Ensure skeleton cards match real cards */
  width: 100%;
}

.skeleton-wrapper {
  display: contents;
}

/* Skeleton fade transition - smooth fade out when data loads */
.skeleton-fade-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.skeleton-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.skeleton-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.skeleton-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.skeleton-fade-move {
  transition: transform 0.3s ease;
}

/* Card fade transition for progressive rendering */
.card-fade-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: calc(var(--index, 0) * 0.08s);
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.card-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.card-fade-move {
  transition: transform 0.4s ease;
}

/* Pagination */
.pagination-wrapper {
  margin-top: 32px;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  color: var(--color-gray-600);
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--color-gray-300);
  background: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover:not(.active) {
  background: var(--color-gray-50);
  border-color: var(--color-gray-400);
}

.page-number.active {
  background: var(--color-primary-red);
  color: white;
  border-color: var(--color-primary-red);
}

/* Notification */
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

/* Responsive */
@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }
  
  .mobile-view {
    display: block;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-numbers {
    flex-wrap: wrap;
  }
  
  .notification {
    right: 10px;
    left: 10px;
    min-width: auto;
  }
  
  .filter-tags {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
