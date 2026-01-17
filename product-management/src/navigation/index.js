/**
 * Navigation Menu Configuration
 * 
 * This file contains the configuration for all sidebar menu items.
 * To add a new menu item, simply add a new object to the navigationMenu array.
 * 
 * Menu Item Structure:
 * {
 *   path: string,              // Route path (required)
 *   name: string,              // Display name (required)
 *   icon: string,              // Icon name from AppIcon component (required)
 *   activePaths: string[],     // Array of paths that should make this menu active (required)
 *   badge?: number,            // Optional badge count (e.g., notifications, low stock items)
 *   disabled?: boolean,        // Optional: disable the menu item (default: false)
 *   children?: MenuItem[]      // Optional: submenu items (for future expansion)
 * }
 * 
 * Available Icons:
 * - 'home' or 'dashboard' - Home/Dashboard icon
 * - 'package' or 'box' - Package/Box icon
 * - 'edit' - Edit icon
 * - 'delete' or 'trash' - Delete/Trash icon
 * - 'filter' - Filter icon
 * - 'search' - Search icon
 * - 'plus' or 'add' - Plus/Add icon
 * - 'menu' or 'hamburger' - Menu icon
 * - 'arrow-left' or 'back' - Back arrow icon
 * - 'close' or 'x' - Close icon
 * 
 */

export const navigationMenu = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'home',
    activePaths: ['/dashboard']
  },
  {
    path: '/products',
    name: 'Products',
    icon: 'package',
    activePaths: ['/products']
  }
]

/**
 * Helper function to check if a menu item is active based on current route
 * @param {Object} menuItem - Menu item configuration
 * @param {string} currentPath - Current route path
 * @returns {boolean}
 */
export const isMenuActive = (menuItem, currentPath) => {
  if (!menuItem.activePaths || menuItem.activePaths.length === 0) {
    return false
  }
  
  return menuItem.activePaths.some(activePath => {
    // Exact match
    if (activePath === currentPath) {
      return true
    }
    // Starts with match (for nested routes)
    if (currentPath.startsWith(activePath) && activePath !== '/') {
      return true
    }
    return false
  })
}

/**
 * Helper function to get menu item by path
 * @param {string} path - Route path
 * @returns {Object|null}
 */
export const getMenuItemByPath = (path) => {
  return navigationMenu.find(item => item.path === path) || null
}
