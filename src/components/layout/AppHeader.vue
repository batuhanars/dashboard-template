<script setup lang="ts">
import { Menu, Bell, Sun, Moon, LogOut, User } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const emit = defineEmits<{
  'open-mobile-menu': []
}>()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()
const { isDark, toggle: toggleTheme } = useTheme()
const { locale, setLocale, available } = useLocale()
const { t } = useI18n()

const notificationsOpen = ref(false)

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
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4"
  >
    <!-- Mobile menu trigger -->
    <button
      class="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
      :title="t('layout.openMenu')"
      @click="emit('open-mobile-menu')"
    >
      <Menu class="size-5" />
    </button>

    <!-- Breadcrumb -->
    <div class="flex-1 overflow-hidden">
      <AppBreadcrumb />
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1">
      <!-- Notifications -->
      <button
        class="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        :title="t('layout.notifications.title')"
        @click="notificationsOpen = true"
      >
        <Bell class="size-5" />
      </button>

      <!-- Theme toggle -->
      <button
        class="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        :title="t('theme.toggle')"
        @click="toggleTheme"
      >
        <Sun v-if="isDark" class="size-5" />
        <Moon v-else class="size-5" />
      </button>

      <!-- Locale toggle -->
      <button
        class="flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        :title="t('locale.toggle')"
        @click="nextLocale"
      >
        {{ locale.toUpperCase() }}
      </button>

      <!-- User menu -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar class="size-8">
              <AvatarFallback class="text-xs">{{ userInitials }}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-48">
          <div class="px-2 py-1.5">
            <p class="truncate text-sm font-medium text-foreground">{{ user?.name }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ user?.email }}</p>
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
            class="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
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
      <div class="flex flex-1 items-center justify-center py-12 text-sm text-muted-foreground">
        {{ t('layout.notifications.empty') }}
      </div>
    </SheetContent>
  </Sheet>
</template>
