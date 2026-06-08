import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { requiresAuth: true, titleKey: 'nav.dashboard' },
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/users/UsersListView.vue'),
          meta: { requiresAuth: true, titleKey: 'nav.users' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/SettingsView.vue'),
          meta: { requiresAuth: true, titleKey: 'nav.settings' },
        },
      ],
    },
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { requiresAuth: false },
        },
      ],
    },
  ],
})

export default router
