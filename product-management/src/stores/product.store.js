import { defineStore } from 'pinia'

// Dummy data - 20 products with various stock levels
const dummyProducts = [
  // Normal Stock Products (stock >= minStock)
  {
    id: '1',
    name: 'Laptop Pro 15"',
    description: 'High-performance laptop for professionals',
    price: 15000000,
    stock: 25,
    minStock: 10,
    category: 'Electronics',
    sku: 'LAP-PRO-15-001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 250000,
    stock: 150,
    minStock: 50,
    category: 'Accessories',
    sku: 'MOU-WLS-001',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    price: 1200000,
    stock: 45,
    minStock: 20,
    category: 'Accessories',
    sku: 'KEY-MEC-RGB-001',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    name: '4K Monitor 27"',
    description: 'Ultra HD monitor with HDR support',
    price: 5000000,
    stock: 30,
    minStock: 15,
    category: 'Electronics',
    sku: 'MON-4K-27-001',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: '5',
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub with HDMI and SD card reader',
    price: 450000,
    stock: 80,
    minStock: 30,
    category: 'Accessories',
    sku: 'HUB-USBC-001',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  },
  {
    id: '6',
    name: 'Gaming Headset',
    description: '7.1 Surround sound gaming headset with RGB lighting',
    price: 2500000,
    stock: 60,
    minStock: 25,
    category: 'Accessories',
    sku: 'HS-GAM-7.1-001',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '7',
    name: 'SSD 1TB NVMe',
    description: 'High-speed NVMe SSD for gaming and professional use',
    price: 2000000,
    stock: 100,
    minStock: 40,
    category: 'Hardware',
    sku: 'SSD-NVME-1TB-001',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  },
  {
    id: '8',
    name: 'Webcam HD 1080p',
    description: 'Professional webcam with auto-focus and noise cancellation',
    price: 1500000,
    stock: 75,
    minStock: 30,
    category: 'Accessories',
    sku: 'CAM-HD-1080-001',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  },
  // Low Stock Products (stock < minStock but > 0)
  {
    id: '9',
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with noise cancellation',
    price: 1800000,
    stock: 5,
    minStock: 15,
    category: 'Accessories',
    sku: 'EAR-WLS-TWS-001',
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z'
  },
  {
    id: '10',
    name: 'Tablet 10"',
    description: '10-inch Android tablet with stylus support',
    price: 8000000,
    stock: 8,
    minStock: 20,
    category: 'Electronics',
    sku: 'TAB-10-AND-001',
    createdAt: '2024-01-24T10:00:00Z',
    updatedAt: '2024-01-24T10:00:00Z'
  },
  {
    id: '11',
    name: 'RAM 16GB DDR4',
    description: 'High-performance DDR4 RAM module',
    price: 1200000,
    stock: 3,
    minStock: 10,
    category: 'Hardware',
    sku: 'RAM-DDR4-16GB-001',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: '12',
    name: 'Graphics Card RTX 4060',
    description: 'NVIDIA RTX 4060 for gaming and content creation',
    price: 12000000,
    stock: 2,
    minStock: 5,
    category: 'Hardware',
    sku: 'GPU-RTX-4060-001',
    createdAt: '2024-01-26T10:00:00Z',
    updatedAt: '2024-01-26T10:00:00Z'
  },
  {
    id: '13',
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor',
    price: 3500000,
    stock: 7,
    minStock: 12,
    category: 'Electronics',
    sku: 'WAT-SMT-FIT-001',
    createdAt: '2024-01-27T10:00:00Z',
    updatedAt: '2024-01-27T10:00:00Z'
  },
  {
    id: '14',
    name: 'External Hard Drive 2TB',
    description: 'Portable external hard drive USB 3.0',
    price: 1800000,
    stock: 4,
    minStock: 15,
    category: 'Hardware',
    sku: 'HDD-EXT-2TB-001',
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z'
  },
  {
    id: '15',
    name: 'Office Suite License',
    description: 'Professional office software suite license',
    price: 2500000,
    stock: 9,
    minStock: 20,
    category: 'Software',
    sku: 'SW-OFF-SUITE-001',
    createdAt: '2024-01-29T10:00:00Z',
    updatedAt: '2024-01-29T10:00:00Z'
  },
  {
    id: '16',
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand for ergonomic setup',
    price: 450000,
    stock: 6,
    minStock: 12,
    category: 'Accessories',
    sku: 'STA-LAP-ADJ-001',
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-01-30T10:00:00Z'
  },
  // Out of Stock Products (stock = 0)
  {
    id: '17',
    name: 'Gaming Mouse Pad',
    description: 'Large RGB gaming mouse pad with smooth surface',
    price: 350000,
    stock: 0,
    minStock: 10,
    category: 'Accessories',
    sku: 'PAD-GAM-RGB-001',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: '18',
    name: 'Laptop Charger 65W',
    description: 'Universal laptop charger with multiple tips',
    price: 550000,
    stock: 0,
    minStock: 8,
    category: 'Accessories',
    sku: 'CHG-LAP-65W-001',
    createdAt: '2024-02-02T10:00:00Z',
    updatedAt: '2024-02-02T10:00:00Z'
  },
  {
    id: '19',
    name: 'Anti-Virus Software',
    description: 'Premium antivirus software 1-year license',
    price: 800000,
    stock: 0,
    minStock: 5,
    category: 'Software',
    sku: 'SW-AV-PREM-001',
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-03T10:00:00Z'
  },
  {
    id: '20',
    name: 'USB Flash Drive 64GB',
    description: 'High-speed USB 3.0 flash drive',
    price: 200000,
    stock: 0,
    minStock: 20,
    category: 'Accessories',
    sku: 'USB-FLASH-64GB-001',
    createdAt: '2024-02-04T10:00:00Z',
    updatedAt: '2024-02-04T10:00:00Z'
  }
]

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    selectedProduct: null,
    isLoading: false
  }),

  getters: {
    getProductById: (state) => {
      return (id) => {
        return state.products.find(product => product.id === id)
      }
    },
    
    getProductsByCategory: (state) => {
      return (category) => {
        return state.products.filter(product => product.category === category)
      }
    },
    
    totalProducts: (state) => state.products.length,
    
    lowStockProducts: (state) => {
      return state.products.filter(product => {
        const minStock = product.minStock || 10 // Default to 10 if minStock is not set
        return product.stock < minStock
      })
    }
  },

  actions: {
    // Initialize with dummy data
    fetchProducts() {
      this.isLoading = true
      // Simulate API call with random delay between 0.5-1 second
      const delay = Math.random() * 500 + 500 // 500ms to 1000ms
      setTimeout(() => {
        // Sort by createdAt descending (newest first)
        const sortedProducts = [...dummyProducts].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.updatedAt || 0)
          const dateB = new Date(b.createdAt || b.updatedAt || 0)
          return dateB - dateA // Descending order (newest first)
        })
        this.products = sortedProducts
        this.isLoading = false
      }, delay)
    },

    // Get single product by ID
    getProduct(id) {
      this.isLoading = true
      // Simulate API call with random delay
      const delay = Math.random() * 300 + 300 // 300ms to 600ms
      return new Promise((resolve) => {
        setTimeout(() => {
          const product = this.products.find(p => p.id === id)
          this.selectedProduct = product || null
          this.isLoading = false
          resolve(product)
        }, delay)
      })
    },

    // Create new product
    createProduct(productData) {
      this.isLoading = true
      
      const newProduct = {
        ...productData,
        id: Date.now().toString(), // Simple ID generation
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Add new product at the beginning (newest first)
      this.products.unshift(newProduct)
      this.isLoading = false
      
      return newProduct
    },

    // Update existing product
    updateProduct(id, productData) {
      this.isLoading = true
      
      const index = this.products.findIndex(p => p.id === id)
      
      if (index === -1) {
        this.isLoading = false
        throw new Error('Product not found')
      }
      
      this.products[index] = {
        ...this.products[index],
        ...productData,
        updatedAt: new Date().toISOString()
      }
      
      // Update selected product if it's the one being edited
      if (this.selectedProduct?.id === id) {
        this.selectedProduct = this.products[index]
      }
      
      this.isLoading = false
      
      return this.products[index]
    },

    // Delete product
    deleteProduct(id) {
      this.isLoading = true
      
      const index = this.products.findIndex(p => p.id === id)
      
      if (index === -1) {
        this.isLoading = false
        throw new Error('Product not found')
      }
      
      this.products.splice(index, 1)
      
      // Clear selected product if it was deleted
      if (this.selectedProduct?.id === id) {
        this.selectedProduct = null
      }
      
      this.isLoading = false
    },

    // Clear selected product
    clearSelectedProduct() {
      this.selectedProduct = null
    }
  }
})
