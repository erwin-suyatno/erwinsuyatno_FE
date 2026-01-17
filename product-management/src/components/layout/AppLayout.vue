<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="app-content" :class="{ 'sidebar-collapsed': uiStore.sidebarCollapsed }">
      <AppNavbar />
      <main class="main-content">
        <AppBreadcrumb />
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from '@/stores/ui.store'
import AppSidebar from './AppSidebar.vue'
import AppNavbar from './AppNavbar.vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'

const uiStore = useUIStore()
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.app-content {
  flex: 1;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
}

.app-content.sidebar-collapsed {
  margin-left: 64px;
}

.main-content {
  padding: 24px 32px;
}

@media (max-width: 768px) {
  .app-content {
    margin-left: 0;
  }
  
  .app-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>
