<template>
  <aside class="sidebar" :class="{ collapsed: uiStore.sidebarCollapsed }">
    <div class="sidebar-header">
      <h2 class="logo">erwinsuyatno</h2>
      <button @click="uiStore.toggleSidebar()" class="toggle-btn" :title="'Toggle sidebar'">
        <AppIcon name="menu" size="medium" />
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <router-link
        v-for="menuItem in navigationMenu"
        :key="menuItem.path"
        :to="menuItem.path"
        class="nav-item"
        :class="{ 
          active: isMenuActive(menuItem, $route.path),
          disabled: menuItem.disabled
        }"
        @click="!menuItem.disabled && uiStore.setActiveMenu(menuItem.name.toLowerCase())"
      >
        <AppIcon :name="menuItem.icon" size="medium" class="nav-icon" />
        <span class="nav-label">{{ menuItem.name }}</span>
        <span v-if="menuItem.badge" class="nav-badge">{{ menuItem.badge }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useUIStore } from '@/stores/ui.store'
import AppIcon from '@/components/common/AppIcon.vue'
import { navigationMenu, isMenuActive } from '@/navigation/index.js'

const uiStore = useUIStore()
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background-color: var(--color-navy);
  color: white;
  transition: width 0.3s ease;
  z-index: 100;
  overflow-y: auto;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin: 0;
}

.sidebar.collapsed .logo {
  display: none;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  gap: 12px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: var(--color-primary-red);
  color: white;
}

.nav-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  color: inherit;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background: var(--color-error);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
  line-height: 1.4;
}

.sidebar.collapsed .nav-label,
.sidebar.collapsed .nav-badge {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
}
</style>
