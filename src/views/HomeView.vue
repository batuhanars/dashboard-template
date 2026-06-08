<script setup lang="ts">
const { t, locale } = useI18n()
const ui = useUiStore()
const { isDark } = storeToRefs(ui)

function handleToggleLocale() {
  ui.setLocale(locale.value === 'tr' ? 'en' : 'tr')
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
    <h1 class="text-2xl font-semibold">{{ t('foundation.title') }}</h1>
    <p class="text-muted-foreground">{{ t('foundation.description') }}</p>

    <div class="flex gap-3">
      <Button variant="outline" @click="ui.toggleTheme()">
        {{ isDark ? t('theme.light') : t('theme.dark') }}
      </Button>
      <Button variant="outline" @click="handleToggleLocale()">
        {{ locale === 'tr' ? t('locale.en') : t('locale.tr') }}
      </Button>
    </div>
  </div>
</template>
