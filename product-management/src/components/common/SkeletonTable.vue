<template>
  <div class="skeleton-table-wrapper">
    <table class="skeleton-table">
      <thead>
        <tr>
          <th v-for="i in 6" :key="i" class="skeleton-header-cell"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row" class="skeleton-row">
          <td v-for="col in 6" :key="col">
            <div class="skeleton-cell" :class="getCellClass(col)"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  rows: {
    type: Number,
    default: 10
  }
})

const getCellClass = (col) => {
  const classes = {
    1: 'skeleton-name',
    2: 'skeleton-badge',
    3: 'skeleton-price',
    4: 'skeleton-stock',
    5: 'skeleton-sku',
    6: 'skeleton-actions'
  }
  return classes[col] || ''
}
</script>

<style scoped>
.skeleton-table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skeleton-table {
  width: 100%;
  border-collapse: collapse;
}

.skeleton-table thead {
  background: var(--color-gray-50);
  border-bottom: 2px solid var(--color-gray-200);
}

.skeleton-header-cell {
  padding: 16px;
  height: 20px;
}

.skeleton-row {
  border-bottom: 1px solid var(--color-gray-200);
}

.skeleton-row td {
  padding: 16px;
}

.skeleton-cell {
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 25%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-name {
  width: 200px;
  height: 40px;
}

.skeleton-badge {
  width: 100px;
  height: 24px;
  border-radius: 12px;
}

.skeleton-price {
  width: 120px;
}

.skeleton-stock {
  width: 60px;
}

.skeleton-sku {
  width: 100px;
}

.skeleton-actions {
  width: 150px;
  height: 32px;
  border-radius: 6px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 1024px) {
  .skeleton-header-cell,
  .skeleton-row td {
    padding: 12px;
  }
}
</style>
