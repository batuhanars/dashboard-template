<script setup lang="ts">
import { LayoutDashboard, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Component } from 'vue'

interface NavItem {
  name: string
  labelKey: string
  icon: Component
  path: string
}

const route = useRoute()
const ui = useUiStore()
const { sidebarCollapsed } = storeToRefs(ui)
const { t } = useI18n()

const navItems: NavItem[] = [
  { name: 'home', labelKey: 'nav.dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'users', labelKey: 'nav.users', icon: Users, path: '/users' },
  { name: 'settings', labelKey: 'nav.settings', icon: Settings, path: '/settings' },
]

function isActive(item: NavItem): boolean {
  return route.name === item.name
}
</script>

<template>
  <div
    :class="[
      'flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
      sidebarCollapsed ? 'w-16' : 'w-60',
    ]"
  >
    <!-- Logo -->
    <div
      class="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4"
      :class="sidebarCollapsed ? 'justify-center' : 'gap-2'"
    >
      <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
        <span class="text-sm font-bold text-primary-foreground">D</span>
      </div>
      <span
        v-if="!sidebarCollapsed"
        class="truncate text-sm font-semibold text-sidebar-foreground"
      >
        Dashboard
      </span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 space-y-0.5 p-2">
      <TooltipProvider :delay-duration="300">
        <template v-for="item in navItems" :key="item.name">
          <template v-if="sidebarCollapsed">
            <Tooltip>
              <TooltipTrigger as-child>
                <RouterLink
                  :to="item.path"
                  :class="[
                    'flex items-center justify-center rounded-md p-2 transition-colors',
                    isActive(item)
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  ]"
                >
                  <component :is="item.icon" class="size-5 shrink-0" />
                </RouterLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                {{ t(item.labelKey) }}
              </TooltipContent>
            </Tooltip>
          </template>

          <RouterLink
            v-else
            :to="item.path"
            :class="[
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              isActive(item)
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            ]"
          >
            <component :is="item.icon" class="size-5 shrink-0" />
            <span class="truncate">{{ t(item.labelKey) }}</span>
          </RouterLink>
        </template>
      </TooltipProvider>
    </nav>

    <!-- Collapse toggle -->
    <div class="shrink-0 border-t border-sidebar-border p-2">
      <button
        :title="t('layout.toggleSidebar')"
        class="flex w-full items-center justify-center rounded-md p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        @click="ui.toggleSidebar()"
      >
        <ChevronLeft v-if="!sidebarCollapsed" class="size-5" />
        <ChevronRight v-else class="size-5" />
      </button>
    </div>
  </div>
</template>
