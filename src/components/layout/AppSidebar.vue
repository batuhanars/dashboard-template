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
      'border-sidebar-border bg-sidebar flex flex-col border-r transition-all duration-300',
      sidebarCollapsed ? 'w-16' : 'w-60',
    ]"
  >
    <!-- Logo -->
    <div
      class="border-sidebar-border flex h-16 shrink-0 items-center border-b px-4"
      :class="sidebarCollapsed ? 'justify-center' : 'gap-2'"
    >
      <div class="bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
        <span class="text-primary-foreground text-sm font-bold">D</span>
      </div>
      <span v-if="!sidebarCollapsed" class="text-sidebar-foreground truncate text-sm font-semibold">
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
    <div class="border-sidebar-border shrink-0 border-t p-2">
      <button
        :title="t('layout.toggleSidebar')"
        class="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-center rounded-md p-2 transition-colors"
        @click="ui.toggleSidebar()"
      >
        <ChevronLeft v-if="!sidebarCollapsed" class="size-5" />
        <ChevronRight v-else class="size-5" />
      </button>
    </div>
  </div>
</template>
