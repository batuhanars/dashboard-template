<script setup lang="ts">
import { Menu, Bell, Sun, Moon, LogOut, User, Search } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { quickLinks } from '@/lib/nav'

const emit = defineEmits<{
  'open-mobile-menu': []
}>()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()
const route = useRoute()
const { isDark, toggle: toggleTheme } = useTheme()
const { locale, setLocale, available } = useLocale()
const { t } = useI18n()

const notificationsOpen = ref(false)
const searchQuery = ref('')

const userInitials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
  toast.success(t('auth.logout'))
}

function nextLocale(): void {
  const current = available.indexOf(locale.value)
  const next = available[(current + 1) % available.length]
  setLocale(next)
}

function isActive(name: string): boolean {
  return route.name === name
}
</script>

<template>
  <header class="border-border bg-background/95 backdrop-blur-sm flex h-16 shrink-0 items-center gap-3 border-b px-4">
    <!-- Mobile menu trigger -->
    <button
      class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-9 items-center justify-center rounded-lg transition-colors lg:hidden"
      :title="t('layout.openMenu')"
      @click="emit('open-mobile-menu')"
    >
      <Menu class="size-5" />
    </button>

    <!-- Quick nav links -->
    <nav class="hidden items-center gap-0.5 lg:flex">
      <RouterLink
        v-for="link in quickLinks"
        :key="link.name"
        :to="link.path"
        class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors"
        :class="isActive(link.name)
          ? 'bg-accent text-foreground font-medium'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'"
      >
        <component :is="link.icon" class="size-3.5 shrink-0" />
        {{ t(link.labelKey) }}
      </RouterLink>
    </nav>

    <div class="flex-1" />

    <!-- Actions -->
    <div class="flex items-center gap-1">
      <!-- Search bar -->
      <div class="relative hidden items-center sm:flex">
        <Search class="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('common.search')"
          class="border-border bg-muted/40 placeholder:text-muted-foreground/60 focus:ring-ring h-8 w-40 rounded-lg border pl-8 pr-3 text-sm transition-all outline-none focus:w-52 focus:ring-1"
        />
      </div>

      <!-- Notifications -->
      <button
        class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-9 items-center justify-center rounded-lg transition-colors"
        :title="t('layout.notifications.title')"
        @click="notificationsOpen = true"
      >
        <Bell class="size-5" />
      </button>

      <!-- Theme toggle -->
      <button
        class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-9 items-center justify-center rounded-lg transition-colors"
        :title="t('theme.toggle')"
        @click="toggleTheme"
      >
        <Sun v-if="isDark" class="size-5" />
        <Moon v-else class="size-5" />
      </button>

      <!-- Locale toggle -->
      <button
        class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors"
        :title="t('locale.toggle')"
        @click="nextLocale"
      >
        {{ locale.toUpperCase() }}
      </button>

      <!-- User menu -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            class="focus-visible:ring-ring flex items-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
          >
            <Avatar class="size-8">
              <AvatarFallback class="text-xs">{{ userInitials }}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-48">
          <div class="px-2 py-1.5">
            <p class="text-foreground truncate text-sm font-medium">{{ user?.name }}</p>
            <p class="text-muted-foreground truncate text-xs">{{ user?.email }}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem as-child>
            <RouterLink :to="'/settings'" class="flex cursor-pointer items-center gap-2">
              <User class="size-4" />
              {{ t('layout.user.profile') }}
            </RouterLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2"
            @click="handleLogout"
          >
            <LogOut class="size-4" />
            {{ t('layout.user.logout') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>

  <!-- Notifications panel -->
  <Sheet v-model:open="notificationsOpen">
    <SheetContent side="right" class="w-80">
      <SheetHeader>
        <SheetTitle>{{ t('layout.notifications.title') }}</SheetTitle>
      </SheetHeader>
      <div class="text-muted-foreground flex flex-1 items-center justify-center py-12 text-sm">
        {{ t('layout.notifications.empty') }}
      </div>
    </SheetContent>
  </Sheet>
</template>
