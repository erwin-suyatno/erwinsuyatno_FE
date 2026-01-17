<template>
  <div class="app-table-wrapper">
    <table class="app-table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="{ sortable: column.sortable, 'no-sort': !column.sortable }"
            @click="column.sortable && handleSort(column.key)"
          >
            <div class="th-content">
              <span>{{ column.label }}</span>
              <span
                v-if="column.sortable"
                class="sort-icon"
                :class="getSortClass(column.key)"
              >
                <span v-if="sortBy !== column.key || !sortBy">⇅</span>
                <span v-else-if="sortOrder === 'asc'">↑</span>
                <span v-else-if="sortOrder === 'desc'">↓</span>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="getRowKey(row, rowIndex)" class="table-row">
          <td
            v-for="column in columns"
            :key="column.key"
            :class="column.cellClass"
          >
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :value="row[column.key]"
              :column="column"
            >
              <!-- Default cell rendering -->
              <span v-if="column.formatter">
                {{ column.formatter(row[column.key], row) }}
              </span>
              <span v-else>
                {{ row[column.key] || '-' }}
              </span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (columns) => {
      return columns.every(col => col.key && col.label)
    }
  },
  data: {
    type: Array,
    required: true
  },
  sortBy: {
    type: String,
    default: null
  },
  sortOrder: {
    type: String,
    default: null,
    validator: (value) => value === null || ['asc', 'desc'].includes(value)
  },
  rowKey: {
    type: [String, Function],
    default: 'id'
  }
})

const emit = defineEmits(['sort'])

const getRowKey = (row, index) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }
  return row[props.rowKey] || index
}

const handleSort = (column) => {
  let newColumn = column
  let newOrder = 'asc'
  
  // If clicking the same column, cycle through: asc -> desc -> null
  if (props.sortBy === column) {
    if (props.sortOrder === 'asc') {
      newOrder = 'desc'
    } else if (props.sortOrder === 'desc') {
      // Reset to no sort
      newColumn = null
      newOrder = null
    }
  }
  // If clicking different column, start with ascending
  else {
    newOrder = 'asc'
  }
  
  emit('sort', {
    column: newColumn,
    order: newOrder
  })
}

const getSortClass = (column) => {
  // Only show active sort if column matches and sortOrder is not null
  if (props.sortBy === column && props.sortOrder !== null) {
    return {
      'sort-active': true,
      [`sort-${props.sortOrder}`]: true
    }
  }
  return {}
}
</script>

<style scoped>
.app-table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.app-table {
  width: 100%;
  border-collapse: collapse;
}

.app-table thead {
  background: var(--color-gray-50);
  border-bottom: 2px solid var(--color-gray-200);
}

.app-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: var(--color-gray-700);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Sortable header styles */
.th-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: default;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
  position: relative;
}

.sortable:hover {
  background: var(--color-gray-100);
}

.no-sort {
  cursor: default;
}

.sort-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--color-gray-400);
  transition: color 0.2s;
  min-width: 20px;
}

.sortable:hover .sort-icon {
  color: var(--color-gray-600);
}

.sort-icon.sort-active {
  color: var(--color-primary-red);
}

.sort-icon.sort-asc,
.sort-icon.sort-desc {
  color: var(--color-primary-red);
  font-weight: bold;
}

.app-table tbody tr {
  border-bottom: 1px solid var(--color-gray-200);
  transition: background 0.2s;
  position: relative;
}

.app-table tbody tr:hover {
  background: var(--color-gray-50);
}

/* Row highlighting for out of stock */
.app-table tbody tr:has(.out-of-stock) {
  background: rgba(239, 68, 68, 0.03);
  border-left: 3px solid var(--color-error);
}

.app-table tbody tr:has(.out-of-stock):hover {
  background: rgba(239, 68, 68, 0.08);
}

/* Row highlighting for low stock */
.app-table tbody tr:has(.low-stock):not(:has(.out-of-stock)) {
  background: rgba(249, 115, 22, 0.03);
  border-left: 3px solid var(--color-orange);
}

.app-table tbody tr:has(.low-stock):not(:has(.out-of-stock)):hover {
  background: rgba(249, 115, 22, 0.08);
}

.app-table td {
  padding: 16px;
  font-size: 14px;
  color: var(--color-gray-900);
}

@media (max-width: 1024px) {
  .app-table {
    font-size: 13px;
  }
  
  .app-table th,
  .app-table td {
    padding: 12px;
  }
  
  .sort-icon {
    font-size: 14px;
  }
}
</style>
