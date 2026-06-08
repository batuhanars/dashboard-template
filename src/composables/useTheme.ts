export function useTheme() {
  const ui = useUiStore()
  const { theme, isDark } = storeToRefs(ui)

  return {
    theme,
    isDark,
    toggle: ui.toggleTheme,
    set: ui.setTheme,
  }
}
