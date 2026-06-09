<script setup lang="ts">
import {
  LayoutDashboard, Users, Settings,
  PanelLeft, PanelLeftClose, ChevronDown,
} from 'lucide-vue-next'
import type { Component } from 'vue'

interface SubNavItem {
  name: string
  labelKey: string
  path: string
}

interface NavItem {
  name: string
  labelKey: string
  icon: Component
  path?: string
  children?: SubNavItem[]
}

interface NavGroup {
  labelKey?: string
  items: NavItem[]
}

const route = useRoute()
const ui = useUiStore()
const { sidebarCollapsed } = storeToRefs(ui)
const { t } = useI18n()

const navGroups: NavGroup[] = [
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

// Expanded accordion items
const expandedItems = ref<Set<string>>(new Set())

function toggleExpand(name: string) {
  if (expandedItems.value.has(name)) {
    expandedItems.value.delete(name)
  } else {
    expandedItems.value.add(name)
  }
}

function isExpanded(name: string): boolean {
  return expandedItems.value.has(name)
}

function isActive(name: string): boolean {
  return route.name === name
}

function isGroupActive(item: NavItem): boolean {
  if (item.name && isActive(item.name)) return true
  return item.children?.some((c) => isActive(c.name)) ?? false
}
</script>

<template>
  <div
    :class="[
      'border-sidebar-border bg-sidebar flex flex-col border-r transition-all duration-300',
      sidebarCollapsed ? 'w-16' : 'w-60',
    ]"
  >
    <!-- Logo + toggle -->
    <div
      class="border-sidebar-border flex h-16 shrink-0 items-center border-b px-3"
      :class="sidebarCollapsed ? 'justify-center' : 'gap-2.5'"
    >
      <template v-if="!sidebarCollapsed">
        <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-sm">
          <span class="text-primary-foreground text-sm font-bold">D</span>
        </div>
        <span class="text-sidebar-foreground flex-1 truncate text-sm font-bold tracking-tight">
          Dashboard
        </span>
      </template>
      <button
        :title="t('layout.toggleSidebar')"
        class="text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent flex size-7 shrink-0 items-center justify-center rounded-md transition-colors"
        @click="ui.toggleSidebar()"
      >
        <PanelLeftClose v-if="!sidebarCollapsed" class="size-4" />
        <PanelLeft v-else class="size-4" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto p-2">
      <TooltipProvider :delay-duration="300">
        <div
          v-for="(group, gi) in navGroups"
          :key="gi"
          :class="gi > 0 ? 'mt-4' : ''"
        >
          <!-- Group header (expanded sidebar only) -->
          <p
            v-if="group.labelKey && !sidebarCollapsed"
            class="text-muted-foreground mb-1 px-3 text-xs font-semibold uppercase tracking-widest"
          >
            {{ t(group.labelKey) }}
          </p>
          <!-- Group divider (collapsed sidebar) -->
          <div
            v-else-if="group.labelKey && sidebarCollapsed && gi > 0"
            class="border-sidebar-border mx-2 mb-2 border-t"
          />

          <div class="space-y-0.5">
            <template v-for="item in group.items" :key="item.name">

              <!-- ── Item WITH children (accordion) ── -->
              <template v-if="item.children?.length">
                <!-- Collapsed: show icon only with tooltip -->
                <template v-if="sidebarCollapsed">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button
                        :class="[
                          'flex w-full items-center justify-center rounded-lg p-2 transition-all duration-150',
                          isGroupActive(item)
                            ? 'bg-primary/10 text-primary'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        ]"
                        @click="toggleExpand(item.name)"
                      >
                        <component :is="item.icon" class="size-5 shrink-0" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{{ t(item.labelKey) }}</TooltipContent>
                  </Tooltip>
                </template>

                <!-- Expanded: parent button + children -->
                <template v-else>
                  <button
                    :class="[
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                      isGroupActive(item)
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    ]"
                    @click="toggleExpand(item.name)"
                  >
                    <component :is="item.icon" class="size-4.5 shrink-0" />
                    <span class="flex-1 truncate text-left">{{ t(item.labelKey) }}</span>
                    <ChevronDown
                      class="size-3.5 shrink-0 transition-transform duration-200"
                      :class="isExpanded(item.name) ? 'rotate-180' : ''"
                    />
                  </button>

                  <!-- Sub-items -->
                  <div v-if="isExpanded(item.name)" class="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                    <RouterLink
                      v-for="child in item.children"
                      :key="child.name"
                      :to="child.path"
                      :class="[
                        'flex items-center rounded-lg px-3 py-1.5 text-sm transition-all duration-150',
                        isActive(child.name)
                          ? 'text-primary font-semibold'
                          : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent',
                      ]"
                    >
                      {{ t(child.labelKey) }}
                    </RouterLink>
                  </div>
                </template>
              </template>

              <!-- ── Item WITHOUT children (plain link) ── -->
              <template v-else>
                <!-- Collapsed: icon + tooltip -->
                <template v-if="sidebarCollapsed">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <RouterLink
                        :to="item.path!"
                        :class="[
                          'flex items-center justify-center rounded-lg p-2 transition-all duration-150',
                          isActive(item.name)
                            ? 'bg-primary/10 text-primary'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        ]"
                      >
                        <component :is="item.icon" class="size-5 shrink-0" />
                      </RouterLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">{{ t(item.labelKey) }}</TooltipContent>
                  </Tooltip>
                </template>

                <!-- Expanded -->
                <RouterLink
                  v-else
                  :to="item.path!"
                  :class="[
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                    isActive(item.name)
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  ]"
                >
                  <component :is="item.icon" class="size-4.5 shrink-0" />
                  <span class="truncate">{{ t(item.labelKey) }}</span>
                </RouterLink>
              </template>

            </template>
          </div>
        </div>
      </TooltipProvider>
    </nav>
  </div>
</template>
