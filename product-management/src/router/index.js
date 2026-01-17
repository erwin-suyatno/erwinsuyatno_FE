import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: { 
          title: 'Dashboard',
          breadcrumbLabel: 'Dashboard'
        }
      },
      {
        path: 'products',
        name: 'ProductList',
        component: () => import('@/pages/ProductList.vue'),
        meta: { 
          title: 'Product List',
          breadcrumbLabel: 'Products'
        }
      },
      {
        path: 'products/create',
        name: 'ProductCreate',
        component: () => import('@/pages/ProductAddEdit.vue'),
        meta: { 
          title: 'Create Product',
          breadcrumbLabel: 'Create Product',
          breadcrumbParent: 'ProductList'
        }
      },
      {
        path: 'products/:id/edit',
        name: 'ProductEdit',
        component: () => import('@/pages/ProductAddEdit.vue'),
        meta: { 
          title: 'Edit Product',
          breadcrumbLabel: 'Edit Product',
          breadcrumbParent: 'ProductList'
        },
        props: true
      },
      {
        path: 'products/:id',
        name: 'ProductView',
        component: () => import('@/pages/ProductView.vue'),
        meta: { 
          title: 'Product Details',
          breadcrumbLabel: 'Product Details',
          breadcrumbParent: 'ProductList'
        },
        props: true
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: { title: '404 - Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
