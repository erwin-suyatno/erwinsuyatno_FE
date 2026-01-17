import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    sidebarCollapsed: false,
    activeMenu: 'products',
    showDeleteModal: false,
    deleteTargetId: null,
    notification: {
      show: false,
      message: '',
      type: 'info'
    }
  }),

  getters: {
    isSidebarOpen: (state) => !state.sidebarCollapsed,
    isNotificationVisible: (state) => state.notification.show
  },

  actions: {
    // Sidebar
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    openSidebar() {
      this.sidebarCollapsed = false
    },

    closeSidebar() {
      this.sidebarCollapsed = true
    },

    // Menu
    setActiveMenu(menu) {
      this.activeMenu = menu
    },

    // Delete Modal
    openDeleteModal(id) {
      this.deleteTargetId = id
      this.showDeleteModal = true
    },

    hideDeleteModal() {
      this.showDeleteModal = false
      this.deleteTargetId = null
    },

    // Notifications
    showNotification(message, type = 'info') {
      this.notification = {
        show: true,
        message,
        type
      }

      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.hideNotification()
      }, 3000)
    },

    hideNotification() {
      this.notification.show = false
    },

    // Success notification shortcut
    showSuccess(message) {
      this.showNotification(message, 'success')
    },

    // Error notification shortcut
    showError(message) {
      this.showNotification(message, 'error')
    },

    // Warning notification shortcut
    showWarning(message) {
      this.showNotification(message, 'warning')
    },

    // Info notification shortcut
    showInfo(message) {
      this.showNotification(message, 'info')
    }
  }
})
