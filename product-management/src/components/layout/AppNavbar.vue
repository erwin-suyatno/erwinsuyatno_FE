<template>
  <header class="navbar">
    <div class="navbar-content">
      <div class="navbar-left">
        <button @click="uiStore.toggleSidebar()" class="menu-toggle" :title="'Toggle sidebar'">
          <AppIcon name="menu" size="medium" />
        </button>
        <h1 class="page-title">{{ pageTitle }}</h1>
      </div>
      <div class="navbar-right">
        <!-- Optional: User menu, notifications, etc. -->
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '@/stores/ui.store'
import AppIcon from '@/components/common/AppIcon.vue'

const route = useRoute()
const uiStore = useUIStore()

const pageTitle = computed(() => {
  return route.meta.title || 'Dashboard'
})
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: var(--color-gray-700);
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-toggle:hover {
  background: var(--color-gray-100);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 16px;
  }
  
  .page-title {
    font-size: 18px;
  }
}
</style>
