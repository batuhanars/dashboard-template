import { i18n } from '@/lib/i18n'

export type Theme = 'light' | 'dark'
export type Locale = 'tr' | 'en'

export const useUiStore = defineStore('ui', () => {
  const theme = useStorage<Theme>('dashboard-theme', 'light')
  const locale = useStorage<Locale>('dashboard-locale', 'tr')
  const sidebarCollapsed = useStorage<boolean>('dashboard-sidebar-collapsed', false)

  const isDark = computed(() => theme.value === 'dark')

  watch(
    theme,
    (val) => {
      document.documentElement.classList.toggle('dark', val === 'dark')
    },
    { immediate: true },
  )

  function setTheme(value: Theme): void {
    theme.value = value
  }

  function toggleTheme(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setLocale(value: Locale): void {
    locale.value = value
    i18n.global.locale.value = value
  }

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebarCollapsed(value: boolean): void {
    sidebarCollapsed.value = value
  }

  return {
    theme,
    locale,
    sidebarCollapsed,
    isDark,
    setTheme,
    toggleTheme,
    setLocale,
    toggleSidebar,
    setSidebarCollapsed,
  }
})
