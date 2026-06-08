import type { Locale } from '@/stores/ui'

export function useLocale() {
  const ui = useUiStore()
  const { locale } = storeToRefs(ui)

  const available: Locale[] = ['tr', 'en']

  return {
    locale,
    setLocale: ui.setLocale,
    available,
  }
}
