import { LayoutDashboard, Users, Settings } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface SubNavItem {
  name: string
  labelKey: string
  path: string
}

export interface NavItem {
  name: string
  labelKey: string
  icon: Component
  path?: string
  children?: SubNavItem[]
}

export interface NavGroup {
  labelKey?: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    items: [
      { name: 'home', labelKey: 'nav.dashboard', icon: LayoutDashboard, path: '/' },
    ],
  },
  {
    labelKey: 'nav.group.management',
    items: [
      { name: 'users', labelKey: 'nav.users', icon: Users, path: '/users' },
      { name: 'settings', labelKey: 'nav.settings', icon: Settings, path: '/settings' },
    ],
  },
]

export const quickLinks: NavItem[] = navGroups.flatMap((g) => g.items)
